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
        
        await this.run(sql);
    }

    async createTableBusy() {
        const sql = `
            CREATE TABLE IF NOT EXISTS busy (
                id TEXT REFERENCES cadets(id) PRIMARY KEY,
                type TEXT CHECK(type IN ("service", "lazaret", "hospital", "trip", "vacation", "dismissal", "other")),
                remark TEXT
            )
        `;
        
        await this.run(sql);
    }

    async createTableSick() {
        const sql = `
            CREATE TABLE IF NOT EXISTS sick (
                id TEXT REFERENCES cadets(id) PRIMARY KEY,
                type TEXT CHECK(type IN ("lazaret", "hospital")),
                date DATE,
                diagnosis TEXT
            );
        `;
        
        await this.run(sql);
    }

    async createAndFillTableSaves() {
        // 0 - за факультет, 1...5 - за курс, 6 - лазарет
        const sql = `
            CREATE TABLE IF NOT EXISTS saves (
                course INTEGER PRIMARY KEY,
                dateAndTime TEXT,
                name TEXT,
                rank TEXT
            );
            
            INSERT INTO saves(course, date, name, rank)
            VALUES (0, DATE('now'), '', ''),
                    (1, DATE('now'), '', ''),
                    (2, DATE('now'), '', ''),
                    (3, DATE('now'), '', ''),
                    (4, DATE('now'), '', ''),
                    (5, DATE('now'), '', ''),
                    (6, DATE('now'), '', '');
        });
        `;
        
        await this.run(sql);
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

    // Вставка нового курсанта
    async insertCadet(course, group, serial, rank , name, birthday, phone, id) {
        const sql = `INSERT OR IGNORE INTO cadets (course, 'group', serial, rank , name, birthday, phone, id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        await this.run(sql, [course, group, serial, rank , name, birthday, phone, id]);
    }

    // Получение всех курсантов
    async selectAllCadets() {
        const sql = `SELECT * FROM cadets`;
        return this.all(sql, [])
    }

    // 
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

    // Удалить все записи о занятых для определенного курса
    async clearBusyTable(numberOfCourse) {
        const sql = `
        DELETE FROM busy
        WHERE id in (select id from cadets
        WHERE course = :numberOfCourse)
        `;
        return this.run(sql, [numberOfCourse]);
    }

    async removeFromBusyTableById(id) {
        const sql = `
        DELETE FROM busy
        WHERE id = :id
        `;
        return this.run(sql, [id]);
    }

    // Вставить занятого курсанта в таблицу
    async insertOrUpdateBusyTable(id, type, remark) {
        const sql = `INSERT INTO busy (id, type, remark)
                    VALUES (:id, :type, :remark)
                    ON CONFLICT(id) DO UPDATE SET
                        type = EXCLUDED.type,
                        remark = EXCLUDED.remark;
                    `;
        return await this.run(sql, [id, type, remark]);
    }

    // Взять список занятых по курсу
    async selectByCourseFromBusyTable(courseNumber) {
        const sql = `SELECT * FROM busy WHERE id in (SELECT id from cadets WHERE course == ?)`;
        return this.all(sql, [courseNumber]);
    }
    
    // Взять список занятых по группе
    async selectByGroupFromBusyTable(groupNumber) {
        const sql = `SELECT * FROM busy WHERE id in (SELECT id from cadets WHERE "group" == ?)`;
        return this.all(sql, [groupNumber]);
    }

    // Взять список всех больных
    async selectAllFromSickTable() {
        const sql = `SELECT * FROM sick`;
        return this.all(sql, []);
    }

    // Вставить больного курсанта в таблицу
    async insertOrUpdateSickTable(id, type, date, diagnosis) {
        const sql = `INSERT INTO sick (id, type, date, diagnosis)
                    VALUES (:id, :type, :date, :diagnosis)
                    ON CONFLICT(id) DO UPDATE SET
                        type = EXCLUDED.type;`;
        return this.run(sql, [id, type, date, diagnosis]);
    }
    
    async removeFromSickTableById(id) {
        const sql = `
        DELETE FROM sick
        WHERE id = :id
        `;
        return this.run(sql, [id]);
    }

    async selectSaveRowByCourse(course) {
        const sql = `SELECT * FROM saves WHERE course = ?`;
        return new Promise((resolve, reject) => {
            this.db.get(sql, [course], (err, row) => {
                if (err) {
                    console.error(err.message);
                    reject(err);
                } else {
                    console.log(`Selected by course ${course}:`);
                    resolve(row);
                }
            });
        });
    }

    // Вставить запись о сохранении
    async insertRowInSaveTable(numberOfCourse, dateAndTime, name, rank) {
        const sql = `INSERT INTO saves (course, dateAndTime, name, rank)
                    VALUES (:numberOfCourse, :dateAndTime, :name, :rank)
                    ON CONFLICT(course) DO UPDATE SET
                        dateAndTime = EXCLUDED.dateAndTime,
                        name = EXCLUDED.name,
                        rank = EXCLUDED.rank;
                        `;
        return this.run(sql, [numberOfCourse, dateAndTime, name, rank]);
    }

    async removeSaveRowByCourse(course) {
        const sql = `DELETE FROM saves WHERE course = ?`;
        return this.run(sql, [course]);
    }
}

module.exports = {
    DB
};