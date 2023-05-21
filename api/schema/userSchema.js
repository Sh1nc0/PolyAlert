'use strict';

module.exports.updateUserSchema = {
    lastname: {
        optional: {options: {nullable: false}},
        notEmpty: true,
        isString: true,
    },
    firstname: {
        optional: {options: {nullable: false}},
        notEmpty: true,
        isString: true,
    },
    email: {
        optional: {options: {nullable: false}},
        notEmpty: true,
        isString: true,
    },
    password: {
        optional: {options: {nullable: false}},
        notEmpty: true,
        isString: true,
    },
    type: {
        optional: {options: {nullable: false}},
        isInt: true,
    },
};
