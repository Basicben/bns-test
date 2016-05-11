// get configuration file and store it as global variable - GLOBAL.conf .
var config = require('./config/config');
GLOBAL.conf = config;
// add all system enums to global
var enums = require('./enum/enum');
GLOBAL.enums = enums;
// global dictionary holds hostel Id as a key objects
// this hostel id key object holds ONLY connected users.
GLOBAL.connectedUsers = {};

// set requirments.
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');

var moongoConnect = require('./middleware/mongoose.js');
var cors = require('cors');
//
// set http server.

var app = express();
// allows all origins!
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse
app.set('view engine', 'jade');

// for all requests containing api req validate jwt.
console.log('start user roles module');
for (key in enums.userRoles) {
    app.all('/' + key + '/*', [require('./middleware/authValidate')]);
}

// find routes
app.use('/', require('./routes'));

// error handlers

// development error handler
// will print stacktrace
if (config.sys_environment === 'dev') {
    app.use(function (err, req, res, next) {
        res.json({ error: { message: err.message, code: 404, err: err } });
    });
}

// production error handler
// no stacktraces leaked to user
if (config.sys_environment !== 'dev') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.json({ error: { message: err.message, code: 500 } });
    });
}

app.use(function (req, res, next) {
    res.json({ error: { message: 'Not Found', code: 404 } });
});

module.exports = app;

