'use strict';

module.exports.updateUserSchema = {
    lastname: {
        optional: {options: {nullable: false}},
        isString: true,
    },
    firstname: {
        optional: {options: {nullable: false}},
        isString: true,
    },
    email: {
        optional: {options: {nullable: false}},
        isString: true,
    },
    password: {
        optional: {options: {nullable: false}},
        isString: true,
    },
    type: {
        optional: {options: {nullable: false}},
        isInt: true,
    },
};
