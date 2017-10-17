const express = require('express');
const router = express.Router();

const movieTrailer = require('movie-trailer');
const fs = require('fs');
const path = require('path');
const request = require('request');

var debug = process.env.NODE_ENV == 'test' ? false : true;

const random = require(path.join(__dirname, '../lib/random'));
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
  const file = path.join(__dirname,'../models/movies.json');

  var moviesDB; //Populate this variable the first time the model is read

  const readDB = (fileName) => {
    return new Promise((resolve, reject) => {
      fs.readFile(fileName, (err,data) => {
        if(err) reject(err);
        moviesDB = JSON.parse(data); //Here's an array
        console.log('File read');

        resolve(moviesDB);
      });
    });
  };
  // ^ Resolves with an object that contains an array with movies, isfound:false

  const parseQuery = (movies) => {
    return new Promise((resolve, reject) => {
      const queries = Object.keys(req.query).length;
      console.log('Parsing ', queries ,'queries');
      if(queries > 0) { //If there's any query run this
        //When calling two parameters
        if(req.query.index && req.query.trailer) reject('You can\'t call two parameters at once.');
        //When calling index
        else if(req.query.index){
          var index = Number(req.query.index);
          console.log('Calling index ',index);
          if(index<movies.length && index>=0){
            movie = movies[index];
            movie.index = index;
          }
          else reject(errorMsg('Index is not a number or it\'s out of range.'));
            console.log('Requested: ', movie);
          }
        //When calling trailer
        else if(req.query.trailer){
          movie = {title: req.query.trailer};
        }
        resolve([movie]); //Pass the result as a one item array
      }
      resolve(movies); //If no query is called just pass the movies through
     });
  };
  //^ When a query is called resolves a specific movie or if no query just passes the movies array

  const selectRandom = (movies) => {
    return new Promise((resolve, reject) => {

      let randomMovie;
      let randomInt;

      //If movies array is only one in length pass through
      if(movies.length == 1) {
        movie = movies[0];
        movie.letterboxd = movie.title.replace(/\s+/g, '-').toLowerCase();
        resolve(movie);
      }
      else {
        //Make sure the random index has never been requested by the client
        if(req.cookies.randomInt) {
          let cookieStr = req.cookies.randomInt;
          let cookieArr = typeof(cookieStr) == 'string' ? JSON.parse(cookieStr) : cookieStr; //Make sure the cookie is an Array
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
        randomMovie.index = randomInt;
        randomMovie.letterboxd = randomMovie.title.replace(/\s+/g, '-').toLowerCase(); //Move this to the render function
        resolve(randomMovie);
      }
    });
  };
  // ^ Resolves with object randomMovie

  const requestTrailer = (randomMovie) => {
    return new Promise((resolve, reject) => {
      movieTrailer(randomMovie.title, (err, url) => {
        if(debug) console.log('Requesting trailer for: ', randomMovie.title, ' with index ', randomMovie.index);
        if(err) reject(err);
        else {
          randomMovie.videoID = url.slice(32,url.length);
          if(debug) console.log('Video ID: ', randomMovie.videoID);
          resolve(randomMovie);
        }
      });
    });
  };
  // ^ Resolves with object finalMovie

  const renderMovie = (finalMovie) => {
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


  const selectMovie = (movies) => {
    console.log('selectMovie() called');
    selectRandom(movies)
      .then(requestTrailer)
      .catch((err) => {
        if(err == 'Got error: No results found') {
          selectMovie(moviesDB);
          throw new Error(err);
        }
      })
          .then(renderMovie)
            .catch((err) => console.error(err));
  };

  readDB(file)
    .then(parseQuery)
      .catch((err) => console.error(err))
    .then(selectMovie);

}); //Close GET

module.exports = router;
