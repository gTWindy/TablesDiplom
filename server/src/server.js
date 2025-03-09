// Перевод колонок
const translateForColumns =
{
    service: 'Наряд',
    lazaret: 'Лазарет',
    hospital: 'Госпиталь',
    trip: 'Командировка',
    vacation: 'Отпуск',
    dismissal: 'Увольнение',
    other: 'Прочее'
}

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const deepMerge = require('deepmerge-json');
// Модуль для работы с БД
const { DB } = require('./db');
const db = new DB('./test/cadets.db');
// Подключение к базе данных
db.connect();

const {
    getCourseList,
    getBusyList
} = require('./getList')

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Путь к файлу с больными
const filePathSick = './test/больные/sick.json';

// Обработка POST-запроса
app.post('/checkLogin', (req, res) => {
    // Доступ к данным формы
    const formData = req.body;
    console.log(formData);
    const username = formData.username;
    const password = formData.password;

    if (username === "DejFak" && password === "123")
        return res.status(200).json({ message: 'Успешный вход.', state: "DejFak" });
    else if (username === "1kurs" && password === "123")
        return res.status(200).json({ message: 'Успешный вход.', state: "1kurs" });
    else if (username === "2kurs" && password === "123")
        return res.status(200).json({ message: 'Успешный вход.', state: "2kurs" });
    else if (username === "3kurs" && password === "123")
        return res.status(200).json({ message: 'Успешный вход.', state: "3kurs" });
    else if (username === "4kurs" && password === "123")
        return res.status(200).json({ message: 'Успешный вход.', state: "4kurs" });
    else if (username === "5kurs" && password === "123") {
        // Отправляем JSON-ответ
        return res.status(200).json({
            message: 'Успешный вход.',
            state: '5kurs'
        });
    }
    else if (username === "lazaret" && password === "123")
        return res.status(200).json({ message: 'Успешный вход.', state: "lazaret" });
    else
        return res.status(401).json({ message: 'Некорректный логин или пароль.' });
});

// Посылаем список для одного курса или для всех курсов
app.get('/manList', (req, res) => {
    // Извлекаем параметр курс из запроса
    const course = req.query.course;
    if (course) {
        let groupList = null;
        switch(Number(course)) {
            case 1:
                groupList = getCourseList('./test/1курс/группы/');
                break;
            case 2:
                groupList = getCourseList('./test/2курс/группы/');
                break;
            case 3:
                groupList = getCourseList('./test/3курс/группы/');
                break;
            case 4:
                groupList = getCourseList('./test/4курс/группы/');
                break;
            case 5:
                groupList = getCourseList('./test/5курс/группы/');
                break;
            default:
                return res.status(404);
        }
        // Отправляем JSON-ответ
        return res.status(200).json({...groupList});
    }
    else {
        // Получаем первый курс
        const firstCourse = getCourseList('./test/1курс/группы/');

        // Получаем второй курс
        const secondCourse = getCourseList('./test/2курс/группы/');

        // Получаем третий курс
        const thirdCourse = getCourseList('./test/3курс/группы/');

        // Получаем четвёртый курс
        const fourthCourse = getCourseList('./test/4курс/группы/');

        // Получаем пятый курс
        const fifthCourse = getCourseList('./test/5курс/группы/');
        
        // Отправляем JSON-ответ
        return res.status(200).json([
            {...firstCourse},
            {...secondCourse},
            {...thirdCourse},
            {...fourthCourse},
            {...fifthCourse}
        ]);
    }
});

app.post('/busyList', async (req, res) => {
    // Доступ к данным формы
    const formData = req.body;

    // Номер курса
    let numberOfCourse = formData.numberOfCourse;
    if (numberOfCourse) {
        // Очищаем старые записи сохранения для этого курса
        await db.clearBusyTable(numberOfCourse);
    } else {
        numberOfCourse = 0;
        await db.clearBusyTable(1);
        await db.clearBusyTable(2);
        await db.clearBusyTable(3);
        await db.clearBusyTable(4);
        await db.clearBusyTable(5);
    }

    // Вставляем занятых в бд
    for (const group of formData.people) {
        for (let columnName in group) {
            group[columnName].forEach(async (busyManId) => await db.insertOrUpdateBusyTable(busyManId, columnName));
        }
    }
    
    // Обновляем запись о сохранении в бд
    await db.insertRowInSaveTable(numberOfCourse, formData.dateAndTime, formData.savedName, formData.savedRank);
    
    return res.status(200);
})

