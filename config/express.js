var express = require('express'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    compress = require('compression'),
    session = require('express-session'),
    methodOverride = require('method-override'),
    passport = require('passport');

module.exports = function(app, config) {
    var env = process.env.NODE_ENV || 'development';
    app.locals.ENV = env;
    app.locals.ENV_DEVELOPMENT = env == 'development';

    app.set('views', config.root + '/app/views');
    app.set('view engine', 'jade');

    // app.use(favicon(config.root + '/public/img/favicon.ico'));
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(cookieParser());
    app.use(compress());
    app.use(session({secret: 'magic unicorns', resave: true, saveUninitialized: true}));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(express.static(config.root + '/public'));
    app.use(methodOverride());

    app.use(function(req, res, next) {
        if (req.session.error) {
            var msg = req.session.error;
            req.session.error = undefined;
            app.locals.errorMessage = msg;
        }
        else {
            app.locals.errorMessage = undefined;
        }

        next();
    });
    app.use(function(req, res, next) {
        if (req.session.success) {
            var msg = req.session.success;
            req.session.success = undefined;
            app.locals.successMessage = msg;
        }
        else {
            app.locals.successMessage = undefined;
        }

        next();
    });
    app.use(function(req, res, next) {
        if (req.user) {
            app.locals.currentUser = req.user;
        }
        else {
            app.locals.currentUser = undefined;
        }
        next();
    });

};
