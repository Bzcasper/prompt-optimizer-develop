import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 加载环境变量（从项目根目录加载）
  const env = loadEnv(mode, resolve(process.cwd(), '../../'))
  
  return {
    plugins: [vue()],
    server: {
      port: 18181,
      host: true,
      fs: {
        // 允许为工作区依赖提供服务
        allow: ['..']
      },
      hmr: true,
      watch: {
        // 确保监视monorepo中其他包的变化
        ignored: ['!**/node_modules/@prompt-optimizer/**']
      }
    },
    build: {
      cssCodeSplit: true,
      sourcemap: false,
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html')
        },
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('naive-ui')) return 'vendor-naive-ui'
              if (id.includes('markdown-it') || id.includes('highlight.js') || id.includes('dompurify')) return 'vendor-markdown'
              if (id.includes('/vue')) return 'vendor-vue'
            }
          }
        }
      }
    },
    publicDir: 'public',
    resolve: {
      preserveSymlinks: true,
      alias: {
        '@': resolve(__dirname, 'src')
      }
    },
    define: {
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
        ...Object.keys(env).reduce((acc, key) => {
          acc[key] = env[key];
          return acc;
        }, {})
      }
    }
  }
})