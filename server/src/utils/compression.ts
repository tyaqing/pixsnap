import { cpus } from 'os'
import { ImagePool } from '@squoosh/lib'
import tinify from 'tinify'

const imagePool = new ImagePool(cpus().length)

export async function squooshCompression(fileBuffer: ArrayBuffer): Promise<Uint8Array> {
  const image = imagePool.ingestImage(fileBuffer)
  await image.encode({
    mozjpeg: {
      quality: 90,
    },
  })
  const binary = await image.encodedWith.mozjpeg?.binary
  if (!binary) throw new Error('no binary')
  return binary
}

export async function tinifyCompression(fileBuffer: Buffer): Promise<Uint8Array> {
  const tinifyKey = process.env.TINIFY_KEY
  // if tinify key is set, use tinify to compress
  if (tinifyKey) {
    tinify.key = tinifyKey
    return tinify.fromBuffer(fileBuffer).toBuffer()
  } else {
    return new Uint8Array(fileBuffer)
  }
}
export const tinifyInstance = tinify
