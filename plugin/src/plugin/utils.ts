const fileKey: string = figma.fileKey != undefined ? `${figma.fileKey}_` : ''

export const getData = (key: string): Promise<any | undefined> => {
  return figma.clientStorage.getAsync(fileKey + key)
}

export const setData = (key: string, data: any): Promise<void> => {
  return figma.clientStorage.setAsync(fileKey + key, data)
}
