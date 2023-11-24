import {
  ExportDefault,
  ExportOption,
  Format,
  PluginMessageType,
  Preview,
  UiMessage,
  UiMessageType,
} from '../types/interface'
import { getData, setData } from './utils'

const SVGSetting: ExportSettings = {
  format: 'SVG',
}
const getExportSetting = (format: 'PNG' | 'JPG', scale = 1): ExportSettings => {
  return {
    format: format,
    constraint: {
      type: 'SCALE',
      value: scale,
    },
  }
}

const sleep = (ms: number) => {
  return new Promise((r) => setTimeout(r, ms))
}

const exportAsync = async (node: SceneNode, setting: ExportSettings): Promise<Uint8Array> => {
  await sleep(1)
  return node.exportAsync(setting)
}

interface TmpExport {
  name: string
  node: SceneNode
}

const getPreview = async (node: SceneNode): Promise<Preview> => {
  return {
    id: node.id,
    name: node.name.toLowerCase().replace(/ /gi, ''),
    buffer: await node.exportAsync({
      format: 'PNG',
      constraint: {
        type: 'SCALE',
        value: 1,
      },
    }),
  }
}

if (figma.editorType !== 'dev' && figma.currentPage.selection.length <= 0) {
  figma.notify('Select Layer', {
    error: true,
    timeout: 2000,
  })
} else {
  figma.showUI(__html__, { themeColors: true, height: 320, width: 560 })
  Promise.all(figma.currentPage.selection.map((node) => getPreview(node))).then((preview) => {
    figma.ui.postMessage({
      type: PluginMessageType.PREVIEW,
      data: preview,
    })
  })
}

if (figma.editorType === 'dev') {
  figma.on('selectionchange', () => {
    if (figma.currentPage.selection.length > 0) {
      Promise.all(figma.currentPage.selection.map((node) => getPreview(node))).then((preview) => {
        figma.ui.postMessage({
          type: PluginMessageType.PREVIEW,
          data: preview,
        })
      })
    }
  })
}

figma.ui.onmessage = async (msg: UiMessage) => {
  const { type, data, messageId } = msg
  switch (type) {
    case UiMessageType.ERROR: {
      figma.notify(data, {
        error: true,
        timeout: 2000,
      })
      break
    }
    case UiMessageType.USER_GET: {
      figma.ui.postMessage({
        type: UiMessageType.USER_GET,
        data: {
          id: figma.currentUser?.id || '',
          name: figma.currentUser?.name || '',
        },
        messageId,
      })
      break
    }
    case UiMessageType.STORAGE_SET: {
      setData(data.key, data.value)
      break
    }
    case UiMessageType.STORAGE_GET: {
      getData(data).then((value) => {
        figma.ui.postMessage({
          type: UiMessageType.STORAGE_GET,
          data: value,
          messageId,
        })
      })
      break
    }
    case UiMessageType.MESSAGE: {
      figma.notify(data, {
        timeout: 1000,
      })
      break
    }
    case UiMessageType.UPLOAD:
      {
        const { preview, scale, format }: ExportOption = data
        let exportSetting: ExportSettings = SVGSetting
        switch (format) {
          case Format.PNG:
            {
              exportSetting = getExportSetting('PNG', scale)
            }
            break
          case Format.JPG:
            {
              exportSetting = getExportSetting('JPG', scale)
            }
            break
        }

        const tmps: TmpExport[] = []
        preview.map((pre) => {
          const node = figma.currentPage.findOne((node) => node.id == pre.id)
          if (node != null) {
            const tmpNames = pre.name.split('/')
            tmpNames[tmpNames.length - 1] = tmpNames[tmpNames.length - 1]
            const tmpName = tmpNames.join('/')
            tmps.push({
              name: tmpName,
              node: node,
            })
          }
        })
        const exports: ExportDefault[] = []
        for (const tmp of tmps) {
          const exportData = {
            name: tmp.name,
            format: format,
            buffer: await exportAsync(tmp.node, exportSetting),
          }
          exports.push(exportData)
        }
        figma.ui.postMessage({
          type: PluginMessageType.UPLOAD,
          data: exports,
          messageId,
        })
      }
      break
  }
}
