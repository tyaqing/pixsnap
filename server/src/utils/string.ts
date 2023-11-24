import { customAlphabet } from 'nanoid'

export function randomString(length) {
  const nanoid = customAlphabet(
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
    length,
  )
  return nanoid()
}
