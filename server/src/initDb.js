// Модуль для работы с БД
const { DB } = require('./db');
const db = new DB('./cadets.db');


const {
    getCourseList,
    getBusyList
} = require('./getList')

// Асинхронная функция для обработки
async function processData() {
    try {
        // Подключение к базе данных
        await db.connect();

        // Получаем данные о курсах
        const firstCourse = getCourseList('../test/1курс/группы/');
        const secondCourse = getCourseList('../test/2курс/группы/');
        const thirdCourse = getCourseList('../test/3курс/группы/');
        const fourthCourse = getCourseList('../test/4курс/группы/');
        const fifthCourse = getCourseList('../test/5курс/группы/');
        
        console.log('Все группы получены.');

        let serial = 1;
        for (let group in firstCourse) {
            for (let cadet of firstCourse[group]) {
                console.log(cadet);
                db.insertCadet(1, group, serial, cadet['Воинское звание'], cadet['ФИО'],
                    cadet['Дата рождения'], cadet['Номер телефона'], cadet['Личный номер']);
            }
        }

        db.select();

        console.log('Данные обработаны.');
    } catch (error) {
        console.error('Ошибка при обработке данных:', error);
    }
}

processData();