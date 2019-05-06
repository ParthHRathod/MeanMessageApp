const express = require('express');
const debug = require('debug')('app:debug');
const dbdebug = require('debug')('app:dbdebug');
const sampledebug = require('debug')('app:sampledebug');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

module.exports = (app) => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static('public'));
    app.use(cors({
        origin: ['http://127.0.0.1:8080', 'http://localhost:4200', 'http://localhost:4444']
    }));
    // app.use(cors());
    app.use(morgan('tiny'));

    app.use(helmet());

    debug('General debug statement');
    dbdebug('General dbdebug statement');
    sampledebug('General sampledebug statement');

    // const middlewareFn = function (req, res, next) {
    //     console.log("My middleware fn");
    //     next();
    // };
    // if (process.env.NODE_ENV === 'development') {
    //     app.use(middlewareFn);
    // }
    // console.log(app.get(process.env.NODE_ENV));
}
