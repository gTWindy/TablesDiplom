const sqlite3 = require('sqlite3').verbose();

class DB {
    constructor(file) {
        this.file = file;
        this.db = null;
    }

    async connect() {
        return new Promise((resolve, reject) => {
            this.db = new sqlite3.Database(this.file, err => {
                if (err) {
                    console.error(`Could not connect to ${this.file}: ${err.message}`);
                    reject(err);
                } else {
                    console.log(`Connected to the database ${this.file}.`);
                    resolve();
                }
            });
        }).then(() => {
            return new Promise((resolve, reject) => {
                this.db.run(
                    `CREATE TABLE IF NOT EXISTS cadets (
                        course INTEGER,
                        "group" INTEGER,
                        serial INTEGER,
                        rank TEXT,
                        name TEXT,
                        birthday DATE,
                        phone TEXT,
                        id TEXT PRIMARY KEY
                    )`,
                    err => {
                        if (err) {
                            console.error(`Error creating table: ${err.message}`);
                            reject(err);
                        } else {
                            console.log('Table created or already exists.');
                            resolve();
                        }
                    }
                );
            });
        });
    }

    run(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function (err) {
                if (err) {
                    console.error('Error running sql ' + sql);
                    console.error(err);
                    reject(err);
                } else {
                    resolve({ id: this.lastID });
                }
            });
        });
    }

    close() {
        this.db.close(err => {
            if (err) {
                console.error(err.message);
            }
            console.log('Closed the database connection.');
        });
    }

    // Функция для вставки нового курсанта
    insertCadet(course, group, serial, rank , name, birthday, phone, id) {
        const sql = `INSERT INTO cadets (course, 'group', serial, rank , name, birthday, phone, id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        this.db.run(sql, [course, group, serial, rank , name, birthday, phone, id], (err) => {
            if (err) {
                console.error(err.message);
            } else {
                console.log(`Row inserted with ID ${id}`);
            }
        });
    }

    // Функция для вставки нового курсанта
    select() {
        const sql = `select * from cadets`;
        this.db.run(sql, [], (err) => {
            if (err) {
                console.error(err.message);
            } else {
                console.log(`Selected`);
            }
        });
    }
}

module.exports = {
    DB
};