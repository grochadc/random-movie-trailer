const fs = require('fs');
const path = require('path');

const readMovies1 = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(__dirname,'../models/movies.json'), 'utf8', (err, data1) => {
      if(err) reject(err);
      else resolve(JSON.parse(data1));
    });
  });
};

const readMovies2 = (data1) => {
  return new Promise((resolve, reject) =>{
    fs.readFile(path.join(__dirname,'../models/movies2.json'), 'utf8', (err, data) => {
      if(err) reject(err);
      else resolve([data1,JSON.parse(data)]);
    });
  });
};

const merging = (data1, data2) => {
  return new Promise((resolve, reject) => {
   var args = arguments;
   var hash = {};
   var arr = [];
   for (var i = 0; i < args.length; i++) {
      for (var j = 0; j < args[i].length; j++) {
        if (hash[args[i][j]] !== true) {
          arr[arr.length] = args[i][j];
          hash[args[i][j]] = true;
        }
      }
    }
    resolve(arr);
  });
};

const findMovie = (arr) => {
  return arr.forEach((item, index) => {
    if(typeof(item) == 'object') {
      if(item.title == "Kong: Skull Island") console.log(item, index);
    }
    else if(!item) console.log('Undefinded movie at ',index);
    else console.log('No movie found');
  });
};

readMovies1()
  .then(readMovies2)
    .catch((err) => console.error(err))
  .then((data) => merging(data[0],data[1]))
    .catch((err) => console.error(err))
  .then((data) => console.log(merging(data[0], data[1])));
