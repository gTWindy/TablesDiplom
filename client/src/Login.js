import React, { useState } from 'react';
import './Login.css';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    console.log('Логин:', username);
    console.log('Пароль:', password);

    try {
      const response = await fetch('http://localhost:5000/checkLogin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Отправляем логин и пароль
        body: JSON.stringify({ username, password }),
      });


      if (!response.ok) {
        throw new Error('Ошибка при входе. Проверьте логин и пароль.');
      }

      const data = await response.json();
      console.log('Успешный вход:', data);

      // Здесь можно сохранить токен или выполнить переход на другую страницу
    } catch (error) {
      console.error('Ошибка:', error);
    } 
  };

  return (
    <div style={{ maxWidth: '300px', margin: 'auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
      <h2>Войти</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Логин:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', margin: '5px 0' }}
          />
        </div>
        <div>
          <label htmlFor="password">Пароль:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', margin: '5px 0' }}
          />
        </div>
        <button type="submit" className="login-button-submit">
          Войти
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
