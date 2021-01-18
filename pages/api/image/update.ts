import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from 'libs/database'
import Image from 'models/Image'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const params = JSON.parse(req.body || '{}')
  const { id, ...attributes } = params

  await dbConnect()
  const image = await Image.updateOne({ id }, { removed: false, ...attributes })

  res.json(image)
}
