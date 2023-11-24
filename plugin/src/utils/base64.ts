export const toBase64 = (buffer: Uint8Array) => {
  return btoa(
    buffer.reduce(function (data, byte) {
      return data + String.fromCharCode(byte)
    }, ''),
  )
}
