const {db} = require('../db');

class SaveRepo {
    constructor(db) {
        this.db = db;
        this.createTable();
    }
    
    // Создание таблицы
    async createTable() {
        const sql = `
            CREATE TABLE IF NOT EXISTS saves (
                course INTEGER PRIMARY KEY,
                dateAndTime TEXT,
                name TEXT,
                rank TEXT
            );
            
            INSERT INTO saves(course, date, name, rank)
            VALUES (0, '1901-12-01', '', ''),
                    (1, DATE('now'), '', ''),
                    (2, DATE('now'), '', ''),
                    (3, DATE('now'), '', ''),
                    (4, DATE('now'), '', ''),
                    (5, DATE('now'), '', '');
        });
        `;
        return this.db.run(sql);
    }

    async selectByCourse(course) {
        const sql = `SELECT * FROM saves WHERE course = ?`;
        return this.db.all(sql, [course]);
    }

    // Вставить запись о сохранении
    async insert(numberOfCourse, dateAndTime, name, rank) {
        const sql = `INSERT INTO saves (course, dateAndTime, name, rank)
                    VALUES (:numberOfCourse, :dateAndTime, :name, :rank)
                    ON CONFLICT(course) DO UPDATE SET
                        dateAndTime = EXCLUDED.dateAndTime,
                        name = EXCLUDED.name,
                        rank = EXCLUDED.rank;
                        `;
        return this.db.run(sql, [numberOfCourse, dateAndTime, name, rank]);
    }

    async removeByCourse(course) {
        const sql = `DELETE FROM saves WHERE course = ?`;
        return this.db.run(sql, [course]);
    }
}

const saveRepo = new SaveRepo(db);

module.exports = {saveRepo};