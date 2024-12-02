const express = require('express');
const cors = require('cors');
const fs = require('fs');

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

app.get('/5kurs', (req, res) => {
    // Чтение JSON данных из файла
    fs.readFile('test/groups.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Ошибка чтения файла' });
        }

        // Преобразуем JSON-строку в объект
        const jsonData = JSON.parse(data);

        // Отправляем JSON-ответ
        return res.status(200).json({
            jsonData, // Включаем пользователей из файла
        });
    });
});

app.get('/manList', (req, res) => {
    const path = require('path');

    // Путь к папке с файлами
    const filesDir = './test/5курс';

    // Получаем массив имен файлов в указанной директории
    const files = fs.readdirSync(filesDir).filter(file => path.extname(file) === '.json');

    let mergedData = {};

    for (const file of files) {
        const filePath = path.join(filesDir, file);
        const data = fs.readFileSync(filePath, 'utf8'); // Читаем файл
        try {
            const parsedData = JSON.parse(data); // Парсим JSON в объект
            Object.assign(mergedData, parsedData); // Объединяем объекты
        } catch (error) {
            console.error(`Ошибка при парсинге файла ${file}:`, error.message);
        }
    }
    // Отправляем JSON-ответ
    return res.status(200).json({
        mergedData,
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
