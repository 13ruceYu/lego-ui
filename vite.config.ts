/// <reference types="vitest" />
import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

export default defineConfig({
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
        target: loadEnv(process.env.NODE_ENV as string, './').VITE_APP_BASE_URL,
        changeOrigin: true,
      },
    },
  },
})