app.get('/busyList', async (req, res) => {
    // Извлекаем параметр курс из запроса
    let course = req.query.course;
    // Наш ответ клиенту
    const response = {};
    if (course) {
        switch(Number(course)) {
            case 1:
                response['1111'] = await db.selectByGroupFromBusyTable(1111);
                response['1112'] = await db.selectByGroupFromBusyTable(1112);
                response['1113'] = await db.selectByGroupFromBusyTable(1113);
                response['1114'] = await db.selectByGroupFromBusyTable(1114);
                response['1115'] = await db.selectByGroupFromBusyTable(1115);
                break;
            case 2:
                response['2111'] = await db.selectByGroupFromBusyTable(2111);
                response['2112'] = await db.selectByGroupFromBusyTable(2112);
                response['2113'] = await db.selectByGroupFromBusyTable(2113);
                response['2114'] = await db.selectByGroupFromBusyTable(2114);
                response['2115'] = await db.selectByGroupFromBusyTable(2115);
                break;
            case 3:
                response['3111'] = await db.selectByGroupFromBusyTable(3111);
                response['3112'] = await db.selectByGroupFromBusyTable(3112);
                response['3113'] = await db.selectByGroupFromBusyTable(3113);
                response['3114'] = await db.selectByGroupFromBusyTable(3114);
                response['3115'] = await db.selectByGroupFromBusyTable(3115);
                break;
            case 4:
                response['4111'] = await db.selectByGroupFromBusyTable(4111);
                response['4112'] = await db.selectByGroupFromBusyTable(4112);
                response['4113'] = await db.selectByGroupFromBusyTable(4113);
                response['4114'] = await db.selectByGroupFromBusyTable(4114);
                response['4115'] = await db.selectByGroupFromBusyTable(4115);
                break;
            case 5:
                response['5111'] = await db.selectByGroupFromBusyTable(5111);
                response['5112'] = await db.selectByGroupFromBusyTable(5112);
                response['5113'] = await db.selectByGroupFromBusyTable(5113);
                response['5114'] = await db.selectByGroupFromBusyTable(5114);
                response['5115'] = await db.selectByGroupFromBusyTable(5115);
                break;
            default:
                return res.status(404);
        }       
    } else {
        // 0 курс - это факультет
        course = 0;
        
        // Получаем первый курс занятых
        const firstCourseBusy = await db.selectByCourseFromBusyTable(1);
            
        // Получаем второй курс
        const secondCourse = await db.selectByCourseFromBusyTable(2);

        // Получаем третий курс
        const thirdCourse = await db.selectByCourseFromBusyTable(3);

        // Получаем четвёртый курс
        const fourthCourse = await db.selectByCourseFromBusyTable(4);

        // Получаем пятый курс
        const fifthCourse = await db.selectByCourseFromBusyTable(5);

        response.people = [
            [ ...firstCourseBusy ],
            [ ...secondCourse ],
            [ ...thirdCourse ],
            [ ...fourthCourse ],
            [ ...fifthCourse ]
        ];
    }
    const saveRow = await db.selectSaveRowByCourse(Number(course));
    if (saveRow) {
        response.rank = saveRow.rank;
        response.name = saveRow.name;
        response.date = saveRow.dateAndTime;
    }
    // Отправляем JSON-ответ
    return res.status(200).json({...response});
})

// Получаем список больных
app.get('/sick', (req, res) => {
    // Читаем файл
    const data = fs.readFileSync(filePathSick, 'utf8');
    let parsedData = null;
    try {
        parsedData = JSON.parse(data); // Парсим JSON в объект
    } catch (error) {
        console.error(`Ошибка при парсинге файла ${file}:`, error.message);
    }
    
    // Извлекаем параметр курс из запроса
    const course = req.query.course;
    if (course) {
        const oldParsedData = parsedData;
        parsedData = {};
        oldParsedData.forEach(sick => {
            if (!parsedData[sick.group])
                parsedData[sick.group] = {};
            if (!parsedData[sick.group][sick.medInstitution])
                parsedData[sick.group][sick.medInstitution] = [];
            parsedData[sick.group][sick.medInstitution].push(sick);
        });         
        // Отправляем JSON-ответ как объект
        return res.status(200).json(
            {...parsedData}
        );
    }
    // Отправляем JSON-ответ как массив
    return res.status(200).json(
        [...parsedData]
    );
    
});

// Запоминаем список больных
app.post('/sick', async (req, res) => {
    // Доступ к данным формы
    const formData = req.body;

    // Получаем старый список больных
    const oldSickList = await db.selectAllFromSickTable();

    // Новые данные находятся в объекте formData
    const newSickList = formData.rows;

    // Преобразуем списки в множества для работы с уникальными элементами
    const oldSet = new Set(oldSickList);
    const newSet = new Set(newSickList);

    // Находим тех, кого добавили
    const added = [...newSet].filter(item => !oldSet.has(item));

    // Находим тех, кого удалили
    const removed = [...oldSet].filter(item => !newSet.has(item));
    
    // Создаем список курсов, где есть изменения
    const groupChangeSet = new Set(added.map((sickMan) => sickMan.course))
    removed.forEach((sickMan) => groupChangeSet.add(sickMan.course));
    // Удаляем записи о сохранении
    groupChangeSet.forEach((course) => db.removeSaveRowByCourse(course))

    // Вставляем новеньких
    for (const sickMan of added) {
        db.insertOrUpdateBusyTable(sickMan["Личный номер"], sickMan.medInstitution);
        db.insertOrUpdateSickTable(sickMan["Личный номер"], sickMan.medInstitution, sickMan.date, sickMan.diagnosis);
    }
    //  Удаляем стареньких
    for (const sickMan of added) {
        db.removeFromBusyTableById(sickMan["Личный номер"]);
        db.removeFromSickTableById(sickMan["Личный номер"]);
    }

    // Записываем обновленные данные обратно в файл
    fs.writeFileSync(filePathSick, JSON.stringify(formData.rows, null, 2)); // Форматируем JSON с отступами

    console.log('Больные успешно обновлены.');
    return res.status(204);
})

app.get('/checkLogin', (req, res) => {
    res.json({ message: "Hello from the server!" });
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
