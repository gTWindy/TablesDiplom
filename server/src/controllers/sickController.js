const express = require('express');
const router = express.Router();
const fs = require('fs');

// Путь к файлу с больными
const filePathSick = '../test/больные/sick.json';

// Получаем список больных
router.get('/sick', (req, res) => {
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
router.post('/sick', async (req, res) => {
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

module.exports = router;