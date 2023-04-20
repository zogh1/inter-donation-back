var express = require('express');
var cookieParser = require('cookie-parser');
const cors = require('cors');


var usersRouter = require('./routes/users');
var livesRouter = require('./routes/lives.route');



var app = express();
require('./models/db');






app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({extended: true, limit: '50mb'}));
app.use(cookieParser());
app.use(cors());

<<<<<<< Updated upstream

app.use('/', usersRouter);
=======
app.use(express.static(path.resolve('./public')));
app.use('/user', usersRouter);
app.use('/live', livesRouter);

>>>>>>> Stashed changes




// error handler
app.listen(3000, ()=> {
  console.log('Running on port 3000');
});

module.exports = app;
