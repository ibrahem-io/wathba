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
          'Authorization': `ApiKey T1B1OHpKY0JGTzVJOXhyWUYtUW86clpsb3ZJVzV0Q0dOSlBFdTFUQ3RKdw==`
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
            
            // Add CORS headers to the response
            _res.setHeader('Access-Control-Allow-Origin', '*');
            _res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            _res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
            
            // Handle preflight requests
            if (req.method === 'OPTIONS') {
              _res.statusCode = 200;
              _res.end();
            }
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