'use strict';

const {query} = require('express-validator');

module.exports.getReportSchema =  [
    query('reporterID').optional().notEmpty().isString(),
    query('reportedID').optional().notEmpty().isString(),
    query('issueID').optional().notEmpty().isInt(),
];

module.exports.createReportSchema = {
    issueID: {
        isInt: true,
    },
    reporterID: {
        notEmpty: true,
        isString: true,
    },
    reportedID: {
        notEmpty: true,
        isString: true,
    },
    reason: {
        isString: true,
    },
};