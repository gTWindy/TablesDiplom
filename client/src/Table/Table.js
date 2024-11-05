import React, { useState, useEffect } from 'react';

import './Table.css';

const parseData = (data) => {

}

const GroupedTable = () => {
  const [data, setData] = useState([]); // Состояние для хранения данных
  const [loading, setLoading] = useState(true); // Состояние загрузки
  const [error, setError] = useState(null); // Состояние для ошибок

  useEffect(() => {
    // Функция для получения данных с сервера
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/5kurs'); // Замените на ваш URL
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        console.log(1);
        console.log(result);
        const preparedData = parseData(result);

        // Установка полученных данных в состояние
        setData(result.jsonData);

      } catch (error) {
        setError(error.message); // Установка сообщения об ошибке
      } finally {
        setLoading(false); // Завершение загрузки
      }
    };
    fetchData(); // Вызов функции получения данных
  }, []); // Пустой массив зависимостей означает, что useEffect сработает только один раз при монтировании компонента

  const [openGroups, setOpenGroups] = useState({}); // состояние для отслеживания открытых групп

  if (loading) return <div>Загрузка...</div>; // Показываем индикатор загрузки
  if (error) return <div>Ошибка: {error}</div>; // Показываем сообщение об ошибке

  const toggleGroup = (group) => {
    setOpenGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
  };

  return (
    <table className="styled-table">
      <thead>
        <tr>
          {data.headers.map((column, index) => (
            <React.Fragment key = {column}>
              <th>{column}</th>
            </React.Fragment>
          ))
          }
        </tr>
      </thead>
      <tbody>
        {data.groups.map((group, index) => (
          <React.Fragment key={group.groupName}>
            <tr onClick={() => toggleGroup(group.groupName)} style={{ cursor: 'pointer' }}>
              <td colSpan={data.headers.length}>{group.groupName} {openGroups[group.groupName] ? '-' : '+'}</td>
            </tr>
            {openGroups[group.groupName] && group.members.map(member => (
              <tr key={member["Порядковый номер"]}>
                <td>{member["Порядковый номер"]}</td>
                <td>{member["Воинское звание"]}</td>
                <td>{member["ФИО"]}</td>
                <td>{member["Дата рождения"]}</td>
                <td>{member["Номер телефона"]}</td>
                <td>{member["Личный номер"]}</td>
              </tr>
            ))}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );

};

export default GroupedTable;
