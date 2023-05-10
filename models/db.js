const mongoose = require('mongoose');


mongoose.connect('mongodb+srv://sabribaccar:rRdBxaz6yEE8NsQw@cluster0.71ftugm.mongodb.net/', { useNewUrlParser: true }, (err) => {
    if (!err) { console.log('MongoDB Connection Succeeded.') }
    else { console.log('Error in DB connection : ' + err) }
});

require('../models/user');
