const {db} = require('../db');

class CadetRepo {
    constructor(db) {
        this.db = db;
        this.createTable();
    }
    
    // Создание таблицы
    async createTable() {
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
        this.db.run(sql);
    }

    // Вставка нового курсанта
    async insert(course, group, serial, rank , name, birthday, phone, id) {
        const sql = `INSERT OR IGNORE INTO cadets (course, 'group', serial, rank , name, birthday, phone, id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        return this.db.run(sql, [course, group, serial, rank , name, birthday, phone, id]);
    }

    // Получение всех курсантов
    async selectAll() {
        const sql = `SELECT * FROM cadets`;
        return this.db.all(sql, [])
    }

    // Получение курсантов по id
    async selectById(id) {
        const sql = `SELECT * FROM cadets WHERE id = ?`;
        return this.db.all(sql, [id]);
    }

    // Получение курсантов по группе
    async selectByGroup(group) {
        const sql = `SELECT * FROM cadets WHERE "group" = ?`;
        return this.db.all(sql, [group]);
    }

    // Получение названий всех групп
    async selectGroupNameByCourse(course) {
        const sql = `SELECT distinct "group" FROM cadets WHERE "course" = ?`;
        return this.db.all(sql, [course]);
    }
}

const cadetRepo = new CadetRepo(db);

module.exports = {cadetRepo};