import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { crx } from '@crxjs/vite-plugin'
import manifest from './manifest.json'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),crx({ manifest })],
  server: {
    host: '127.0.0.1',
    port: 5500
  }
})