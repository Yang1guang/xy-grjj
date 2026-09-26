import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// 终极商业级构建配置
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext', // 采用现代浏览器极速解析标准
    minify: 'esbuild',
    chunkSizeWarningLimit: 1500, // 提高警告阈值，保持控制台整洁
    rollupOptions: {
      output: {
        // 核心优化：智能代码分块 (Chunk Splitting)，避免单文件过大，实现网页秒开
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('framer-motion')) return 'engine-motion'; // 动画引擎分离
            if (id.includes('react') || id.includes('react-dom')) return 'engine-core'; // 核心框架分离
            if (id.includes('lucide-react')) return 'engine-icons'; // 图标库分离
            return 'vendor'; // 其他底层依赖
          }
        }
      }
    }
  },
  esbuild: {
    // 极致安全：打包时强制抹除所有的 console 和 debugger，保护商业后台逻辑
    drop: ['console', 'debugger'],
  }
});
