import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { viteStaticCopy } from 'vite-plugin-static-copy'

import { crx } from '@crxjs/vite-plugin'
import manifest from './public/manifest.json' assert { type: 'json' }

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    crx({ manifest }),
    viteStaticCopy({
      targets: [
        {
          src: 'node_modules/bootstrap-icons/font/fonts/*',
          dest: 'fonts'
        }
      ],
   })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  build: {
    rollupOptions: {
      input: {
        background: 'src/scripts/background.js',
        popup: 'src/popup/popup.html',
        dashboard: 'src/dashboard/dashboard.html',
        block: 'src/block/block.html',
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'popup') {
            return 'src/popup/popup.js';
          }
          if (chunkInfo.name === 'dashboard') {
            return 'src/dashboard/dashboard.js';
          }
          if (chunkInfo.name === 'background') {
            return 'scripts/background.js';
          }
          if (chunkInfo.name === 'block'){
            return 'src/block/block.js';
          }
          return '[name].js';
        },
      },
      commonjsOptions: {
        include: [/node_modules/],
        format: 'iife',
      },
      external: []
    },
  },

})
