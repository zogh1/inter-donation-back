var express = require('express');
var cookieParser = require('cookie-parser');
const cors = require('cors');
var path = require('path');


var usersRouter = require('./routes/users');
var donationRouter = require('./routes/Donation');

var app = express();
app.use('/public', express.static(path.join(__dirname, 'public')));
console.log(path.resolve('./public'));

require('./models/db');
const port = process.env.port || 8000






app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());
app.use(cors());

app.use(express.static(path.resolve('./public')));
app.use('/user', usersRouter);
app.use('/donation',donationRouter);



// error handler
app.listen(port, () => {
  console.log(`running on port ${port}`);
});

module.exports = app;
