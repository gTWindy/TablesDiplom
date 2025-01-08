const express = require('express');
const cors = require('cors');
const fs = require('fs');
const deepMerge = require('deepmerge-json');

const {getCourseList} = require('./getList')

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

// Посылаем список пятого курса
app.get('/5kurs', async (req, res) => {
    // Получаем пятый курс
    const result = getCourseList('./test/5курс');

    // Отправляем JSON-ответ
    return res.status(200).json({
        result
    });
});

// Посылаем список четвертого курса
app.get('/4kurs', async (req, res) => {
    // Получаем пятый курс
    const result = getCourseList('./test/4курс');

    // Отправляем JSON-ответ
    return res.status(200).json({
        result
    });
});

// Посылаем список третьего курса
app.get('/3kurs', async (req, res) => {
    // Получаем пятый курс
    const result = getCourseList('./test/3курс');

    // Отправляем JSON-ответ
    return res.status(200).json({
        result
    });
});

// Посылаем список второго курса
app.get('/2kurs', async (req, res) => {
    // Получаем пятый курс
    const result = getCourseList('./test/2курс');

    // Отправляем JSON-ответ
    return res.status(200).json({
        result
    });
});

// Посылаем список первого курса
app.get('/1kurs', async (req, res) => {
    // Получаем пятый курс
    const result = getCourseList('./test/1курс');

    // Отправляем JSON-ответ
    return res.status(200).json({
        result
    });
});

// Посылаем список для всех курсов
app.get('/manList', (req, res) => {
    // Получаем первый курс
    const firstCourse = getCourseList('./test/1курс');

    // Получаем второй курс
    const secondCourse = getCourseList('./test/2курс');

    // Получаем третий курс
    const thirdCourse = getCourseList('./test/3курс');

    // Получаем четвёртый курс
    const fourthCourse = getCourseList('./test/4курс');

    // Получаем пятый курс
    const fifthCourse = getCourseList('./test/5курс');

    // Отправляем JSON-ответ
    return res.status(200).json({
        firstCourse,
        secondCourse,
        thirdCourse,
        fourthCourse,
        fifthCourse
    });

});

app.get('/sick', (req, res) => {
    const path = require('path');
    const data = fs.readFileSync(filePathSick, 'utf8'); // Читаем файл
    let parsedData = "";
    try {
        parsedData = JSON.parse(data); // Парсим JSON в объект
    } catch (error) {
        console.error(`Ошибка при парсинге файла ${file}:`, error.message);
    }
    
    // Отправляем JSON-ответ
    return res.status(200).json({
        parsedData,
    });
});

app.post('/sick', (req, res) => {
    // Доступ к данным формы
    const formData = req.body;
    console.log(formData);
    // Записываем обновленные данные обратно в файл
    fs.writeFileSync(filePathSick, JSON.stringify(formData.rows, null, 2)); // Форматируем JSON с отступами
        
    console.log('Файл успешно обновлен.');
})

app.get('/checkLogin', (req, res) => {
    res.json({ message: "Hello from the server!" });
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
