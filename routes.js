var express = require('express')
var router = express.Router()

var movieTrailer = require('movie-trailer');

var Promise = require('bluebird');
var logs = require('log-switch');
var fs = require('fs');

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
  console.log('Page requested!');
  console.log('Cookies: ', req.cookies);

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
          var index = req.query.index
          if(Number(index) && (index<movies.length && index>0)) randomMovie = {title: movies[index].title};
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
          randomInt = random.exclude(0,movies.length,cookieArr, true);
          cookieArr.push(randomInt);
          res.cookie('randomInt',cookieArr);
        }
        else{
          randomInt = [random.exclude(0,movies.length,[0],true)];
          res.cookie('randomInt', JSON.stringify(randomInt));
        }


        randomMovie = movies[randomInt];
        var numberArr = [randomInt];
      }

      movieTrailer(randomMovie.title, (err, url) =>{
        console.log('Requesting trailer for: ', randomMovie.title, ' with index ', randomInt);
        if(err) res.send(err);
        var embedUrl = url.replace('watch?v=','embed/');
        console.log('Video ID: ', url.slice(32,url.length));
        randomMovie.trailerURL = embedUrl; //Add the embed URL to the randomMovie object before rendering it
        res.render('main',randomMovie,
        (err, html) =>
        {
          if(err) throw res.send(err);
          console.log('Rendering...');
          res.send(html);
          console.log("Done!");
        });
      });
    });

});

module.exports = router;
