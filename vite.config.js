import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import { crx } from '@crxjs/vite-plugin'
import manifest from './public/manifest.json' assert { type: 'json' }

export default defineConfig(({ mode }) => {
  const isBlockBuild = mode === 'block'

  if (isBlockBuild) {
    return {
      plugins: [vue()],
      define: {
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
      },
      resolve: {
        alias: {
          '@': fileURLToPath(new URL('./src', import.meta.url))
        },
      },
      build: {
        lib: {
          entry: fileURLToPath(new URL('./src/block/block.js', import.meta.url)),
          name: 'BlockPage',
          fileName: 'block',
          formats: ['iife']
        },
        outDir: 'dist/src/block/',
        emptyOutDir: false,
        rollupOptions: {
          output: {
            entryFileNames: 'block.js',
          },
        },
      },
    }
  }

  return {
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
    define: {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
    build: {
      rollupOptions: {
        input: {
          content: 'src/scripts/content.js',
          popup: 'src/popup/popup.html',
          dashboard: 'src/dashboard/dashboard.html',
        },
        output: {
          entryFileNames: (chunkInfo) => {
            if (chunkInfo.name === 'popup') return 'src/popup/popup.js'
            if (chunkInfo.name === 'dashboard') return 'src/dashboard/dashboard.js'
            if (chunkInfo.name === 'content') return 'src/scripts/content.js'
            return '[name].js'
          },
        },
        commonjsOptions: {
          include: [/node_modules/],
          format: 'iife',
        },
      },
    },
  }
})