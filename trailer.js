var movieTrailer = require('movie-trailer');

movieTrailer('Oceans Eleven', (err, url) =>{
  var embedUrl = url.replace('watch?v=','embed/');
  var embedHTML = embedArr[0].concat(embedUrl, embedHTML[1]);
  console.log('Embed HTML: ', );
  console.log('Full url: ',url);
  console.log('Video ID: ', url.slice(32,url.length));
  console.log('Embed Url: ', embedUrl);
});
