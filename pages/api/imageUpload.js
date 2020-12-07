const { BlobServiceClient } = require('@azure/storage-blob')
const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.ASURE_CONNECTION_STRING)
const getStream = require('into-stream')
import { sha256 } from 'libs/crypto'

const ONE_MEGABYTE = 1024 * 1024
const uploadOptions = { bufferSize: 4 * ONE_MEGABYTE, maxBuffers: 20 }
const containerName = 'qdh-test'

export default async (req, res) => {
  const { picture, title, link } = JSON.parse(req.body)
  const [blob, ext] = dataURItoBlob(picture)
  const imageSHA256 = sha256(blob)
  const blobName = `${imageSHA256}.${ext}`

  const data = await upload({
    blob,
    blobName,
    ext,
    containerName,
  })

  res.json({
    url: `https://qdh.blob.core.windows.net/${containerName}/${blobName}`,
    imageSHA256,
    imageDataSHA256: sha256(picture),
    title,
    link,
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
