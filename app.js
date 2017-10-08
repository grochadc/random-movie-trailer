const express = require('express');

//Define app and settings
const app = express();
const exphbs = require('express-handlebars');
var cookieParser = require('cookie-parser');

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 3000;

var logs = require('log-switch');

var routes = require('./controllers/routes');

var debug = process.env.NODE_ENV == 'test' ? false : true;


app.use(express.static('public'));
app.use(cookieParser());
app.use('/', routes);

//app.use(cookieParser());

//View engine
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.listen(port, function () {
  if(debug) console.log(`Server Starts on ${port}`);
  //if(!debug) logs.disable(); //Disable logging if debug variable is false
});

module.exports = app; //For testing with Mocha
