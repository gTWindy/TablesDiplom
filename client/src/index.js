import React from 'react';
import { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { useEffect } from 'react';

import './index.css';
import Login from './Login';
import reportWebVitals from './reportWebVitals';
import DataTable from './Table/Table';

const root = ReactDOM.createRoot(document.getElementById('root'));

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Статус аутентификации по умолчанию
  const stateFromServer = '';
    // useEffect для проверки статуса аутентификации
    useEffect(() => {
        // Этот код выполняется **после** первого рендера, чтобы проверить статус аутентификации
        const authStatus = localStorage.getItem('isAuthenticated');
        if (authStatus === 'true') {
          setIsAuthenticated(true); // Изменяем состояние, что вызовет повторный рендер компонента
        }
        // Функция очистки отсутствует, так как не требуется
    }, []); // Пустой массив зависимостей означает, что этот эффект выполнится только один раз при монтировании компонента

    const handleAuthentication = (state) => {
        setIsAuthenticated(true); // Устанавливаем аутентификацию в true
        // Сохраняем в локальном хранилище
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('state', state);
        stateFromServer = state;
    };
    return (
      <div>
        {isAuthenticated ? <DataTable /> : <Login onAuthenticate={handleAuthentication} />}
        <span>{stateFromServer}</span>
      </div>
  );
};

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
