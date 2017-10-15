var express = require('express');
var router = express.Router();

var movieTrailer = require('movie-trailer');
var fs = require('fs');
var path = require('path');
var request = require('request');

var debug = process.env.NODE_ENV == 'test' ? false : true;

var random = require(path.join(__dirname, '../lib/random'));
const isArray = require('../lib/is-array');

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

  var moviesDB; //Populate this variable the first time the model is read

  var readDB = (fileName) => {
    return new Promise((resolve, reject) => {
      fs.readFile(fileName, (err,data) => {
        if(err) reject(err);
        moviesDB = JSON.parse(data);
        console.log('File read');
        resolve(moviesDB);
      });
    });
  };
  // ^ Resolves with an array of objects `movies`

  var parseQuery = (movies) => {
    return new Promise((resolve, reject) => {
      const queries = Object.keys(req.query).length;
      console.log('Parsing ', queries ,'queries');
      if(queries > 0) { //If there's any query run this
        //When calling two parameters
        if(req.query.index && req.query.trailer) reject('You can\'t call two parameters at once.');
        //When calling index
        if(req.query.index){
          var index = Number(req.query.index);
          console.log('Calling index ',index);
          if((index || index == 0) && (index<movies.length && index>=0)){
            randomMovie = {
              title: movies[index].title,
              imdbID: movies[index].imdbID,
              criticsScore: movies[index].criticsScore,
              usersScore: movies[index].usersScore,
              index: index
              };
          }
          else reject(errorMsg('Index is not a number or it\'s out of range.'));
            console.log('Requested: ', randomMovie);
          }
        //When calling trailer
        if(req.query.trailer){
          randomMovie = {title: req.query.trailer};
        }
        else resolve(randomMovie);
      }
      resolve(movies); //If no query is called just pass the movies through
     });
  };
  //^ When a query is called resolves a specific movie or if no query just passes the movies array

  var selectRandom = (movies) => {
    return new Promise((resolve, reject) => {

      var randomMovie;
      var randomInt;

      //If movies is not an array and first element is title, it means there is only one movie
      if(!isArray(movies)) {
        console.log('Movies is an obj');
        var firstEl = Object.keys(movies)[0];
        console.log('Movies firstEl is ', firstEl);
        console.log('Is title? ', Boolean(firstEl == 'title'), 'Is elements? ', Boolean(firstEl == 'elements'));
        if(firstEl == 'title') {
          randomMovie = movies;
          resolve(randomMovie);
        }
        else if(firstEl == 'elements') {
          found = movies.found;
          movies = movies.elements;
          if(!found) req.query = {};
        }
      }
        //Make sure the random index has never been requested by the client
        if(req.cookies.randomInt) {
          var cookieStr = req.cookies.randomInt;
          var cookieArr = typeof(cookieStr) == 'string' ? JSON.parse(cookieStr) : cookieStr; //Make sure the cookie is an Array
          randomInt = random.exclude(0,movies.length-1,cookieArr, debug);
          cookieArr.push(randomInt);
          res.cookie('randomInt',cookieArr);
        }
        //If client doesnt't have cookies just pick a random movie
        else {
          randomInt = [random.exclude(0,movies.length-1,[0],debug)];
          res.cookie('randomInt', JSON.stringify(randomInt));
        }

        randomMovie = movies[randomInt];
        console.log('randomMovie ', randomMovie);
        randomMovie.index = randomInt;
        randomMovie.letterboxd = randomMovie.title.replace(/\s+/g, '-').toLowerCase(); //Move this to the render function
        resolve(randomMovie);
      });
  };
  // ^ Resolves with object randomMovie

  var requestTrailer = (finalMovie) => {
    return new Promise((resolve, reject) => {
      movieTrailer(finalMovie.title, (err, url) => {
        if(debug) console.log('Requesting trailer for: ', finalMovie.title, ' with index ', finalMovie.index);
        if(err) reject(err);
        else {
          finalMovie.videoID = url.slice(32,url.length);
          if(debug) console.log('Video ID: ', url.slice(32,url.length));
          console.log('requestTrailer resolving ', finalMovie);
          resolve(finalMovie);

        }
      });
    });
  };
  // ^ Resolves with object finalMovie

  var renderMovie = (finalMovie) => {
    console.log('renderMovie(finalMovie) ',finalMovie);
    res.render('main',finalMovie,
    (err, html) =>
    {
      if(err) reject(err);
      if(debug) console.log('Final movie:',finalMovie);
      if(debug) console.log('Rendering...');
      res.send(html);
      if(debug) console.log("Done!");
    });
  };
  //^ Ends promise chain and renders the page


  var selectMovie = (isfound) => {
    console.log('selectMovie() called');
    selectRandom({
      elements: moviesDB,
      found: false
    })
      .then(requestTrailer)
        .catch((err) => {
          if(err == 'Got error: No results found') throw new Error(err);
        })
          .then(renderMovie)
            .catch((err) => console.error(err));
  };

  readDB(file)
    .then(parseQuery)
      .catch((err) => console.error(err))
    .then(selectRandom)
      .catch((err) => console.error(err))
    .then(requestTrailer)
      .catch((err) => {
        if(err == 'Got error: No results found') {
          selectMovie(false);
          throw new Error(err);
        }
      })
        .then(renderMovie)
          .catch((err) => console.error(err));

}); //Close GET

module.exports = router;
