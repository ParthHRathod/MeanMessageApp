require('./config/config');
const express = require('express');
const app = express();
const routes_user = require('./routes/users.route');
const routes_msg = require('./routes/messages.route');
const jwt = require('jsonwebtoken');

require('./startup/middlewares')(app);
require('./startup/db')();

app.use('/api/auth', routes_user);

app.use((req, res, next) => {
    var token = req.headers.authtoken || req.body.authtoken || req.params.authtoken;
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            res.status(403).send({
                isLoggedIn: false,
                message: "No token provided. Please log in again"
            });
        } else {
            req.decoded = decoded;
            next();
        }
    });
});

app.use('/api/msgs', routes_msg);

app.use((ex, req, res, next) => {
    if(ex.name === 'ValidationError') {
        var valErrors = [];
        Object.keys(ex.errors).forEach(key => valErrors.push(ex.errors[key].message));
        res.status(422).send(valErrors);
        next();
    }
});

app.listen(process.env.PORT, () => {
    console.log("PostApp express server running at port: "+ process.env.PORT);
});