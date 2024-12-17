const sqlite3 = require('sqlite3').verbose();

const connectToDB = () => {
    const db = new sqlite3.Database('./filesDB.sqlite', (err) => {
        if (err) {
            console.error('Could not connect to database', err);
        } else {
            console.log('Connected to SQLite database.');
            db.run(
                `CREATE TABLE IF NOT EXISTS files (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT,
                    data TEXT
                )`
            );
            console.log("table created");
        }
    });
    return db;
};

const saveFileRecord = (fileName, extractedData) => {
    const db = connectToDB();
    console.log("adding to database");
    return new Promise((resolve, reject) => {
        db.run(
            `INSERT INTO files (name, data) VALUES (?, ?)`,
            [fileName, JSON.stringify(extractedData)],
            function (err) {
                if (err) reject(err);
                else resolve({ id: this.lastID, fileName, extractedData });
            }
        );
    });
};

const fetchFileRecords = () => {
    const db = connectToDB();
    console.log("deleting from database");
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM files`, [], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

const deleteFileRecord = (fileName) => {
    console.log(fileName);
    const db = connectToDB();
    return new Promise((resolve, reject) => {
        db.run(`DELETE FROM files WHERE name = ?`, [fileName], (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
};

const deleteallRecord = (fileName) => {
    console.log(fileName);
    const db = connectToDB();
    return new Promise((resolve, reject) => {
        db.run(`DELETE FROM files`, [], (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
};

module.exports = { connectToDB, saveFileRecord, fetchFileRecords, deleteFileRecord,deleteallRecord };
