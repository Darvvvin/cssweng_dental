const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

const Account = require('../models/AccountModel');
const saltRounds = 10;

// define objects for client request functions for a certain path in the server
const controller = {
    // render log-in page when client requests '/' defined in routes.js
    getIndex: function (req, res) {
        res.render('index', {
            title: 'Home | BookMeDental',
            home_active: true,
        });
    },
    getRegister: function (req, res) {
        res.render('register', {
            title: 'Register | BookMeDental',
            register_active: true,
        });
    },
    postRegister: function (req, res) {
        var errors = validationResult(req);

        if (!errors.isEmpty()) {
            errors = errors.errors;

            var details = {};
            for (let i = 0; i < errors.length; i++)
                details[errors[i].param + 'Error'] = errors[i].msg;

            res.render('register', details);
        } else {
            var { options, email, password } = req.body;

            // apply hashing
            bcrypt.hash(password, saltRounds, (err, hash) => {
                // create new Account document
                Account.create({
                    _id: new mongoose.Types.ObjectId(),
                    accType: options,
                    accEmail: email,
                    password: hash,
                })
                    .then(result => {
                        console.log(result);
                        // if no errors, send result for now
                        res.send(result);
                    })
                    .catch(err => {
                        // if there are errors, log them for now
                        console.log(err);
                    });
            });
        }
    },
};

// enables to export controller object when called in another .js file
module.exports = controller;
