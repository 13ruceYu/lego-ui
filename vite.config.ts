/// <reference types="vitest" />
import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }
  const { VITE_APP_DEV_WEB_URL } = process.env

  return defineConfig({
    plugins: [vue(), vueJsx()],
    resolve: {
      alias: {
        '@/': `${path.resolve(__dirname, 'src')}/`,
      },
    },
    // https://github.com/vitest-dev/vitest
    test: {
      include: ['test/**/*.test.ts'],
      environment: 'jsdom',
      deps: {
        inline: ['@vue'],
      },
    },
    server: {
      proxy: {
        '/api': {
          // target: 'http://localhost:7001',
          target: VITE_APP_DEV_WEB_URL,
          changeOrigin: true,
        },
      },
    },
    base: '/',
  })
}
