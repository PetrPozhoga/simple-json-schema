const express = require('express')
const path = require('path')
const port = process.env.PORT || 3000

const app = express()

app.use(express.static('build'))

app.listen(port, function () {
  console.log('Example app listening on port ' + port);
});
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname + '/build/index.html'));
})