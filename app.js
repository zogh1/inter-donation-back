var express = require('express');
var cookieParser = require('cookie-parser');
const cors = require('cors');


var usersRouter = require('./routes/users');

var app = express();
require('./models/db');






app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({extended: true, limit: '50mb'}));
app.use(cookieParser());
app.use(cors());


app.use('/', usersRouter);




// error handler
app.listen(3001, ()=> {
  console.log('Running on port 3001');
});

module.exports = app;
