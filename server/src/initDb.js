// Модуль для работы с БД
const { DB } = require("./db");
const db = new DB("../test/cadets.db");

const {
    getCourseList
} = require('./getList')

// Асинхронная функция для обработки
async function processData() {
    try {
        // Подключение к базе данных
        await db.connect();
        await db.createTables();
        // Получаем данные о курсах
        const сourses = [getCourseList('../test/1курс/группы/'), getCourseList('../test/2курс/группы/'),
                        getCourseList('../test/3курс/группы/'), getCourseList('../test/4курс/группы/'), getCourseList('../test/5курс/группы/')];
        
        console.log('initDb: Все курсы и группы получены.');

        let serial = 1;
        for (let course = 0; course < 5; course++) {
            for (let group in сourses[course]) {
                for (let cadet of сourses[course][group]) {
                    db.insertCadet(course + 1, group, serial, cadet['Воинское звание'], cadet['ФИО'],
                        cadet['Дата рождения'], cadet['Номер телефона'], cadet['Личный номер']);
                }
            }
        }
        console.log('initDb: Данные обработаны.');
    } catch (error) {
        console.error('Ошибка при обработке данных:', error);
    }
}

processData();