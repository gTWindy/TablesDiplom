import React, { useState, useEffect } from 'react';
import ContextMenu from './ContextMenu';
import '../Table.css';

const MedTable = () => {   
     // Инициализируем состояние для 8 строк и 10 столбцов
     const initialRows = Array.from({ length: 1 }, (_, rowIndex) => 
        Array.from({ length: 6 }, (_, colIndex) => ({
            id: `${rowIndex}-${colIndex}`,
            value: ''
        }))
    );
    const [rows, setRows] = useState(initialRows);
    
    // Сохраняем индекс строки, по которой кликнули правой кнопкой
    const [selectedRowIndex, setSelectedRowIndex] = useState(null);
    const [menuPosition, setMenuPosition] = useState({ x: null, y: null });

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

    const handleChange = (rowId, colId, newValue) => {
        const updatedRows = rows.map((row, rIndex) => {
            if (rIndex !== rowId) return row; // Если строка не та, которую мы ищем, возвращаем её без изменений
    
            return row.map((cell, cIndex) => {
                if (cIndex !== colId) return cell; // Если колонка не та, которую мы ищем, возвращаем её без изменений
    
                return { ...cell, value: newValue }; // Обновляем значение нужной ячейки
            });
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