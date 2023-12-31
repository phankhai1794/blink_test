const path = require('path');

const express = require('express');
const favicon = require('express-favicon');
const port = 8080;
const app = express();

// the __dirname is the current directory from where the script is running
app.use(favicon(__dirname + '/dist/favicon.ico'));
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'dist')));
app.get('/ping', function (req, res) {
  return res.send('pong');
});
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});
console.log(`Server is listening at port ${port} ......`);
app.listen(port);
