const path = require('path')
const fs = require('fs')
const express = require('express')
const configs = require('../../webpack.config.js')

const app = express()
const webpack = require('webpack')
const PORT = 7077

const resolve = dir => path.resolve(__dirname, dir)

fs.readFile(resolve('build.html'), 'utf8', (err, buildTemplate) => {
  if (err) throw err

  app.use(express.static(resolve('../../dist')))

  configs.forEach(config => {
    const publicPath = ''
    const filename = config.output.filename
    config.output.publicPath = publicPath
    app.use(
      require('webpack-dev-middleware')(webpack(config), {
        noInfo: true,
        publicPath: publicPath,
      })
    )
    app.get('/' + filename.replace('.js', '.html'), function(req, res) {
      res.send(buildTemplate.replace(/({{build-file-name}})/g, filename))
    })
  })

  app.get('/test.js', function(req, res) {
    res.sendFile(resolve('test.js'))
  })

  app.get('/', function(req, res) {
    res.sendFile(resolve('index.html'))
  })

  app.listen(PORT, function(error) {
    console.log(error || 'Listen on http://localhost:' + PORT)
  })
})
