import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import { useGlobalStore } from '@/stores/useGlobalStore.ts'
import { LANG } from '@/utils/const.ts'
const state = useGlobalStore.getState()
// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  'zh-CN': {
    translation: {
      Start: '开始体验',
      'Figma Plugin': 'Figma插件',
      Language: '语言',
      Destination: '上传目标',
      Change: '更改',
      'Clear History': '清空历史',
      'Upload Record': '上传记录',
      'No Record': '无记录',
      'Simplify Your': '简化您的',
      'image upload experience!': '图片上传体验!',
      Save: '保存',
      'Not Selected': '未选择',
      'Open-source, customizable, MIT licensed': '开源，可定制，MIT许可',
      'User-friendly: Figma Plugin and Web App': '用户友好：Figma插件和Web应用',
      'Compatible with various cloud storages': '兼容各种云存储',
      'Auto image compression: mozjpeg, tinypng': '自动图像压缩：mozjpeg，tinypng',
      'Quick Docker deployment in minutes': '快速Docker部署在几分钟内',
      'Team-friendly: Easy permission configuration': '团队友好：简单的权限配置',
      'PNG, JPG or SVG up to 5MB': '支持5M以内的PNG、JPG、SVG 文件',
      'Please select a layer,': '请选择一个图层，',
      'Drop your file here,': '拖动文件到这，',
      'or Browse': '或者从本地上传',
      'File Name': '文件名',
      Upload: '上传',
      'Please select a layer.': '请选择一个图层',
      'Local History': '本地历史',
      Clear: '清空',
      'PixSnap is a robust image hosting tool that enables fast image uploads on the web and Figma. It automatically compresses images and integrates with popular object storage services like S3 and Cloudflare.':
        'PixSnap是一款强大的图床工具，可在Web网页和Figma中快速上传图片，并自动压缩，集成多种对象存储服务。',
    },
  },
  'en-US': {
    translation: {
      Start: 'Begin Experience',
      'Figma Plugin': 'Figma Plugin',
      Language: 'Language',
      Destination: 'Upload Destination',
      Change: 'Modify',
      'Clear History': 'Clear History',
      'Upload Record': 'Upload History',
      'No Record': 'No Records',
      'Simplify Your': 'Simplify Your',
      'image upload experience!': 'Image Uploading Experience!',
      Save: 'Save',
      'Not Selected': 'Not Selected',
      'Open-source, customizable, MIT licensed': 'Open-source, customizable, MIT licensed',
      'User-friendly: Figma Plugin and Web App': 'User-friendly: Figma Plugin and Web App',
      'Compatible with various cloud storages': 'Compatible with various cloud storages',
      'Auto image compression: mozjpeg, tinypng': 'Auto image compression: mozjpeg, tinypng',
      'Quick Docker deployment in minutes': 'Quick Docker deployment in minutes',
      'Team-friendly: Easy permission configuration':
        'Team-friendly: Easy permission configuration',
      'PNG, JPG or SVG up to 5MB': 'Supports PNG, JPG, SVG Files Up to 5MB',
      'Please select a layer,': 'Please Select a Layer,',
      'Drop your file here,': 'Drag Your File Here,',
      'or Browse': 'or Browse',
      'File Name': 'File Name',
      Upload: 'Upload',
      'Please select a layer.': 'Please Select a Layer',
      'Local History': 'Local History',
      Clear: 'Clear',
      'PixSnap is a robust image hosting tool that enables fast image uploads on the web and Figma. It automatically compresses images and integrates with popular object storage services like S3 and Cloudflare.':
        'PixSnap is a robust image hosting tool that facilitates rapid image uploads on the web and Figma. It automatically compresses images and integrates with popular object storage services such as S3 and Cloudflare.',
    },
  },
  'ja-JP': {
    translation: {
      Start: '体験を始める',
      'Figma Plugin': 'Figmaプラグイン',
      Language: '言語',
      Destination: 'アップロード先',
      Change: '変更',
      'Clear History': '履歴をクリア',
      'Upload Record': 'アップロード履歴',
      'No Record': '記録なし',
      'Simplify Your': 'あなたの',
      'image upload experience!': '画像アップロード体験を簡単に！',
      Save: '保存',
      'Not Selected': '未選択',
      'Open-source, customizable, MIT licensed': 'オープンソース、カスタマイズ可能、MITライセンス',
      'User-friendly: Figma Plugin and Web App': 'ユーザーフレンドリー：FigmaプラグインとWebアプリ',
      'Compatible with various cloud storages': 'さまざまなクラウドストレージと互換性',
      'Auto image compression: mozjpeg, tinypng': '自動画像圧縮：mozjpeg、tinypng',
      'Quick Docker deployment in minutes': '数分でのクイックDockerデプロイメント',
      'Team-friendly: Easy permission configuration': 'チームフレンドリー：簡単な権限設定',
      'PNG, JPG or SVG up to 5MB': '5MBまでのPNG、JPG、SVGファイルをサポート',
      'Please select a layer,': 'レイヤーを選択してください、',
      'Drop your file here,': 'ここにファイルをドロップ、',
      'or Browse': 'またはローカルからアップロード',
      'File Name': 'ファイル名',
      Upload: 'アップロード',
      'Please select a layer.': 'レイヤーを選択してください。',
      'Local History': 'ローカル履歴',
      Clear: 'クリア',
      'PixSnap is a robust image hosting tool that enables fast image uploads on the web and Figma. It automatically compresses images and integrates with popular object storage services like S3 and Cloudflare.':
        'PixSnapは、WebやFigmaでの高速な画像アップロードを可能にする堅牢な画像ホスティングツールです。画像を自動的に圧縮し、S3やCloudflareなどの人気のあるオブジェクトストレージサービスと統合します。',
    },
  },
}

i18n.use(initReactI18next).init({
  resources,
  lng: state.lang,
  interpolation: {
    escapeValue: false,
  },
  fallbackLng: LANG.EN_US,
})

export default i18n
