const express = require('express');
const router = express.Router();

const {busyRepo} = require('../repositories/busyRepo');
const {saveRepo} = require('../repositories/saveRepo');
const {cadetRepo} = require('../repositories/cadetRepo');

router.post('/busyList', async (req, res) => {
    // Доступ к данным формы
    const formData = req.body;

    // Номер курса
    let numberOfCourse = formData.numberOfCourse;
    if (numberOfCourse) {
        // Очищаем старые записи сохранения для этого курса
        await busyRepo.deleteByCourse(numberOfCourse);
    } else {
        numberOfCourse = 0;
        await busyRepo.deleteAll();
    }

    // Вставляем занятых в бд
    for (const group of formData.people) {
        for (let columnName in group) {
            group[columnName].forEach(async (busyManId) => await busyRepo.insertOrUpdate(busyManId, columnName));
        }
    }
    
    // Обновляем запись о сохранении в бд
    await saveRepo.insert(numberOfCourse, formData.dateAndTime, formData.savedName, formData.savedRank);
    
    return res.status(200);
})

router.get('/busyList', async (req, res) => {
    const response = {};
    let course = req.query.course;
    if (course) {    
        const groups = await cadetRepo.selectGroupNameByCourse(course);
        for (let i = 0; i< groups.length; ++i) {
            response[groups[i].group] = await busyRepo.selectByGroup(groups[i].group);
        }
    } else {
        // 0 курс - это факультет
        course = 0;
        response.people = [];
        for (let i = 1; i <= 5; ++i) {
            response.people.push([...await busyRepo.selectByCourse(i)]);
        }
    }
    const saveRow = await saveRepo.selectByCourse(Number(course));
    if (saveRow) {
        response.rank = saveRow.rank;
        response.name = saveRow.name;
        response.date = saveRow.dateAndTime;
    }
    // Отправляем JSON-ответ
    return res.status(200).json({...response});
})

module.exports = router;
