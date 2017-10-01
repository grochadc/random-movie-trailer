var express = require('express');
var movieTrailer = require('movie-trailer');
var Promise = require('bluebird');


//Setup x-ray for scraping
var Xray = require('x-ray');
var x = Xray();

var debug = true;


//Define app and settings
const app = express();
const exphbs = require('express-handlebars');
const port = 3000;

//View engine
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//Main route
app.get('/trailer', (req, res) => {
  console.log('Page requested!');

  var username = req.query.user? req.query.user: 'medicengonzo';
  var pages = 3;

  var scrapeMovies = function() {
    if (debug) console.log('scrapeMovies()');
    return new Promise((resolve, reject) => {
      x('https://letterboxd.com/' + username + '/watchlist/', 'li.poster-container', [{
          title: 'img@alt'
        }])((err, results) => {
          console.log('x()');
          if (err) reject(err);
          resolve(results);
        })
        .paginate('.paginate-current+li a@href')
        .limit(pages);

    });
  };

  scrapeMovies().then(
    movies => {
      var randomInt = Math.floor(Math.random() * movies.length);
      var randomMovie = movies[randomInt].title;

      movieTrailer(randomMovie, (err, url) =>{
        console.log('Trailer requested!')
        if(err) throw err;
        var embedUrl = url.replace('watch?v=','embed/');
        console.log('Embed HTML: ', );
        console.log('Full url: ',url);
        console.log('Video ID: ', url.slice(32,url.length));
        console.log('Embed Url: ', embedUrl);
        res.render('main',{
          trailerURL: embedUrl
        },
        (err, html) =>
        {
          if(err) throw err;
          console.log('Rendering...');
          res.send(html);
        });
      });
    });

  var randomMovie = 'Mother'
  var movie = req.query.movie? decodeURIComponent(req.query.movie): randomMovie;

  console.log('Requesting '+movie);

});

app.listen(port, function () {
  console.log(`Server Starts on ${port}`);
});
