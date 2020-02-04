const fs = require('fs')

module.exports = {
    devServer: {
        https: {
          key: fs.readFileSync('./key.pem'),
          cert: fs.readFileSync('./cert.pem'),
          //ca: fs.readFileSync('./certs/ca.crt'),
        },
        public: 'https://localhost:8080/'
    },
	chainWebpack: config => {
    if(config.plugins.has('extract-css')) {
      const extractCSSPlugin = config.plugin('extract-css')
      extractCSSPlugin && extractCSSPlugin.tap(() => [{
        filename: '[name].css',
        chunkFilename: '[name].css'
      }])
    }
  },
  configureWebpack: {
    output: {
      filename: '[name].js',
      chunkFilename: '[name].js'
    }
  }
}
