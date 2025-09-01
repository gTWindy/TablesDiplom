const db = require('../db');

const { SaveRepo } = require("./saveRepo");

class SickRepo {
    constructor(db) {
        this.db = db;
        this.createTable();
    }
    
    // Создание таблицы
    async createTable() {
        const sql = `
            CREATE TABLE IF NOT EXISTS sick (
                id TEXT REFERENCES cadets(id) PRIMARY KEY,
                type TEXT CHECK(type IN ("lazaret", "hospital")),
                date DATE,
                diagnosis TEXT
            );
        `;
        await this.db.run(sql);
    }

    // Взять список всех больных
    async selectAll() {
        const sql = `SELECT * FROM sick`;
        return this.db.all(sql, []);
    }

    // Вставить больного курсанта в таблицу
    async insertOrUpdateSickTable(id, type, date, diagnosis) {
        const sql = `INSERT INTO sick (id, type, date, diagnosis)
                    VALUES (:id, :type, :date, :diagnosis)
                    ON CONFLICT(id) DO UPDATE SET
                        type = EXCLUDED.type;`;
        return this.db.run(sql, [id, type, date, diagnosis]);
    }
    
    async removeFromSickTableById(id) {
        const sql = `
        DELETE FROM sick
        WHERE id = :id
        `;
        return this.run(sql, [id]);
    }
}

const sickRepo = new SickRepo(db);

module.exports = {sickRepo};