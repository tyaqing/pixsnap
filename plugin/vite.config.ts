import react from '@vitejs/plugin-react-swc'
import path from 'path'
import * as process from 'process'
import { defineConfig } from 'vite'
import { splitVendorChunkPlugin } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

const buildTarget = process.env.VITE_BUILD_TARGET || 'plugin'
const plugins = []

if (buildTarget === 'plugin') {
  plugins.push(viteSingleFile({}))
} else {
  plugins.push(splitVendorChunkPlugin())
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), ...plugins],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  esbuild: {},
  mode: process.env.NODE_ENV || 'production',
  build: {
    minify: process.env.NO_MINIFY ? false : 'terser',
    target: 'esnext',
    assetsInlineLimit: process.env.BUILD_TARGET !== 'plugin' ? 4096 : 100000000,
    chunkSizeWarningLimit: process.env.BUILD_TARGET !== 'plugin' ? 500 : 100000000,
    cssCodeSplit: false,
    outDir: path.resolve(__dirname, ''),
    assetsDir: '',
    rollupOptions:
      buildTarget !== 'plugin'
        ? {
            output: {
              dir: path.resolve(__dirname, './dist_web'),
              manualChunks: {
                chakra: [
                  '@chakra-ui/anatomy',
                  '@chakra-ui/pro-theme',
                  '@chakra-ui/react',
                  '@chakra-ui/styled-system',
                  '@chakra-ui/utils',
                ],
              },
            },
          }
        : {
            output: {
              inlineDynamicImports: false,
              chunkFileNames: '[name].js',
              entryFileNames: '[name].js',
              assetFileNames: '[name][extname]',
              // inlineDynamicImports: false,
              dir: path.resolve(__dirname, './dist'),
              // manualChunks:undefined,
            },
            input: {
              ui: path.resolve(__dirname, 'index.html'),
            },
          },
  },
})
