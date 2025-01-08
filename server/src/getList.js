const fs = require('fs');

// Получаем объект, содержащий список пятого курса
module.exports.getCourseList = function(filesDir) {
    const path = require('path');

    // Получаем массив имен файлов в указанной директории
    const files = fs.readdirSync(filesDir).filter(file => path.extname(file) === '.json');

    let mergedData = {};

    for (const file of files) {
        const filePath = path.join(filesDir, file);
        // Читаем файл
        const data = fs.readFileSync(filePath, 'utf8');
        try {
            // Парсим JSON в объект
            const parsedData = JSON.parse(data);
            // Объединяем объекты
            Object.assign(mergedData, parsedData);
        } catch (error) {
            console.error(`Ошибка при парсинге файла ${file}:`, error.message);
        }
    }

    return mergedData;
}