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
        }
      }
    }
  }
})