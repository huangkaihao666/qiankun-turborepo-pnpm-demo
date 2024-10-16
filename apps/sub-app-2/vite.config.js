import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { name } from './package.json';
import qiankun from 'vite-plugin-qiankun'

export default defineConfig({
  plugins: [
    vue(),
    qiankun('sub-app-2', { // 微应用名字，与主应用注册的微应用名字保持一致
      useDevMode: true
    })
  ],
  server: {
    port: 8092,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  build: {
    rollupOptions: {
      input: 'src/main.js', // 或者 'src/main.ts'
      output: {
        entryFileNames: `[name].js`,
        chunkFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`,
        format: 'umd',
        name: `${name}-[name]`,
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
});