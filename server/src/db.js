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

    async createTables() {
        try {
            await this.createTableCadets();
            await this.createTableBusy();
            await this.createTableSick();
            await this.createAndFillTableSaves();
            console.log('db: Все таблицы успешно созданы.');
        } catch (error) {
            console.error('Произошла ошибка:', error);
        }
    }

    async createTableCadets() {
        const sql = `
            CREATE TABLE IF NOT EXISTS cadets (
                course INTEGER,
                "group" INTEGER,
                serial INTEGER,
                rank TEXT,
                name TEXT,
                birthday DATE,
                phone TEXT,
                id TEXT PRIMARY KEY
            )
        `;
        
        return new Promise((resolve, reject) => {
            this.db.run(sql, err => {
                if (err) {
                    console.error(`Ошибка создания таблицы cadets: ${err.message}`);
                    reject(err);
                } else {
                    console.log('db: Таблица КУРСАНТЫ создана');
                    resolve();
                }
            });
        });
    }

    async createTableBusy() {
        const sql = `
            CREATE TABLE IF NOT EXISTS busy (
                id TEXT REFERENCES cadets(id) PRIMARY KEY,
                type TEXT CHECK(type IN ("service", "lazaret", "hospital", "trip", "vacation", "dismissal", "other"))
            )
        `;
        
        return new Promise((resolve, reject) => {
            this.db.run(sql, err => {
                if (err) {
                    console.error(`db: Ошибка создания таблицы busy: ${err.message}`);
                    reject(err);
                } else {
                    console.log('db: Таблица BUSY создана');
                    resolve();
                }
            });
        });
    }

    async createTableSick() {
        const sql = `
            CREATE TABLE IF NOT EXISTS sick (
                id TEXT REFERENCES cadets(id) PRIMARY KEY,
                type TEXT CHECK(type IN ("lazaret", "hospital"))
            );
        `;
        
        return new Promise((resolve, reject) => {
            this.db.run(sql, err => {
                if (err) {
                    console.error(`db: Ошибка создания таблицы SICK: ${err.message}`);
                    reject(err);
                } else {
                    console.log('db: Таблица SICK создана');
                    resolve();
                }
            });
        });
    }

    async createAndFillTableSaves() {
        const sql = `
            CREATE TABLE IF NOT EXISTS saves (
                course INTEGER PRIMARY KEY,
                date DATE
            );
            
            INSERT INTO saves(course, date)
            VALUES (0, '1901-12-01'),
                    (1, DATE('now')),
                    (2, DATE('now')),
                    (3, DATE('now')),
                    (4, DATE('now')),
                    (5, DATE('now'));
        });
        `;
        
        return new Promise((resolve, reject) => {
            this.db.run(sql, err => {
                if (err) {
                    console.error(`db: Ошибка создания таблицы saves: ${err.message}`);
                    reject(err);
                } else {
                    console.log('db: Таблица saves создана');
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

    // Вставка нового курсанта
    insertCadet(course, group, serial, rank , name, birthday, phone, id) {
        const sql = `INSERT OR IGNORE INTO cadets (course, 'group', serial, rank , name, birthday, phone, id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        this.db.run(sql, [course, group, serial, rank , name, birthday, phone, id], (err) => {
            if (err) {
                console.error(err.message);
            } else {
                console.log(`Row inserted with ID ${id}`);
            }
        });
    }

    // Получение всех курсантов
    async select() {
        const sql = `SELECT * FROM cadets`;
        return new Promise((resolve, reject) => {
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    console.error(err.message);
                    reject(err);
                } else {
                    console.log(`db: Selected all from cadets:`);
                    rows.forEach(row => {
                        // Пример вывода имени курсанта
                        console.log(`${row.id}: ${row.name}`);
                    });
                    resolve();
                }
            });
        });
    }

    async selectById(id) {
        const sql = `SELECT * FROM cadets WHERE id = ?`;
        return new Promise((resolve, reject) => {
            this.db.get(sql, [id], (err, row) => { // Используем db.get для одного результата
                if (err) {
                    console.error(err.message);
                    reject(err);
                } else {
                    console.log(`Selected by id ${id}:`);
                    resolve(row); // Возвращаем одну строку
                }
            });
        });
    }
}

module.exports = {
    DB
};