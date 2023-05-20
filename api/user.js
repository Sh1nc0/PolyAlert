'use strict';

let express = require('express');
let dbHelper = require('../dbHelper.js');
let app = express.Router();

const {checkSchema, validationResult} = require('express-validator');
const {updateUserSchema} = require('./schema/userSchema.js');

app.get('/', (req, res, next) => {
    dbHelper.users.all().then(
        users => {
            res.set('Content-type', 'application/json');
            res.send(JSON.stringify(users));
        },
        err => {
            next(err);
        },
    );
});

app.get('/:user_id', (req, res, next) => {
    dbHelper.users.byId(req.params.user_id).then(
        users => {
            res.set('Content-type', 'application/json');
            res.send(JSON.stringify(users));
        },
        err => {
            next(err);
        },
    );
});

app.patch('/:user_id', checkSchema(updateUserSchema), (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        res.status(400).json(errors.array());
    else if (req.body.isEmpty || Object.keys(req.body).length === 0)
        res.status(400).json({message: 'No field to update'});
    else {
        // Filter the body to keep only the fields we want to update
        let user = {
            lastname: req.body.lastname,
            firstname: req.body.firstname,
            email: req.body.email,
            password: req.body.password,
            type: req.body.type,
        };

        dbHelper.users.update(req.params.user_id, user).then(
            () => {
                res.send();
            },
            err => {
                next(err);
            },
        );
    }
});


module.exports = app;