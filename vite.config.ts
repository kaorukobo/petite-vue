import {defineConfig} from 'vite'
import {resolve} from 'node:path'

// Set DEBUG_BUILD=1 to build the debug version and sourcemaps
const isDebug = process.env.DEBUG_BUILD === '1'

export default defineConfig({
  define: {
    // NODE_ENV setting (required even for debug builds)
    'process.env.NODE_ENV': JSON.stringify('production')
  },
  build: {
    target: 'esnext',
    minify: isDebug ? false : 'terser',
    sourcemap: isDebug,
    // Don't remove previously done release build on debug build
    emptyOutDir: !isDebug,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'PicoVue',
      formats: ['es', 'umd', 'iife'],
      fileName: (format) => `pico-vue.${format}${isDebug ? '.debug' : ''}.js`
    },
    rollupOptions: {
      plugins: [
        {
          name: 'remove-collection-handlers',
          transform(code, id) {
            if (id.endsWith('reactivity.esm-bundler.js')) {
              return code
                .replace(`mutableCollectionHandlers,`, `null,`)
                .replace(`readonlyCollectionHandlers,`, `null,`)
            }
          }
        }
      ]
    }
  }
})
