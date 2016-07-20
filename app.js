var express = require('express');
var app = express();
var path = require('path');
var request = require('request');
var fs = require("fs");
var colors = require('colors');

// Should create a public folder (for CSS, JS, images) under "star-wars" so app.js has access;
app.use(express.static(path.join(__dirname, 'public')));



var charID = {
    "luke": "1",
    "leia": "5",
    "han": "14",
    "rey": "85"
};


app.set('views', 'views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
  //render index.ejs view file
  res.render('home', {
  });
});

app.get('/characters', function(req, res){

  var pageNum = req.param("page");
  if (req.param("page") === undefined){ pageNum = 1};
  var call = "http://swapi.co/api/".concat("people/?page=", pageNum, "&format=json");

  request(call,

    function (error, response, body) {
      if (error) return console.log(err);

      var json = JSON.stringify(JSON.parse(response.body).results),
          next = '',
          previous = '';

      // Next Page
      if (JSON.parse(response.body).next === null) next = null;
      else{
        var pageNumNext = +pageNum + 1;
        next = "/characters/?page=".concat(pageNumNext);
      }

      // Previous Page
      if (JSON.parse(response.body).previous === null) previous = null;
      else{
        var pageNumPrevious = +pageNum - 1;
        previous = "/characters/?page=".concat(pageNumPrevious);
      }

      //Sort People objects based on sort query
      if (req.param("sort") === "height" || req.param("sort") === "mass") {
        json = (JSON.parse(response.body).results.sort(
          function(a,b){return b[req.param("sort")]-a[req.param("sort")]
        }));
      }
      if (req.param("sort") === "name"){
        json = JSON.stringify((JSON.parse(response.body).results.sort(
          function(a,b){
            return b[req.param("sort")].localeCompare(a[req.param("sort")])})));
      }

    res.render('allCharacters', {
      json: json,
      next: next,
      previous: previous
    });
  });
});

app.get('/characters/:nameOfCharacter', function(req, res){
  //res.set('Content-Type', 'text/css'); // 'text/html' => mime type
  //res.sendfile(__dirname + '/public/style.css')
    request("http://swapi.co/api/".concat("people/", charID[req.params.nameOfCharacter], "/?format=json"),

    function (error, response, body) {
    if (error) return console.log(err);

    var json = JSON.parse(response.body);


    res.render('character', {
      json: json,
      name: json.name
    });
  });
});

app.get('/planetresidents', function(req, res){


  var pageNum = req.param("page");
  if (req.param("page") === undefined){ pageNum = 1};
  var call = "http://swapi.co/api/".concat("planets/?page=", pageNum, "&format=json");

  request(call,

    function (error, response, body) {
      if (error) return console.log(err);

        var json = JSON.parse(response.body).results,
            planetJson = [],
            residents =  [],
            planetName = '';

        for (var key in json) {
          if (json.hasOwnProperty(key)) {
            planetName = json[key].name;
            residents = json[key].residents;
            var planetObj = { [planetName] : residents };
            planetJson = planetJson.concat(planetObj);
          }
        }


        var json = JSON.stringify(JSON.parse(response.body).results),
            next = '',
            previous = '';

        // Next Page
        if (JSON.parse(response.body).next === null) next = null;
        else{
          var pageNumNext = +pageNum + 1;
          next = "/planetresidents/?page=".concat(pageNumNext);
        }

        // Previous Page
        if (JSON.parse(response.body).previous === null) previous = null;
        else{
          var pageNumPrevious = +pageNum - 1;
          previous = "/planetresidents/?page=".concat(pageNumPrevious);
        }



        var planetJson = JSON.stringify(planetJson, null, 2)
        planetJson = planetJson.substring(1, planetJson.length-1);

    res.render('planetResidents', {
      json: json,
      next: next,
      previous: previous
    });
    //res.send(planetJson);
  });
});










app.listen(3000);
