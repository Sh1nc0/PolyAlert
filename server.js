let dbHelper = require('./dbHelper.js');

const app = require('./app');
const server = require('http').createServer(app);

const io = require('socket.io')(server);

// Real time message listen on database
dbHelper.db.on('trace', (sql) => {
    if (sql.includes('insert into Message')) {
        const pattern = /\("([^"]+)", "([^"]+)", "([^"]+)"\)/g;
        const matches = sql.matchAll(pattern);
        for (const match of matches) {
            let message = {
                issueID: match[2],
                content: match[3],
                userID: match[1],
            };
            io.emit(message.issueID, message);
        }
    }
});

server.listen(8080);
