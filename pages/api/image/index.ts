import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from 'libs/database'
import Image from 'models/Image'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const params = JSON.parse(req.body || '{}')

  await dbConnect()
  const images = await Image.find({ removed: false, ...params })

  res.json(images)
}
