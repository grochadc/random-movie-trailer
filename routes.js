var express = require('express')
var router = express.Router()

var movieTrailer = require('movie-trailer');

var Promise = require('bluebird');
var logs = require('log-switch');
var fs = require('fs');

//Setup x-ray for scraping
var Xray = require('x-ray');
var x = Xray();

var debug = false;

router.get('/', (req, res) => {
  console.log('Page requested!');

  //res.cookie('random_nums', '[1,2,3,4]');

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
      var randomInt = Math.floor(Math.random() * movies.length);
      var randomMovie = movies[randomInt];
      console.log(movies);
      console.log('randomMovie.title',randomMovie.title);

      movieTrailer(randomMovie.title, (err, url) =>{
        console.log('Trailer requested!', randomMovie.title);
        if(err) throw err;
        var embedUrl = url.replace('watch?v=','embed/');
        console.log('Embed HTML: ', );
        console.log('Full url: ',url);
        console.log('Video ID: ', url.slice(32,url.length));
        console.log('Embed Url: ', embedUrl);
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
