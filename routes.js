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
var random = require('./lib/random');

//=============================//
//    R O U T E S             //
//===========================//

router.get('/', (req, res) => {
  console.log('Page requested!');
  console.log('Cookies: ', req.cookies);
  console.log('Cookies length', Boolean(req.cookies.length));
  console.log('Boolean cookies', Boolean(req.cookies));

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
      /* Don't write or read cookies when a query for trailer is sent
      Instead populate the randomMovie object with the trailer requested */
      if(req.query.trailer){
        randomMovie = {title: req.query.trailer};
      }
      else{
        var randomInt;

        //Make sure the random index has never been requested by the client
        if(req.cookies.length && req.cookies.randomInt) {
          var cookieStr = req.cookies.randomInt;
          var cookieArr = typeof(cookieStr) == 'string' ? JSON.parse(cookieStr) : cookieStr; //Make sure the cookie is an Array
          randomInt = random.exclude(0,movies.length,cookieArr, true);
          cookieArr.push(randomInt);
          res.cookie('randomInt',cookieArr);
        }
        else{
          randomInt = random.exclude(0,movies.length,[0],true)
        res.cookie('randomInt', JSON.stringify(randomInt));
        }


        var randomMovie = movies[randomInt];
        var numberArr = [randomInt];
      }

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
