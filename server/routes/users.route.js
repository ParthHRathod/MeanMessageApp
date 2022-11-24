const express = require('express');
const Router = express.Router();
const jwt = require('jsonwebtoken');
const { user } = require('../models/user.model');

Router.post('/register', async (req, res, next) => {
    
    const userDoc = user(req.body);
    
    try {
        const result = await userDoc.save();
        // res.send(result);
        var token = jwt.sign({
            _id: result._id,
        }, process.env.JWT_SECRET, {
            expiresIn: "1h"
        });
        res.send({
            isLoggedIn: true,
            token: token
        });
    } catch (ex) {
        if(ex.code === 11000)
            res.status(422).send(['User already exists.']);
        else
            return next(ex);
    }
});

Router.post('/login', async (req, res) => {
    try {
        const result = await user.findOne({username: req.body.username});

        if(!result)
            res.status(403).send({
                isLoggedIn: false,
                message: "User is not registered"
            });
        else {
            if (result.authenticatePassword(req.body.password, result.password)) {
                var token = jwt.sign({
                    _id: result._id,
                }, process.env.JWT_SECRET, {
                    expiresIn: "1h"
                });
                res.send({
                    isLoggedIn: true,
                    token: token
                });
            }
            else {
                res.status(403).send({
                    isLoggedIn: false,
                    message: "Invalid credentials"
                });
            }
        }
    } catch (ex) {
        res.status(403).send(ex);
    }
});

module.exports = Router;