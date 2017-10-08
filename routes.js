var express = require('express')
var router = express.Router()

var movieTrailer = require('movie-trailer');

var Promise = require('bluebird');
var logs = require('log-switch');
var fs = require('fs');

var request = require('request');

var debug = false;
var random = require('./lib/random');

function errorMsg(msg){
  var message = 'Error: '+msg+ ' Click <a href=".">here</a> to refresh the page.';
  return message;
}

//=============================//
//    R O U T E S             //
//===========================//

router.get('/', (req, res) => {
  if(debug) console.log('Page requested!');
  if(debug) console.log('Cookies: ', req.cookies);

  var scrapeMovies = function(){
    return new Promise((resolve, reject) =>{
      fs.readFile('moviesRT.json', (err,data) =>{
        if(err) res.send(err);
        var movies = JSON.parse(data);
        resolve(movies);
      });
    });
  };

  scrapeMovies().then(
    movies => {
      var randomMovie;

      /* Don't write or read cookies when a query for trailer is sent
      Instead populate the randomMovie object with the trailer requested */
      if(Object.keys(req.query).length > 0){  //true if req.query has values
        if(req.query.index && req.query.trailer) res.send(errorMsg('You can\'t call two parameters at once.'))
        if(req.query.index){
          var index = Number(req.query.index);
          if((index || index == 0) && (index<movies.length && index>=0)) randomMovie = {title: movies[index].title, imdbID: movies[index].imdbID, criticsScore: movies[index].criticsScore, usersScore: movies[index].usersScore};
          else res.send(errorMsg('Index is not a number or it\'s out of range.'));
        }
        else if(req.query.trailer){
          randomMovie = {title: req.query.trailer};
        }
      }
      else{
        var randomInt;

        //Make sure the random index has never been requested by the client
        if(req.cookies.randomInt) {
          var cookieStr = req.cookies.randomInt;
          var cookieArr = typeof(cookieStr) == 'string' ? JSON.parse(cookieStr) : cookieStr; //Make sure the cookie is an Array
          randomInt = random.exclude(0,movies.length-1,cookieArr, debug);
          cookieArr.push(randomInt);
          res.cookie('randomInt',cookieArr);
        }
        else{
          randomInt = [random.exclude(0,movies.length-1,[0],debug)];
          res.cookie('randomInt', JSON.stringify(randomInt));
        }


        randomMovie = movies[randomInt];
        var numberArr = [randomInt];
      }

      movieTrailer(randomMovie.title, (err, url) =>{
        if(debug) console.log('Requesting trailer for: ', randomMovie.title, ' with index ', randomInt);
        if(err) res.status(404).send(errorMsg(err));
        else{
          var embedUrl = url.replace('watch?v=','embed/');
          if(debug) console.log('Video ID: ', url.slice(32,url.length));
          randomMovie.trailerURL = embedUrl; //Add the embed URL to the randomMovie object before rendering it
          res.render('main',randomMovie,
          (err, html) =>
          {
            if(err) res.send(err);
            if(debug) console.log('Rendering...');
            if(debug) console.log(randomMovie);
            res.send(html);
            if(debug) console.log("Done!");
          });
        };
      });
    });

});

module.exports = router;
