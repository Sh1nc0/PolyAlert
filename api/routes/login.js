'use strict';

let express = require('express');

module.exports = function (passport) {
    let app = express.Router();

    app.post('/', (req, res, next) => {
        if (!req.body.username)
            return res.send({success: false, message: 'empty email'});
        if (!req.body.password)
            return res.send({success: false, message: 'empty password'});

        passport.authenticate('local', (err, user) => {
            if (err)
                return next(err);
            if (!user)
                return res.send({success: false, message: 'authentification failed'});

            req.login(user, (err) => {
                if (err)
                    return next(err);
                return res.send({success: true, message: 'authentification succeeded', user: {id: user.id, email: user.email, role: user.role}});
            });
        })(req, res, next);
    });

    return app;
};
