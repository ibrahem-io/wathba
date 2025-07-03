// vite.config.ts
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api/elasticsearch": {
        target: process.env.VITE_ELASTIC_URL || "https://localhost:9200",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/elasticsearch/, ""),
        headers: {
          "Authorization": process.env.VITE_ELASTIC_API_KEY ? `ApiKey ${process.env.VITE_ELASTIC_API_KEY}` : ""
        },
        configure: (proxy, _options) => {
          proxy.on("error", (err, _req, _res) => {
            console.log("Elasticsearch proxy error:", err.message);
          });
          proxy.on("proxyReq", (proxyReq, req, _res) => {
            console.log("Sending Request to Elasticsearch:", req.method, req.url);
          });
          proxy.on("proxyRes", (proxyRes, req, _res) => {
            console.log("Received Response from Elasticsearch:", proxyRes.statusCode, req.url);
          });
        }
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "lucide-react"],
          elasticsearch: ["./src/services/elasticsearchService.ts"],
          openai: ["./src/services/openaiService.ts"]
        }
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW3JlYWN0KCldLFxuICBzZXJ2ZXI6IHtcbiAgICBwcm94eToge1xuICAgICAgJy9hcGkvZWxhc3RpY3NlYXJjaCc6IHtcbiAgICAgICAgdGFyZ2V0OiBwcm9jZXNzLmVudi5WSVRFX0VMQVNUSUNfVVJMIHx8ICdodHRwczovL2xvY2FsaG9zdDo5MjAwJyxcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICByZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKC9eXFwvYXBpXFwvZWxhc3RpY3NlYXJjaC8sICcnKSxcbiAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICdBdXRob3JpemF0aW9uJzogcHJvY2Vzcy5lbnYuVklURV9FTEFTVElDX0FQSV9LRVkgPyBgQXBpS2V5ICR7cHJvY2Vzcy5lbnYuVklURV9FTEFTVElDX0FQSV9LRVl9YCA6ICcnXG4gICAgICAgIH0sXG4gICAgICAgIGNvbmZpZ3VyZTogKHByb3h5LCBfb3B0aW9ucykgPT4ge1xuICAgICAgICAgIHByb3h5Lm9uKCdlcnJvcicsIChlcnIsIF9yZXEsIF9yZXMpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdFbGFzdGljc2VhcmNoIHByb3h5IGVycm9yOicsIGVyci5tZXNzYWdlKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBwcm94eS5vbigncHJveHlSZXEnLCAocHJveHlSZXEsIHJlcSwgX3JlcykgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ1NlbmRpbmcgUmVxdWVzdCB0byBFbGFzdGljc2VhcmNoOicsIHJlcS5tZXRob2QsIHJlcS51cmwpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHByb3h5Lm9uKCdwcm94eVJlcycsIChwcm94eVJlcywgcmVxLCBfcmVzKSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnUmVjZWl2ZWQgUmVzcG9uc2UgZnJvbSBFbGFzdGljc2VhcmNoOicsIHByb3h5UmVzLnN0YXR1c0NvZGUsIHJlcS51cmwpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgYnVpbGQ6IHtcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBvdXRwdXQ6IHtcbiAgICAgICAgbWFudWFsQ2h1bmtzOiB7XG4gICAgICAgICAgdmVuZG9yOiBbJ3JlYWN0JywgJ3JlYWN0LWRvbScsICdsdWNpZGUtcmVhY3QnXSxcbiAgICAgICAgICBlbGFzdGljc2VhcmNoOiBbJy4vc3JjL3NlcnZpY2VzL2VsYXN0aWNzZWFyY2hTZXJ2aWNlLnRzJ10sXG4gICAgICAgICAgb3BlbmFpOiBbJy4vc3JjL3NlcnZpY2VzL29wZW5haVNlcnZpY2UudHMnXVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59KSJdLAogICJtYXBwaW5ncyI6ICI7QUFBeU4sU0FBUyxvQkFBb0I7QUFDdFAsT0FBTyxXQUFXO0FBR2xCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVMsQ0FBQyxNQUFNLENBQUM7QUFBQSxFQUNqQixRQUFRO0FBQUEsSUFDTixPQUFPO0FBQUEsTUFDTCxzQkFBc0I7QUFBQSxRQUNwQixRQUFRLFFBQVEsSUFBSSxvQkFBb0I7QUFBQSxRQUN4QyxjQUFjO0FBQUEsUUFDZCxTQUFTLENBQUMsU0FBUyxLQUFLLFFBQVEseUJBQXlCLEVBQUU7QUFBQSxRQUMzRCxTQUFTO0FBQUEsVUFDUCxpQkFBaUIsUUFBUSxJQUFJLHVCQUF1QixVQUFVLFFBQVEsSUFBSSxvQkFBb0IsS0FBSztBQUFBLFFBQ3JHO0FBQUEsUUFDQSxXQUFXLENBQUMsT0FBTyxhQUFhO0FBQzlCLGdCQUFNLEdBQUcsU0FBUyxDQUFDLEtBQUssTUFBTSxTQUFTO0FBQ3JDLG9CQUFRLElBQUksOEJBQThCLElBQUksT0FBTztBQUFBLFVBQ3ZELENBQUM7QUFDRCxnQkFBTSxHQUFHLFlBQVksQ0FBQyxVQUFVLEtBQUssU0FBUztBQUM1QyxvQkFBUSxJQUFJLHFDQUFxQyxJQUFJLFFBQVEsSUFBSSxHQUFHO0FBQUEsVUFDdEUsQ0FBQztBQUNELGdCQUFNLEdBQUcsWUFBWSxDQUFDLFVBQVUsS0FBSyxTQUFTO0FBQzVDLG9CQUFRLElBQUkseUNBQXlDLFNBQVMsWUFBWSxJQUFJLEdBQUc7QUFBQSxVQUNuRixDQUFDO0FBQUEsUUFDSDtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsZUFBZTtBQUFBLE1BQ2IsUUFBUTtBQUFBLFFBQ04sY0FBYztBQUFBLFVBQ1osUUFBUSxDQUFDLFNBQVMsYUFBYSxjQUFjO0FBQUEsVUFDN0MsZUFBZSxDQUFDLHdDQUF3QztBQUFBLFVBQ3hELFFBQVEsQ0FBQyxpQ0FBaUM7QUFBQSxRQUM1QztBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
