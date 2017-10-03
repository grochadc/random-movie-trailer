const express = require('express');

//Define app and settings
const app = express();
const exphbs = require('express-handlebars');
var cookieParser = require('cookie-parser');
const port = 3000;

var routes = require('./routes');

var debug = true;

app.use('/', routes);
app.use(express.static('public'));
//app.use(cookieParser());

//View engine
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.listen(port, function () {
  console.log(`Server Starts on ${port}`);
  if(!debug) logs.disable(); //Disable logging if debug variable is false
});
