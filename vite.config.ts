import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/elasticsearch': {
        target: process.env.VITE_ELASTIC_URL || 'https://localhost:9200',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/elasticsearch/, ''),
        headers: {
          'Authorization': process.env.VITE_ELASTIC_API_KEY ? `ApiKey ${process.env.VITE_ELASTIC_API_KEY}` : ''
        },
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('Elasticsearch proxy error:', err.message);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request to Elasticsearch:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response from Elasticsearch:', proxyRes.statusCode, req.url);
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