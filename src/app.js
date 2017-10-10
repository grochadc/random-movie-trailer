const express = require('express');

//Define app and settings
const app = express();
const exphbs = require('express-handlebars');
var cookieParser = require('cookie-parser');

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 3000;

var path = require('path');

var routes = require(path.join(__dirname, 'controllers/routes'));

var debug = process.env.NODE_ENV == 'test' ? false : true;


const publicFolder = path.join(__dirname, 'public/')
app.use(express.static(publicFolder));
app.use(cookieParser());
app.use('/', routes);

//app.use(cookieParser());

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
  //if(!debug) logs.disable(); //Disable logging if debug variable is false
});

module.exports = app; //For testing with Mocha
