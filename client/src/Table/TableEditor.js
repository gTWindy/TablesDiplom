import React, { useState, useEffect } from 'react';

import './Table.css';

const EditTable = ({numberOfCourse}) => {
    // Инициализируем состояние для 8 строк и 10 столбцов
    const initialRows = Array.from({ length: 8 }, (_, rowIndex) => 
        Array.from({ length: 8 }, (_, colIndex) => ({
            id: `${rowIndex}-${colIndex}`,
            value: ''
        }))
    );

    const [rows, setRows] = useState(initialRows);
    //По списку
    const weHave = [10,10,10,10,10,10,10,10];

    const handleChange = (rowId, colId, newValue) => {
        if (newValue !== "") {
            const newNumber = Number(newValue);
            if (!newNumber)
                return;
            if (newNumber > weHave[rowId])
                return;
        }
        
        const updatedRows = rows.map((row, rIndex) => {
            // Если строка не та, которую мы ищем, возвращаем её без изменений
            if (rIndex !== rowId) 
                return row;
    
            return row.map((cell, cIndex) => {
                // Если колонка не та, которую мы ищем, возвращаем её без изменений
                if (cIndex !== colId) 
                    return cell;
    
                return { ...cell, value: newValue }; // Обновляем значение нужной ячейки
            });
        });
    
        setRows(updatedRows);
    };

    return (
        <table className="styled-table">
            <thead>
                <tr>
                    <th>N п/п</th>
                    <th>Подразделение</th>
                    <th>По списку</th>
                    <th>На лицо</th>
                    <th>Наряд</th>
                    <th>Лазарет</th>
                    <th>Госпиталь</th>
                    <th>Командировка</th>
                    <th>Отпуск</th>
                    <th>Увольнение</th>
                    <th>Прочее</th>
                </tr>
            </thead>
            <tbody>
                {rows.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                <td>{rowIndex+1}</td>
                                <td>111</td>
                                <td>{weHave[rowIndex]}</td>
                                {row.map((cell, colIndex) => (
                                    <td key={cell.id}>
                                        <input className='cell-input'
                                            type="text"
                                            value={cell.value}
                                            onChange={(e) => handleChange(rowIndex, colIndex, e.target.value)}
                                        />
                                    </td>
                                ))}
                            </tr>
                        ))}
            </tbody>
        </table>
    );

};

export default EditTable;