import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { crx } from '@crxjs/vite-plugin'
import manifest from './manifest.json'

export default ({mode}: { mode: string }) => {
  return defineConfig({
    plugins: [react(), crx({ manifest })],
    define: {
      'process.env':{...process.env, ...loadEnv(mode, process.cwd())}
    },
    server: {
      port: 5500,
      proxy: {
        '/apiChat': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/apiChat/, '')
        }
      }
    }
  });
}
