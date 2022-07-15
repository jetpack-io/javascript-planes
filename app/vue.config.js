module.exports = {
  outputDir: '../api/public',
  devServer: {
    port: 8000,
    proxy: {
      '/api/*': {
        target: 'http://localhost:3000'
      }
    }
  }
};
