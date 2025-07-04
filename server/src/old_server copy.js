const express = require('express');
const cors = require('cors');
const fs = require('fs');
const deepMerge = require('deepmerge-json');
// Модуль для работы с БД
const db = require('./db');
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

    const filePathBusy = `./test/${numberOfCourse}курс/busyList.json`;

    // Записываем обновленные данные в файл
    fs.writeFileSync(filePathBusy, JSON.stringify({
        date: formData.date,
        people: formData.people
    }, null, 2));
    return res.status(200);
})

app.get('/busyList', (req, res) => {
    // Извлекаем параметр курс из запроса
    const course = req.query.course;
    if (course) {
        let busyList = null;
        switch(Number(course)) {
            case 1:
                busyList = getBusyList('./test/1курс/busyList.json');
                break;
            case 2:
                busyList = getBusyList('./test/2курс/busyList.json');
                break;
            case 3:
                busyList = getBusyList('./test/3курс/busyList.json');
                break;
            case 4:
                busyList = getBusyList('./test/4курс/busyList.json');
                break;
            case 5:
                busyList = getBusyList('./test/5курс/busyList.json');
                break;
            default:
                return res.status(404);
        }
        // Отправляем JSON-ответ
        return res.status(200).json({...busyList});
    }
    else {
        // Получаем первый курс занятых
        const firstCourseBusy = getBusyList('./test/1курс/busyList.json', true);

        // Получаем второй курс
        const secondCourse = getBusyList('./test/2курс/busyList.json', true);

        // Получаем третий курс
        const thirdCourse = getBusyList('./test/3курс/busyList.json', true);

        // Получаем четвёртый курс
        const fourthCourse = getBusyList('./test/4курс/busyList.json', true);

        // Получаем пятый курс
        const fifthCourse = getBusyList('./test/5курс/busyList.json', true);
        
        // Отправляем JSON-ответ
        return res.status(200).json([
            {...firstCourseBusy.people},
            {...secondCourse.people},
            {...thirdCourse.people},
            {...fourthCourse.people},
            {...fifthCourse.people}
        ]);
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
