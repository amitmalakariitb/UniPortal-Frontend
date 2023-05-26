import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 8000,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:7000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/')
      },
    },
  },
  plugins: [vue(), svgLoader({
    svgoConfig: {
      multipass: true
    }
  })],
  resolve: { 
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
