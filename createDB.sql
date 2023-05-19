DROP TABLE IF EXISTS User;
DROP TABLE IF EXISTS Issue;
DROP TABLE IF EXISTS Message;
DROP TABLE IF EXISTS Report;
DROP TABLE IF EXISTS UserType;
DROP TABLE IF EXISTS IssueType;
--
-- Enum UserType
--

CREATE TABLE UserType (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    value TEXT UNIQUE NOT NULL
);

INSERT INTO UserType (value) VALUES ('Enseignant');
INSERT INTO UserType (value) VALUES ('Etudiant');
INSERT INTO UserType (value) VALUES ('Technicien');

--
-- Enum IssueType
--

CREATE TABLE IssueType (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    value TEXT UNIQUE NOT NULL
);

INSERT INTO IssueType (value) VALUES ('furniture');
INSERT INTO IssueType (value) VALUES ('software');
INSERT INTO IssueType (value) VALUES ('misc');


CREATE TABLE User (
    id TEXT PRIMARY KEY,
    lastname TEXT NOT NULL,
    firstname TEXT NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    type INTEGER NOT NULL,
    FOREIGN KEY(type) REFERENCES UserType(id)
);

CREATE TABLE Issue (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userID TEXT NOT NULL,
    technicianID TEXT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    location TEXT NOT NULL,
    type INTEGER NOT NULL,
    criticity INTEGER NOT NULL,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated TIMESTAMP,
    closedAt TIMESTAMP,
    anonymous INTEGER DEFAULT 0 NOT NULL,
    FOREIGN KEY(userID) REFERENCES User(id),
    FOREIGN KEY(technicianID) REFERENCES User(id)
);

CREATE TABLE Message (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    authorID TEXT NOT NULL,
    issueID INTEGER NOT NULL,
    content TEXT NOT NULL,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY(authorID) REFERENCES User(id),
    FOREIGN KEY(issueID) REFERENCES Issue(id)
);

CREATE TABLE Report (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    issueID INTEGER NOT NULL,
    reporterID TEXT NOT NULL,
    reportedID TEXT NOT NULL,
    reason TEXT NOT NULL,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY(issueID) REFERENCES Issue(id),
    FOREIGN KEY(reporterID) REFERENCES User(id),
    FOREIGN KEY(reportedID) REFERENCES User(id)
);