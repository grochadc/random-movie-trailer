//Scraping solution to fill the model movies.json with data from rottentomatoes

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');


(async () => {
  /* jshint ignore:start */
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.rottentomatoes.com/browse/cf-dvd-streaming-all');

  await page.click('button.mb-load-btn');

  const movies = await page.$eval('div.mb-movies', el => {

    //This code is executed inside the browser context where el is the element returned by the selector ^
    var moviesContainer = $(el).find('div.movie_info');

    var moviesInfo = $.map(moviesContainer, function(movie){

      var scores = $(movie).find('span.tMeterScore');

      return {
          title: $(movie).find('h3.movieTitle').text(),
          usersScore: $(scores[0]).text(),
        	criticsScore: $(scores[1]).text()
        };
    });

    return moviesInfo;
  });

  fs.writeFile(path.join(__dirname, '../models/movies.json'), JSON.stringify(movies), (err) => {
    if(err) throw err;
    console.log('The file has been saved!');
  });

  await browser.close();
})();
      /* jshint ignore:end */
