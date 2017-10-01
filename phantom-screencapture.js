var page = require('webpage').create();

page.open('https://www.rottentomatoes.com/browse/cf-dvd-streaming-all', function(){
  page.includeJs("http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js", function(){
    page.evaluate(function(){
      //JQuery code here
      var moviesInfo = $.map(movies, function(movie){
        var movieObj = $("div.movie_info");
        var scores = movieObj.find("span.tMeterScore");
        return {
          tile: movieObj.find("h3.movieTitle"),
          criticsScore: $(scores[0]).text(), //finds the Critics score on the scores array (0 is critics, 1 is users)
          usersScore: $(scores[1]).text()
        };
      });

      console.log(moviesInfo[0]);
    });
  });
  phantom.exit();
});
