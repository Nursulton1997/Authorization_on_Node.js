const {MONGO_URI} = process.env;
const mongoose = require('mongoose');


exports.connect = () => {
    // Connecting to the database
    mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true

    }, err => {
        if (err) throw err;
        console.log('Connected to MongoDB!!!')
    });
};