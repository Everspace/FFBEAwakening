var path = require('path')
var express = require('express')

var app = express()
var webpack = require('webpack')

var config = require('./webpack/webpack.config.dev.js')
let configSwitchIndex = process.argv.indexOf('--config')
if (configSwitchIndex > 0) {
  let configPath = process.argv[configSwitchIndex + 1]
  console.log(`Using webpack config ${configPath}`)
  config = require(configPath)
}
var compiler = webpack(config)

let verbose = process.argv.indexOf('--verbose')
if (verbose > 0) {
  console.log('Stuff is verbose mang')
}

app.use(require('connect-history-api-fallback')({verbose: false}))

app.use(
  require('webpack-dev-middleware')(compiler, {
    color: true,
    stats: {
      colors: true,

      assets: true,
      chunks: false,
      errors: true,
      errorDetails: true,
      warnings: true
    },
    // noInfo: true,
    publicPath: config.output.publicPath
  })
// In case of emergencies
// ,require('body-parser').json()
)
app.use(require('webpack-hot-middleware')(compiler))

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'src', 'public', 'index.ejs'))
  console.log('Serving root')
})

app.get('/build/*', function (req, res) {
  let filename = decodeURIComponent(req.originalUrl)
  res.sendFile(path.join(__dirname, 'docs', filename))
  if (verbose) {
    console.log(`Serving ${filename}`)
  }
})

var server = app.listen(9001, '0.0.0.0', function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at http://localhost:%d', server.address().port)
})
