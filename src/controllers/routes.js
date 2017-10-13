var express = require('express');
var router = express.Router();

var movieTrailer = require('movie-trailer');
var fs = require('fs');
var path = require('path');
var request = require('request');

var debug = process.env.NODE_ENV == 'test' ? false : true;
var random = require('../lib/random');

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
  var file = path.join(__dirname,'../models/movies.json');

  var readDB = (fileName) => {
    return new Promise((resolve, reject) => {
      fs.readFile(fileName, (err,data) => {
        if(err) reject(err);
        var movies = JSON.parse(data);
        resolve(movies);
      });
    });
  };
  // ^ Resolves with array of objects `movies`

  var selectRandom = (movies) => {
    return new Promise((resolve, reject) => {
      var randomMovie;

      /* Don't write or read cookies when a query for trailer is sent
      Instead populate the randomMovie object with the trailer requested */
      if(Object.keys(req.query).length > 0){  //true if req.query has values
        //When calling two parameters
        if(req.query.index && req.query.trailer) res.send(errorMsg('You can\'t call two parameters at once.'));
        //When calling index
        if(req.query.index){
          var index = Number(req.query.index);
          if((index || index == 0) && (index<movies.length && index>=0)) randomMovie = {title: movies[index].title, imdbID: movies[index].imdbID, criticsScore: movies[index].criticsScore, usersScore: movies[index].usersScore};
          else reject(errorMsg('Index is not a number or it\'s out of range.'));
        }
        //When calling trailer
        else if(req.query.trailer){
          randomMovie = {title: req.query.trailer};
        }
      }

      //When nothing is called
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
        //If client doesnt't have cookies just pick a random movie
        else{
          randomInt = [random.exclude(0,movies.length-1,[0],debug)];
          res.cookie('randomInt', JSON.stringify(randomInt));
        }

        randomMovie = movies[randomInt];
        randomMovie.index = randomInt;
        resolve(randomMovie);
      }
    });
  };
  // ^ Resolves with object randomMovie

  var requestTrailer = (finalMovie) => {

    return new Promise((resolve, reject) =>{
      movieTrailer(finalMovie.title, (err, url) =>{
        if(debug) console.log('Requesting trailer for: ', finalMovie.title, ' with index ', finalMovie.index);
        if(err) reject(errorMsg(err));
        else{
          var embedUrl = url.replace('watch?v=','embed/');
          if(debug) console.log('Video ID: ', url.slice(32,url.length));
          finalMovie.trailerURL = embedUrl; //Add the embed URL to the finalMovie object before rendering it
          res.render('main',finalMovie,
          (err, html) =>
          {
            if(err) reject(err);
            if(debug) console.log('Rendering...');
            if(debug) console.log(finalMovie);
            res.send(html);
            if(debug) console.log("Done!");
          });
        }
      });
    });
  };
  // ^ End of promise chain renders the page

  readDB(file)
    .then(selectRandom)
      .catch((err) => res.status(500).send(errorMsg(err)))
    .then(requestTrailer)
      .catch((err) => res.status(500).send(errorMsg(err)));

}); //Close GET

module.exports = router;
