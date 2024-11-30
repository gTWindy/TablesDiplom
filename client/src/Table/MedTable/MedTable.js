import React, { useState, useEffect } from 'react';
import ContextMenu from './ContextMenu';
import '../Table.css';

// Количество столбцов в таблице.
const columnCount = 8;

const MedTable = () => {   
    const [rows, setRows] = useState([{}]);
    
    // Сохраняем индекс строки, по которой кликнули правой кнопкой
    const [selectedRowIndex, setSelectedRowIndex] = useState(null);
    const [menuPosition, setMenuPosition] = useState({ x: null, y: null });

    useEffect(() => {
        // Функция для получения данных с сервера
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5000/sick'); // Замените на ваш URL
                if (!response.ok)
                    throw new Error('Network response was not ok');
                const result = await response.json();
                
                console.log(result);
                // Установка полученных данных в состояние
                setRows(result.parsedData.sickPeople);
            } catch (error) {
                //setError(error.message); // Установка сообщения об ошибке
            }
        };
        fetchData(); // Вызов функции получения данных
    }, []);

    function handleTableContextMenu(event) {
        event.preventDefault();
        setSelectedRowIndex(-1); // -1 означает, что выбрана пустая область
        setMenuPosition({ x: event.clientX, y: event.clientY });
    }

    function handleTableClick(event) {
        event.preventDefault();
        setMenuPosition({ x: null, y: null });
    }

    function handleContextMenu(event, rowIndex) {
        event.preventDefault(); // Отменяем стандартное поведение браузера (контекстное меню)
        setSelectedRowIndex(rowIndex); // Запоминаем индекс строки
        setMenuPosition({x: event.clientX, y: event.clientY });
      }

    const handleChange = (rowId, propertyName, newValue) => {
        const updatedRows = rows.map((row, rIndex) => {
            if (rIndex !== rowId)
                return row; // Если строка не та, которую мы ищем, возвращаем её без изменений
            if (row[propertyName] === newValue)
                return row;
            row[propertyName] = newValue;
            return row;
        });
    
        setRows(updatedRows);
    };

    return (
        <div 
            className="table-container" 
            onContextMenu={(e) => handleTableContextMenu(e)}
            onClick={(e) => handleTableClick(e)}
        >
            <table className="styled-table">
                <thead>
                    <tr>
                        <th>N п/п</th>
                        <th>Воинское звание</th>
                        <th>ФИО</th>
                        <th>Состав подразделения</th>
                        <th>Название лечебного учреждения</th>
                        <th>Диагноз</th>
                        <th>Дата госпитализации</th>
                        <th>К/л</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, rowIndex) => (
                                <tr key={rowIndex} onContextMenu={(e) => handleContextMenu(e, rowIndex)}>
                                    <td>{rowIndex}</td>
                                    <td>{row.rank}</td>
                                    <td>{row.name}</td>
                                    <td>{row.group}</td>
                                    <td>
                                        <input className='cell-input'
                                                type="text"
                                                value={row.nameMedInstitution}
                                                onChange={(e) => handleChange(rowIndex, "nameMedInstitution", e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <input className='cell-input'
                                                type="text"
                                                value={row.diagnosis}
                                                onChange={(e) => handleChange(rowIndex, "diagnosis", e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <input className='cell-input'
                                                type="text"
                                                value={row.date}
                                                onChange={(e) => handleChange(rowIndex, "date", e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <input className='cell-input'
                                                type="text"
                                                value={row["k/l"]}
                                                onChange={(e) => handleChange(rowIndex, "k/l", e.target.value)}
                                        />
                                    </td>
                                </tr>
                    ))}     
                </tbody>
            </table>
            <ContextMenu
                x={menuPosition.x}
                y={menuPosition.y}
                selectedRowIndex={selectedRowIndex}
                data={rows}
                setData={setRows}
            />
      </div>
    );
};

export default MedTable;