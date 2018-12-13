const app = require('express')()

app.get('/json', function(req, res) {
  res.type('json')
  res.send({ json: 'some data' })
})

app.get('/buffer', function(req, res) {
  res.send(Buffer.alloc(150, 'whoop'))
})

app.get('/html', function(req, res) {
  res.type('html')
  res.set('Content-Type', 'text/html')
  res.send('<p>some <b>html</b></p>')
})

app.listen(3000, function() {
  console.log('started 3000')
})
