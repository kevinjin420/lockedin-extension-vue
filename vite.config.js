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
        // {
        //   src: 'src/scripts/background.js',
        //   dest: 'background',
        // },
        // {
        //   src: 'popup.html',
        //   dest: '',
        // },
        // {
        //   src: 'dashboard.html',
        //   dest: '',
        // },
        // {
        //   src: 'src/icons',
        //   dest: '',
        // },
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
        // popup: 'src/popup/popup.js',
        // dashboard: 'src/dashboard/dashboard.js',
        background: 'src/scripts/background.js',
        popup: 'src/popup/popup.html',
        dashboard: 'src/dashboard/dashboard.html',

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
          return '[name].js'; // Fallback for any other files
        },
      },
      commonjsOptions: {
        include: [/node_modules/], // Include dependencies in the bundle
        format: 'iife',
      },
      external: []
    },
  },

})
