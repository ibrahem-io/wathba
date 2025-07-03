import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/elasticsearch': {
        target: 'https://my-elasticsearch-project-f3e988.es.us-central1.gcp.elastic.cloud:443',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/elasticsearch/, ''),
        headers: {
          'Authorization': 'ApiKey T1B1OHpKY0JGTzVJOXhyWUYtUW86clpsb3ZJVzV0Q0dOSlBFdTFUQ3RKdw=='
        },
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response:', proxyRes.statusCode, req.url);
          });
        },
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'lucide-react'],
          elasticsearch: ['./src/services/elasticsearchService.ts'],
          openai: ['./src/services/openaiService.ts']
        }
      }
    }
  }
})