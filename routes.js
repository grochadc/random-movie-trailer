var express = require('express')
var router = express.Router()

var movieTrailer = require('movie-trailer');

var Promise = require('bluebird');
var logs = require('log-switch');
var fs = require('fs');
//var cookieParser = require('cookie-parser');

//Setup x-ray for scraping
var Xray = require('x-ray');
var x = Xray();

var debug = false;

function generateRandom(min, max, arr) {
    var num = Math.floor(Math.random() * (max - min + 1)) + min;

    if(arr){
      var exclude = arr.every(function(val){ return arr.indexOf(num) >= 0 });
      if(exclude){
        console.log('Random num is in array, do over');
        generateRandom(min, max, arr);
      }
      else{
        console.log('Random num is not in array ',num);
        return num;
      }
    }
    else {
      return num;
    }
};

router.get('/', (req, res) => {
  console.log('Page requested!');
  console.log('Cookies: ', req.cookies); // For some reason this returns undefined

  var scrapeMovies = function(){
    return new Promise((resolve, reject) =>{
      fs.readFile('moviesRT.json', (err,data) =>{
        var movies = JSON.parse(data);
        resolve(movies);
      });
    });
  };

  /*
  var username = 'medicengonzo';
  var pages = 3;

  var scrapeMovies = function() {
    if (debug) console.log('scrapeMovies()');
    return new Promise((resolve, reject) => {
      x('https://letterboxd.com/' + username + '/watchlist/', 'li.poster-container', [{
          title: 'img@alt'
        }])((err, results) => {
          console.log('Scraping movies');
          if (err) reject(err);
          resolve(results);
        })
        .paginate('.paginate-current+li a@href')
        .limit(pages);

    });
  };
  */

  scrapeMovies().then(
    movies => {
      var randomInt;

      if(req.cookies.randomInt) {
        var cookieStr = req.cookies.randomInt;
        var cookieArr = typeof(cookieStr) == 'string' ? JSON.parse(cookieStr) : cookieStr; //Make sure the cookie is an Array
        randomInt = generateRandom(0,movies.length,cookieArr);
        cookieArr.push(randomInt);
        res.cookie('randomInt',cookieArr);
      }
      else{
      res.cookie('randomInt', JSON.stringify(generateRandom(0,movies.length)));
      }


      var randomMovie = movies[randomInt];
      var numberArr = [randomInt];

      movieTrailer(randomMovie.title, (err, url) =>{
        console.log('Requesting trailer for: ', randomMovie.title, ' with index ', randomInt);
        if(err) throw err;
        var embedUrl = url.replace('watch?v=','embed/');
        console.log('Video ID: ', url.slice(32,url.length));
        randomMovie.trailerURL = embedUrl; //Add the embed URL to the randomMovie object before rendering it
        res.render('main',randomMovie,
        (err, html) =>
        {
          if(err) throw err;
          console.log('Rendering...');
          res.send(html);
          console.log("Done!");
        });
      });
    });

});

module.exports = router;
