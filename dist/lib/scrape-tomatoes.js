<<<<<<< HEAD
/*! random-movie-trailer 2017-10-13 */
=======
/*! random-movie-trailer 2017-10-14 */
>>>>>>> youtube-api-script

const puppeteer=require("puppeteer"),path=require("path"),fs=require("fs");(async()=>{const e=await puppeteer.launch(),t=await e.newPage();await t.goto("https://www.rottentomatoes.com/browse/cf-dvd-streaming-all");const i=await t.$eval("div.mb-movies",e=>{var t=$(e).find("div.movie_info");return $.map(t,function(e){var t=$(e).find("span.tMeterScore");return{title:$(e).find("h3.movieTitle").text(),usersScore:$(t[0]).text(),criticsScore:$(t[1]).text()}})});fs.writeFile(path.join(__dirname,"../models/movies.json"),JSON.stringify(i),e=>{if(e)throw e;console.log("The file has been saved!")}),await e.close()})();