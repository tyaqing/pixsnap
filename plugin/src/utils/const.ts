import { Format } from '@/types/interface.ts'

export const SCALE_LIST = [0.5, 1, 2, 3, 4, 5]

export const FORMAT_LIST = [
  {
    name: 'PNG',
    value: Format.PNG,
  },
  {
    name: 'JPG',
    value: Format.JPG,
  },
  {
    name: 'SVG',
    value: Format.SVG,
  },
]

export const HISTORY_NUM = 10

export const FIGMA_CLIENT_MAX_WIDTH = 640
export const FIGMA_CLIENT_MIN_WIDTH = 300

export enum LANG {
  EN_US = 'en-US',
  ZH_CN = 'zh-CN',
  JA_JP = 'ja-JP',
}

export const LANG_LIST = [
  {
    key: LANG.EN_US,
    name: '🇺🇸 English',
    shortName: 'English',
  },
  {
    key: LANG.ZH_CN,
    name: '🇨🇳 简体中文',
    shortName: '简体中文',
  },
  {
    key: LANG.JA_JP,
    name: '🇯🇵 日本語',
    shortName: '日本語',
  },
]
