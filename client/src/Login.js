import React, { useState } from 'react';
import './Login.css';

const LoginForm = ({ onAuthenticate }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setError] = useState('');

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
      setError('');
      console.log(data.state);
      onAuthenticate(data.state);

      // Здесь можно сохранить токен или выполнить переход на другую страницу
    } catch (error) {
      console.error('Ошибка:', error);
      setError('Ошибка, введите правильный логин и пароль');
    } 
  };

  return (
    <div className='login-container'>
      <h2>Войти</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Логин:</label>
          <input className="input-username"
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Пароль:</label>
          <input className="input-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-button-submit">
          Войти
        </button>
        <span style={{ color: 'red' }}>{errorText}</span>
      </form>
    </div>
  );
};

export default LoginForm;
