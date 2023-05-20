/* eslint-env node */
'use strict';

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

module.exports.users = {
    all: () => all('select * from User'),
    byId: id => get(`select * from User where id = "${id}"`),
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
