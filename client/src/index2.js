import React from 'react';
import { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { useEffect } from 'react';

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import './index.css';
import Login from './Login';
import reportWebVitals from './reportWebVitals';

import DataTable from './Table/Table';
import EditTable from './Table/TableEditor';
import MedTable from './Table/MedTable';


const root = ReactDOM.createRoot(document.getElementById('root'));

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Статус аутентификации по умолчанию
  const [currentComponent, setCurrentComponent] = useState(null); // Компонент, который будет отображаться

  // useEffect для проверки статуса аутентификации
  useEffect(() => {
    // Этот код выполняется **после** первого рендера, чтобы проверить статус аутентификации
    
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true); // Изменяем состояние, что вызовет повторный рендер компонента
      const state = localStorage.getItem('state');
      handleAuthentication(state);
    }
    // Функция очистки отсутствует, так как не требуется
  }, []); // Пустой массив зависимостей означает, что этот эффект выполнится только один раз при монтировании компонента

  const handleAuthentication = (state) => {
    setIsAuthenticated(true); // Устанавливаем аутентификацию в true
    // Сохраняем в локальном хранилище
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('state', state);
    
    switch(state) {
      case "DejFak":
        setCurrentComponent(<DataTable />);
        break;
      case "Lazaret":
        setCurrentComponent(<MedTable />);
        break;
      case "5kurs":
        setCurrentComponent(<EditTable />);
        break;
      default:
        break;
    }
  };

  return (
    <div>
      {isAuthenticated ?
        currentComponent :
        <Login onAuthenticate={handleAuthentication} />}
      <span></span>
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
