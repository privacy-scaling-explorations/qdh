import { BlobServiceClient } from '@azure/storage-blob'
import getStream from 'into-stream'
import { sha256 } from 'libs/crypto'
import dbConnect from 'libs/database'
import Image from 'models/Image'

const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.ASURE_CONNECTION_STRING)
const ONE_MEGABYTE = 1024 * 1024
const uploadOptions = { bufferSize: 4 * ONE_MEGABYTE, maxBuffers: 20 }
const containerName = process.env.AZURE_CONTAINER_NAME || 'qdh-user-images'

export default async (req, res) => {
  const { picture } = JSON.parse(req.body)
  const [blob, ext] = dataURItoBlob(picture)
  const imageSHA256 = sha256(picture)
  const blobName = `${imageSHA256}.${ext}`

  const data = await upload({ blob, blobName, ext, containerName })

  await dbConnect()
  const index = await Image.countDocuments()
  const image = await Image.create({
    hash: imageSHA256,
    index: index,
    url: `https://qdh.blob.core.windows.net/${containerName}/${blobName}`,
  })

  res.json({
    url: `https://qdh.blob.core.windows.net/${containerName}/${blobName}`,
    imageSHA256,
    index,
    ...data,
  })
}

async function upload({ blob, blobName, ext, containerName }) {
  const stream = getStream(blob)
  const containerClient = blobServiceClient.getContainerClient(containerName)
  const blockBlobClient = containerClient.getBlockBlobClient(blobName)

  const uploadBlobResponse = await blockBlobClient.uploadStream(
    stream,
    uploadOptions.bufferSize,
    uploadOptions.maxBuffers,
    { blobHTTPHeaders: { blobContentType: `image/${ext}` } }
  )

  console.log(`Upload block blob ${blobName} successfully`, uploadBlobResponse.requestId)
  return uploadBlobResponse
}

async function listContainers() {
  let i = 1
  let containers = blobServiceClient.listContainers()
  for await (const container of containers) {
    console.log(`Container ${i++}: ${container.name}`)
  }
}

async function createContainer(containerName) {
  const containerClient = blobServiceClient.getContainerClient(containerName)
  const createContainerResponse = await containerClient.create()
  console.log(`Create container ${containerName} successfully`, createContainerResponse.requestId)
}

function dataURItoBlob(uri) {
  const matches = uri.match(/^data:.+\/(.+);base64,(.*)$/)
  const ext = matches[1]
  const buffer = Buffer.from(matches[2], 'base64')
  return [buffer, ext]
}
