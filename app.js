const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

// DATABASE CONNECTION
// Displaying password in code
mongoose.connect('mongodb+srv://cricpunk:cricpunk@nodejs-y6vay.mongodb.net/test?retryWrites=true&w=majority', {
        useNewUrlParser: true
});
//Hiding password in code
// mongoose.connect('mongodb+srv://cricpunk:' + process.env.MONGO_ATLAS_PW + '@nodejs-y6vay.mongodb.net/test?retryWrites=true&w=majority', {
//         //useMongoClient: true,
//         useNewUrlParser: true
// });

// For logging
app.use(morgan('dev'));
// For parsing url
app.use(bodyParser.urlencoded({ extended: false })); // This will extract url encoded data and made easily readable for us
app.use(bodyParser.json()); // This will extract json data and made easily readable for us

// To give access to any origin/clients
// Handle CORS errors
app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-with, Content-Type, Accept, Authorization');
        if (req.method === 'OPTIONS') {
                res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
                return res.status(200).json({});
        }
        next();
});

// Incoming request has to go through app.use whatever we pass through
// Routes which should handle requests
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

// For error, If route request does not found route run this
app.use((req, res, next) => {
        const error = new Error("Not found");
        error.status = 404;
        next(error);
});

// For any other types of errors e.g. errors related to database
app.use((error, req, res, next) => {
        res.status(error.status || 500);
        res.json({
                error: {
                        message: error.message
                }
        });
});

module.exports = app;


// CORS ? ....This is error
/**
 * Cross Origin Resource Sharing
 */