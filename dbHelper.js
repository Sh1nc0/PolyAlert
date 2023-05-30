/* eslint-env node */

const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./PolyAlert.db', sqlite3.OPEN_READWRITE, function (err) {
    if (err) {
        console.error(err + '\n' + 'run "npm run createDB" to create a database file');
        require('process').exit(-1);
    }
});

// Rend la fonction get de l'api sqlite compatible avec les promesses
const get = sql => new Promise(function (resolve, reject) {
    db.get(sql, function (err, row) {
        if (err) {
            reject(err);
        }
        else {
            resolve(row);
        }
    });
});

// Idem pour la fonction all
const all = sql => new Promise(function (resolve, reject) {
    db.all(sql, function (err, rows) {
        if (err) {
            reject(err);
        }
        else {
            resolve(rows);
        }
    });
});

const run = sql => new Promise(function (resolve, reject) {
    db.run(sql, function (err) {
        if (err) {
            reject(err);
        }
        else {
            resolve(this);
        }
    });
});

module.exports.db = db;

module.exports.users = {
    all: () => all('select User.*, UserType.value AS role from User LEFT JOIN UserType on User.type = UserType.id'),
    byId: id => get(`select User.*, UserType.value AS role from User LEFT JOIN UserType on User.type = UserType.id where User.id = "${id}"`),
    byEmail: email => get(`select User.*, UserType.value AS role from User LEFT JOIN UserType on User.type = UserType.id where User.email = "${email}"`),
    update: (id, user) => {
        let sql = 'update User set ';
        let keys = Object.keys(user);
        for (let i = 0; i < keys.length; i += 1) {
            if (user[keys[i]] !== undefined){
                sql += `${keys[i]} = "${user[keys[i]]}"`;
                if (user[keys[i + 1]])
                    sql += ', ';
            }
        }
        sql += ` where id = "${id}"`;
        return run(sql);
    },
};

module.exports.reports = {
    all: () => all('select * from Report'),
    byIssueId: id => all(`select * from Report where issueID = "${id}"`),
    byReporterId: id => all(`select * from Report where reporterID = "${id}"`),
    byReportedId: id => all(`select * from Report where reportedID = "${id}"`),
    create: report => run(`insert into Report (issueID, reporterID, reportedID, reason) values ("${report.issueID}", "${report.reporterID}", "${report.reportedID}", "${report.reason}")`),
};

module.exports.issues = {
    all: () => all('select * from Issue'),
    byId: id => get(`select * from Issue where id = "${id}"`),
    byUserId: id => all(`select * from Issue where userID = "${id}"`),
    byTechnicianId: id => all(`select * from Issue where technicianID = "${id}"`),
    create: issue => run(`insert into Issue (userID, title, description, location, type, criticity, anonymous) values ("${issue.userID}", "${issue.title}", "${issue.description}", "${issue.location}", "${issue.type}", "${issue.criticity}", "${issue.anonymous}")`),
    handle: (id, technicianID) => run(`update Issue set technicianID = "${technicianID}" where id = "${id}"`),
    close: id => run(`update Issue set closedAT = datetime('now') where id = "${id}"`),
};

module.exports.messages = {
    byIssueId: id => all(`select * from Message where issueID = "${id}"`),
    create: message => run(`insert into Message (authorID, issueID, content) values ("${message.authorID}", "${message.issueID}", "${message.content}")`),
};
