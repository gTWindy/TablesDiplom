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

//Столбцы у таблиц
const columnsNames = [
    "service",
    "lazaret",
    "hospital",
    "trip",
    "vacation",
    "dismissal",
    "other"
]

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
        return res.status(200).json({
            firstCourse,
            secondCourse,
            thirdCourse,
            fourthCourse,
            fifthCourse
        });
    }
});

app.post('/busyList', (req, res) => {
    // Доступ к данным формы
    const formData = req.body;

    // Номер курса
    const numberOfCourse = formData.numberOfCourse;

    // Вставляем занятых в бд
    for (const group of formData.people) {
        for (let columnName in group.columns) {
            group.columns[columnName].forEach((busyManId) => db.insertOrUpdateBusyTable(busyManId, columnName));
        }
    }

    // Вставляем запись о сохранении в бд
    db.insertRowInSaveTable(numberOfCourse, formData.date, formData.savedName, formData.savedRank);

    const filePathBusy = `./test/${numberOfCourse}курс/busyList.json`;
    // Записываем обновленные данные в файл
    fs.writeFileSync(filePathBusy, JSON.stringify({
        date: formData.date,
        people: formData.people
    }, null, 2));
    return res.status(200);
})

app.get('/busyList', async (req, res) => {
    // Извлекаем параметр курс из запроса
    const course = req.query.course;
    if (course) {
        let busyList = {};

        switch(Number(course)) {
            case 1:
                busyList['1111'] = await db.selectByGroupFromBusyTable(1111);
                busyList['1112'] = await db.selectByGroupFromBusyTable(1112);
                busyList['1113'] = await db.selectByGroupFromBusyTable(1113);
                busyList['1114'] = await db.selectByGroupFromBusyTable(1114);
                busyList['1115'] = await db.selectByGroupFromBusyTable(1115);
                break;
            case 2:
                busyList['2111'] = await db.selectByGroupFromBusyTable(2111);
                busyList['2112'] = await db.selectByGroupFromBusyTable(2112);
                busyList['2113'] = await db.selectByGroupFromBusyTable(2113);
                busyList['2114'] = await db.selectByGroupFromBusyTable(2114);
                busyList['2115'] = await db.selectByGroupFromBusyTable(2115);
                break;
            case 3:
                busyList['3111'] = await db.selectByGroupFromBusyTable(3111);
                busyList['3112'] = await db.selectByGroupFromBusyTable(3112);
                busyList['3113'] = await db.selectByGroupFromBusyTable(3113);
                busyList['3114'] = await db.selectByGroupFromBusyTable(3114);
                busyList['3115'] = await db.selectByGroupFromBusyTable(3115);
                break;
            case 4:
                busyList['4111'] = await db.selectByGroupFromBusyTable(4111);
                busyList['4112'] = await db.selectByGroupFromBusyTable(4112);
                busyList['4113'] = await db.selectByGroupFromBusyTable(4113);
                busyList['4114'] = await db.selectByGroupFromBusyTable(4114);
                busyList['4115'] = await db.selectByGroupFromBusyTable(4115);
                break;
            case 5:
                busyList['5111'] = await db.selectByGroupFromBusyTable(5111);
                busyList['5112'] = await db.selectByGroupFromBusyTable(5112);
                busyList['5113'] = await db.selectByGroupFromBusyTable(5113);
                busyList['5114'] = await db.selectByGroupFromBusyTable(5114);
                busyList['5115'] = await db.selectByGroupFromBusyTable(5115);
                break;
            default:
                return res.status(404);
        }
        const saveRow = await db.selectSaveRowByCourse(Number(course));
        if (saveRow) {
            busyList.rank = saveRow.rank;
            busyList.name = saveRow.name;
            busyList.date = saveRow.date;
        }
        // Отправляем JSON-ответ
        return res.status(200).json({...busyList});
    }
    else {
        // Спписок занятых людей с ФИО и т.д.
        let busyList = [];
        
        const pushToBysyList = async (people) => {
            for (let columnName in people) {
                for (let busyMan of people[columnName]){
                    const selectedRow = await db.selectById(busyMan);
                    selectedRow.reason = translateForColumns[columnName];
                    selectedRow.remark = '';
                    busyList.push(selectedRow);
                }
            }
        }

        // Получаем первый курс занятых
        const firstCourseBusy = getBusyList('./test/1курс/busyList.json', true);
        await pushToBysyList(firstCourseBusy.people);
            
        // Получаем второй курс
        const secondCourse = getBusyList('./test/2курс/busyList.json', true);
        await pushToBysyList(secondCourse.people);

        // Получаем третий курс
        const thirdCourse = getBusyList('./test/3курс/busyList.json', true);
        await pushToBysyList(thirdCourse.people);

        // Получаем четвёртый курс
        const fourthCourse = getBusyList('./test/4курс/busyList.json', true);
        await pushToBysyList(fourthCourse.people);

        // Получаем пятый курс
        const fifthCourse = getBusyList('./test/5курс/busyList.json', true);
        await pushToBysyList(fifthCourse.people);

        busyList = busyList.map((element, index) => {
            element.number = index + 1;
            return element;
        })

        // Отправляем JSON-ответ
        return res.status(200).json({
            byColumns: 
                [{...firstCourseBusy.people},
                {...secondCourse.people},
                {...thirdCourse.people},
                {...fourthCourse.people},
                {...fifthCourse.people}],
            list: busyList
        });
    }
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
app.post('/sick', (req, res) => {
    // Доступ к данным формы
    const formData = req.body;
    // Записываем обновленные данные обратно в файл
    fs.writeFileSync(filePathSick, JSON.stringify(formData.rows, null, 2)); // Форматируем JSON с отступами
        
    console.log('Файл успешно обновлен.');
    // Отправляем JSON-ответ
    return res.status(200).json();
})

app.get('/checkLogin', (req, res) => {
    res.json({ message: "Hello from the server!" });
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
