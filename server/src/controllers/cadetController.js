const express = require('express');
const router = express.Router();

const {getCourseList} = require('../getList');

// Посылаем список для одного курса или для всех курсов
router.get('/manList', async (req, res) => {
    // Извлекаем параметр курс из запроса
    const course = req.query.course;
    if (course) {
        let groupList = null;
        switch(Number(course)) {
            case 1:
                groupList = getCourseList('../test/1курс/группы/');
                break;
            case 2:
                groupList = getCourseList('../test/2курс/группы/');
                break;
            case 3:
                groupList = getCourseList('../test/3курс/группы/');
                break;
            case 4:
                groupList = getCourseList('../test/4курс/группы/');
                break;
            case 5:
                groupList = getCourseList('../test/5курс/группы/');
                break;
            default:
                return res.status(404);
        }
        // Отправляем JSON-ответ
        return res.status(200).json({...groupList});
    }
    else {
        // Получаем первый курс
        const firstCourse = getCourseList('../test/1курс/группы/');

        // Получаем второй курс
        const secondCourse = getCourseList('../test/2курс/группы/');

        // Получаем третий курс
        const thirdCourse = getCourseList('../test/3курс/группы/');

        // Получаем четвёртый курс
        const fourthCourse = getCourseList('../test/4курс/группы/');

        // Получаем пятый курс
        const fifthCourse = getCourseList('../test/5курс/группы/');
        
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

module.exports = router;