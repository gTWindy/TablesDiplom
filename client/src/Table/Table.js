import React, { useState, useEffect } from 'react';

import './Table.css';

const headers = [
  'Порядковый номер',
  'Воинское звание',
  'ФИО',
  'Дата рождения',
  'Номер телефона',
  'Личный номер'
]

const GroupedTable = () => {
  const [data, setData] = useState([]); // Состояние для хранения данных
  const [loading, setLoading] = useState(true); // Состояние загрузки
  const [error, setError] = useState(null); // Состояние для ошибок

  useEffect(() => {
    // Функция для получения данных с сервера
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/manList');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        // Установка полученных данных в состояние
        setData(result);

      } catch (error) {
        setError(error.message); // Установка сообщения об ошибке
      } finally {
        setLoading(false); // Завершение загрузки
      }
    };
    fetchData(); // Вызов функции получения данных
  }, []); // Пустой массив зависимостей означает, что useEffect сработает только один раз при монтировании компонента

  // состояние для отслеживания открытых курсов
  const [openCourses, setOpenCourses] = useState({});
  // состояние для отслеживания открытых групп
  const [openGroups, setOpenGroups] = useState({});

  const toggleCourse = (course) => {
    setOpenCourses((prev) => ({
      ...prev,
      [course]: !prev[course],
    }));
  };

  const toggleGroup = (group) => {
    setOpenGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
  };

  if (loading) return <div>Загрузка...</div>; // Показываем индикатор загрузки
  if (error) return <div>Ошибка: {error}</div>; // Показываем сообщение об ошибке

  return (
    <table className="styled-table">
      <thead>
        <tr>
          {headers.map((column) => (
            <React.Fragment key = {column}>
              <th>{column}</th>
            </React.Fragment>
          ))
          }
        </tr>
      </thead>
      <tbody>
      {
        Object.keys(data).map((course, index) => (
          <React.Fragment key={course}>
            <tr onClick={() => toggleCourse(course)}>
              <td>{course} {openCourses[course] ? '-' : '+'}</td>
            </tr>
            {openCourses[course] && Object.keys(data[course]).map(group => (
              <React.Fragment key={group}>
                <tr onClick={() => toggleGroup(group)}>
                  <td>{group} {openGroups[group] ? '-' : '+'}</td>
                </tr>
                {openGroups[group] && data[course][group].map(member => (
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
          </React.Fragment>
        ))
      }
    </tbody>
    </table>
  );

};

export default GroupedTable;
