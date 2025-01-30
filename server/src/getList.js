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

module.exports.getBusyList = function (filePath = '', isUnited = false) {
    // Читаем файл
    const data = fs.readFileSync(filePath, 'utf8');
    let parsedData = null;
    try {
        // Парсим JSON в объект
        parsedData = JSON.parse(data);
    }
    catch (error) {
        console.log(error);
        return {};
    }
    
    return {
        date: parsedData?.date ,
        // Объединяем данные для всех групп
        people: !isUnited ? parsedData.people : parsedData.people.reduce((accumulator, currentValue) => {
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
        })
    }
}