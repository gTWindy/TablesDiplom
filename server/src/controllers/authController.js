const express = require('express');
const router = express.Router();

router.post('/checkLogin', (req, res) => {
    const { username, password } = req.body;
    
    // Лучше использовать объект для проверки
    const users = {
        "DejFak": "123",
        "1kurs": "123",
        "2kurs": "123",
        "3kurs": "123",
        "4kurs": "123",
        "5kurs": "123"
    };
    
    if (users[username] && users[username] === password) {
        return res.status(200).json({ 
            message: 'Успешный вход.', 
            state: username 
        });
    }
    
    return res.status(401).json({ message: 'Некорректный логин или пароль.' });
});

module.exports = router;