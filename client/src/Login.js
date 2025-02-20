import React, { useState } from "react";
import "./Login.css";
import { sendToServer } from "./Net";

const LoginForm = ({ onAuthenticate }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    console.log('Логин:', username);
    console.log('Пароль:', password);

    const response = await sendToServer("http://localhost:5000/checkLogin", { username, password });
    if (response) { 
      console.log('Успешный вход:', response);
      setError("");
      console.log(response.state);
      onAuthenticate(response.state);
    } else {
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
