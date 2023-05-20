'use strict';

let express = require('express');
let dbHelper = require('../../dbHelper.js');
let app = express.Router();

const {checkSchema, validationResult} = require('express-validator');
const {getReportSchema, createReportSchema} = require('../schema/reportSchema.js');

app.get('/', getReportSchema, (req, res, next) => {

    const errors = validationResult(req);
    let promise;

    if (!errors.isEmpty())
        res.status(400).json(errors.array());

    else if (Object.keys(req.query).length > 1)
        res.status(400).json({message: 'Too many parameters'});

    else if (Object.keys(req.query).length === 0)
        promise = dbHelper.reports.all();

    else if (req.query.reporterID)
        promise = dbHelper.reports.byReporterId(req.query.reporterID);

    else if (req.query.reportedID)
        promise = dbHelper.reports.byReportedId(req.query.reportedID);

    else if (req.query.issueID)
        promise = dbHelper.reports.byIssueId(req.query.issueID);

    if (promise){
        promise.then(
            reports => {
                res.set('Content-type', 'application/json');
                res.send(JSON.stringify(reports));
            },
            err => {
                next(err);
            },
        );
    }
});

app.post('/', checkSchema(createReportSchema), (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        res.status(400).json(errors.array());
    else {
        let report = {
            issueID: req.body.issueID,
            reporterID: req.body.reporterID,
            reportedID: req.body.reportedID,
            reason: req.body.reason,
        };

        dbHelper.reports.create(report).then(
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