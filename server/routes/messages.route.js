const express = require('express');
const Router = express.Router();
// const jwt = require('jsonwebtoken');
const { user } = require('../models/user.model');
const { msg } = require('../models/messages.model');

Router.get('/getName', async (req, res, next) => {
    try{
        const result = await user.findById(req.decoded._id).select({firstname: 1, lastname: 1});
        console.log(result);
        res.send(result);
    } catch(ex) {
        res.send(ex);
    }
});

Router.get('/getReceviedMessages', async (req, res) => {
    try {
        const test = await user.findById(req.decoded._id);
        const result = await msg.find({receiver: test.username});
        // console.log(test);
        res.send(result);
        console.log(result);
    } catch (ex) {
        res.status(422).send(['No post found']);
    }
});

Router.post('/sendMessage', async (req, res, next) => {

    // console.log(req.body.sender);
    
    const msgDoc = msg(req.body);

    try {
        const result = await msgDoc.save();
        res.send(result);
    } catch (ex) {
        res.status(422).send(ex);
    }
    console.log(msgDoc);
});

Router.post('/important', async (req, res, next) => {

    console.log(req.body);

    const result = await msg.findOneAndUpdate({_id: req.body._id},
        {
            $set: {
                important: req.body.important
            }
        });

        // console.log(result);
});

Router.post('/deleteMessage', async (req, res, next) => {

    // console.log(req.body._id);
    console.log(req.body._id);

    const result = await msg.findById({ _id: req.body._id }).remove();
        console.log(result);
});

module.exports = Router;