const {db} = require('../db');

class BusyRepo {
    constructor(db) {
        this.db = db;
        this.createTable(db);
    }
    
    // Создание таблицы
    async createTable() {
        const sql = `
            CREATE TABLE IF NOT EXISTS busy (
                id TEXT REFERENCES cadets(id) PRIMARY KEY,
                type TEXT CHECK(type IN ("service", "lazaret", "hospital", "trip", "vacation", "dismissal", "other"))
            )
        `;
        return this.db.run(sql);
    }

    // Удалить все записи о занятых для определенного курса
    async deleteAll() {
        const sql = `
        DELETE FROM busy
        `;
        return this.db.run(sql, []);
    }
    
    // Удалить все записи о занятых для определенного курса
    async deleteByCourse(numberOfCourse) {
        const sql = `
        DELETE FROM busy
        WHERE id in (select id from cadets
        WHERE course = :numberOfCourse)
        `;
        return this.db.run(sql, [numberOfCourse]);
    }

    async removeById(id) {
        const sql = `
        DELETE FROM busy
        WHERE id = :id
        `;
        return this.db.run(sql, [id]);
    }

    // Вставить занятого курсанта в таблицу
    async insertOrUpdate(id, type) {
        const sql = `INSERT INTO busy (id, type)
                    VALUES (:id, :type)
                    ON CONFLICT(id) DO UPDATE SET
                        type = EXCLUDED.type;`;
        return this.db.run(sql, [id, type]);
    }

    // Взять список занятых по курсу
    async selectByCourse(courseNumber) {
        const sql = `SELECT * FROM busy WHERE id in (SELECT id from cadets WHERE course == ?)`;
        return this.db.all(sql, [courseNumber]);
    }
    
    // Взять список занятых по группе
    async selectByGroup(groupNumber) {
        const sql = `SELECT * FROM busy WHERE id in (SELECT id from cadets WHERE "group" == ?)`;
        return this.db.all(sql, [groupNumber]);
    }
}

const busyRepo = new BusyRepo(db);

module.exports = {busyRepo};