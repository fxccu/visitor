import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: './',
  publicDir: 'public',
  build: {
    assetsInclude: ['**/*.md'],
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      }
    }
  },
  define: {
    'process.env.VITE_API_URL': JSON.stringify('https://visitor-api.oadev.cn/')
  }
}) 