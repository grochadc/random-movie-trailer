const express = require('express');

//Define app and settings
const app = express();
const exphbs = require('express-handlebars');
var cookieParser = require('cookie-parser');
const compression = require('compression');
const path = require('path');

var routes = require(path.join(__dirname, 'controllers/routes'));

/**
Settings
**/
const port = process.env.PORT || 3000; // process.env.PORT lets the port be set by Heroku
const debug = process.env.NODE_ENV == 'test' ? false : true;

const publicFolder = path.join(__dirname, 'public/');
app.use(express.static(publicFolder));

app.use(compression());
app.use(cookieParser());
app.use('/', routes);

//View engine
const viewsPath = path.join(__dirname,'views/');
app.set('views', viewsPath);
app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  layoutsDir: viewsPath + '/layouts'
}));
app.set('view engine', 'handlebars');

app.listen(port, function () {
  if(debug) console.log('Server Starts on '+port);
});

module.exports = app; //For testing with Mocha
