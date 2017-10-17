const fs = require('fs');
const path = require('path');

const moviesModel = path.join(__dirname, '../models/movies.json');
const moviesScraped = path.join(__dirname, '../models/movies2.json');

const readMovies1 = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(moviesModel, 'utf8', (err, data1) => {
      if(err) reject(err);
      let data = JSON.parse(data1);
      resolve(data);
    });
  });
};

const readMovies2 = (data1) => {
  return new Promise((resolve, reject) =>{
    fs.readFile(moviesScraped, 'utf8', (err, data) => {
      if(err) reject(err);
      data = JSON.parse(data);
      resolve([data1,data]);
    });
  });
};

const merge = (data1, data2) => {
    // keeps track of already existing titles to avoid duplicates
    let existingIndexes = [];

    // check the the arguments to make sure the code does not break
    data1 = data1 instanceof Array ? data1 : [];
    data2 = data2 instanceof Array ? data2 : [];

    // return a concatenated and filtered copy result
    return data1.concat(data2).filter((movie) => {
        if (existingIndexes.indexOf(movie.title) === -1) {
            existingIndexes.push(movie.title);
            return true;
        }
        return false;
    });
};

const write = (data) => {
  fs.writeFile(moviesModel,data, (err) => {
    if(err) throw err;
    else console.log('File created!');
  });
};

readMovies1()
  .then(readMovies2)
  .catch((err) => console.error(err))
    .then(data => {
      let merged = JSON.stringify(merge(data[0],data[1]));
      write(merged);
    });
