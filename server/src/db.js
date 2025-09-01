const sqlite3 = require('sqlite3').verbose();

class DB {
    constructor(file) {
        this.file = file;
        this.db = null;
    }

    // Подключение к БД
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
        });
    }
  
    async run(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function (err) {
                if (err) {
                    console.error('Error running sql ' + sql);
                    console.error(err);
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    async all(sql, params) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) {
                    console.error(err.message);
                    reject(err);
                } else {
                    resolve(rows);
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
}

const db = new DB('../test/cadets.db');
db.connect();

module.exports = {
    db
};