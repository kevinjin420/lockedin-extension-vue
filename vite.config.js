import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { viteStaticCopy } from 'vite-plugin-static-copy'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    viteStaticCopy({
     targets: [
       {
         src: 'scripts/background.js',
         dest: 'scripts',
       },
       {
         src: 'index.html',
         dest: ''
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
        content: '/src/main.js', // Build `main.js` as the content script
        background: 'scripts/background.js', // Add `background.js` as another entry point
      },
      output: {
        entryFileNames: (chunkInfo) => {
          // Dynamically name files based on their entry point
          if (chunkInfo.name === 'content') {
            return 'main.js'; // Output content script as `main.js`
          }
          if (chunkInfo.name === 'background') {
            return 'scripts/background.js'; // Output background script into `background/`
          }
          // return '[name].js'; // Default naming for other files
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
