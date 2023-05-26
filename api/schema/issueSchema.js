

const {query} = require('express-validator');

module.exports.getIssueSchema =  [
    query('userID').optional().notEmpty().isString(),
    query('technicianID').optional().notEmpty().isString(),
    query('issueID').optional().notEmpty().isInt(),
];

module.exports.createIssueSchema = {
    userID: {
        notEmpty: true,
        isString: true,
    },
    title: {
        notEmpty: true,
        isString: true,
    },
    description: {
        isString: true,
    },
    location: {
        notEmpty: true,
        isString: true,
    },
    type: {
        isInt: true,
    },
    criticity: {
        isInt: true,
    },
    anonymous: {
        optional: {options: {nullable: false}},
        isBoolean: true,
    },
};

module.exports.handleIssueSchema = {
    technicianID: {
        notEmpty: true,
        isString: true,
    },
};