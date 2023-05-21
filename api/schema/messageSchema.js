'use strict';

module.exports.createMessageSchema = {
    authorID: {
        notEmpty: true,
        isString: true,
    },
    content: {
        notEmpty: true,
        isString: true,
    },
};