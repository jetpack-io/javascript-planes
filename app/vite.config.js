import vue from '@vitejs/plugin-vue';

export default {
  plugins: [vue()],
  build: {
    outDir: '../api/public'
  },
  server: {
    port: 8000,
    proxy: {
      '/api/': 'http://localhost:3000/'
    }
  }
};
