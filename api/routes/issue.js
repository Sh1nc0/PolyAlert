

let express = require('express');
let dbHelper = require('../../data/dbHelper.js');
let app = express.Router();

const {checkSchema, validationResult} = require('express-validator');
const {getIssueSchema, createIssueSchema, handleIssueSchema} = require('../schema/issueSchema.js');
const {createMessageSchema} = require('../schema/messageSchema.js');

app.get('/', getIssueSchema, (req, res, next) => {
    const errors = validationResult(req);
    let promise;

    if (!errors.isEmpty())
        res.status(400).json(errors.array());

    else if (Object.keys(req.query).length > 1)
        res.status(400).json({message: 'Too many parameters'});

    else if (Object.keys(req.query).length === 0)
        promise = dbHelper.issues.all();

    else if (req.query.userID)
        promise = dbHelper.issues.byUserId(req.query.userID);

    else if (req.query.technicianID)
        promise = dbHelper.issues.byTechnicianId(req.query.technicianID);

    else if (req.query.issueID)
        promise = dbHelper.issues.byId(req.query.issueID);

    if (promise){
        promise.then(
            issues => {
                res.set('Content-type', 'application/json');
                res.send(JSON.stringify(issues));
            },
            err => {
                next(err);
            },
        );
    }
});

app.post('/', checkSchema(createIssueSchema), (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        res.status(400).json(errors.array());
    else {
        let issue = {
            userID: req.body.userID,
            title: req.body.title,
            description: req.body.description,
            location: req.body.location,
            type: req.body.type,
            criticity: req.body.criticity,
            anonymous: req.body.anonymous ? 1 : 0,
        };

        dbHelper.issues.create(issue).then(
            () => {
                res.sendStatus(201);
            },
            err => {
                next(err);
            },
        );
    }
});

app.post('/:issue_id/handle', checkSchema(handleIssueSchema), (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        res.status(400).json(errors.array());

    dbHelper.issues.byId(req.params.issue_id).then(
        issue => {
            if (!issue)
                return res.status(400).json({msg: 'Issue does not exist'});

            return dbHelper.issues.handle(req.params.issue_id, req.body.technicianID);
        },
    ).then(() => {
        res.sendStatus(204);
    }).catch(err => {
        next(err);
    });
});

app.post('/:issue_id/close', (req, res, next) => {
    dbHelper.issues.byId(req.params.issue_id).then(
        issue => {
            if (!issue)
                return res.status(400).json({msg: 'Issue does not exist'});

            return dbHelper.issues.close(req.params.issue_id);
        },
    ).then(() => {
        res.sendStatus(204);
    }).catch(err => {
        next(err);
    });
});

app.delete('/:issue_id', (req, res, next) => {
    dbHelper.issues.byId(req.params.issue_id).then(
        issue => {
            if (!issue)
                return res.status(400).json({msg: 'Issue does not exist'});

            return dbHelper.issues.delete(req.params.issue_id);
        },
    ).then(() => {
        res.sendStatus(204);
    }).catch(err => {
        next(err);
    });
});

app.get('/:issue_id/messages', (req, res, next) => {
    dbHelper.issues.byId(req.params.issue_id).then(
        issue => {
            if (!issue)
                return res.status(400).json({msg: 'Issue does not exist'});

            return dbHelper.messages.byIssueId(req.params.issue_id);
        },
    ).then(
        messages => {
            res.set('Content-type', 'application/json');
            res.send(JSON.stringify(messages));
        },
    ).catch(err => {
        next(err);
    });
});

app.post('/:issue_id/messages', checkSchema(createMessageSchema), (req, res, next) => {
    let errors = validationResult(req);
    if (!errors.isEmpty())
        res.status(400).json(errors.array());

    dbHelper.issues.byId(req.params.issue_id).then(
        issue => {
            if (!issue)
                return res.status(400).json({msg: 'Issue does not exist'});
            if (issue.technicianID !== req.body.authorID && issue.userID !== req.body.authorID)
                return res.status(400).json({msg: 'You are not allowed to post a message on this issue'});

            let message = {
                issueID: req.params.issue_id,
                authorID: req.body.authorID,
                content: req.body.content,
            };

            return dbHelper.messages.create(message);
        },
    ).then(() => {
        res.sendStatus(201);
    }).catch(err => {
        next(err);
    });
});

module.exports = app;