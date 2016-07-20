var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');

  $.getJSON('http://www.imdbapi.com/?' + dataString, function(json_data){
    alert(JSON.stringify(json_data));
  });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
