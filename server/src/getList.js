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

module.exports.getBusyList = function (filePath) {
    // Читаем файл
    const data = fs.readFileSync(filePath, 'utf8');
    let parsedData = null;
    try {
        parsedData = JSON.parse(data); // Парсим JSON в объект
    }
    catch (error) {
        console.log(error);
        return {};
    }
    return parsedData.reduce((accumulator, currentValue, index, array) => {
        for (const key in currentValue.columns)
            accumulator[key].push(...currentValue.columns[key]);
        return accumulator;
    }, {
        service: [],
        lazaret: [],
        hospital: [],
        trip: [],
        vacation: [],
        dismissal: [],
        other: []
    });
}