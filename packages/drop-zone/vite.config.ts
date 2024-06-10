import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import pkg from './package.json'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact()],
  build: {
    lib: {
      entry: resolve(__dirname, 'lib/index.ts'),
      name: 'UploadButton',
      formats: ['cjs', 'es'],
    },
    minify: false,
    sourcemap: 'inline',
    rollupOptions: {
      external: [
        ...Object.keys(pkg.peerDependencies),
        'preact/hooks',
      ],
    },
  },
})
