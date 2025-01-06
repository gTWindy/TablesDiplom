import React, { 
    useState, 
    useEffect,
    useRef
} from 'react';
import ContextMenu from './ContextMenu';
import ChooseMan from '../../components/ChooseMan/ChooseMan';
import ComboBox from '../../components/ComboBox';
import '../Table.css';
import './MedTable.css';

// Количество столбцов в таблице.
const columnCount = 8;

const MedTable = () => {   
    // Ссылка на кнопку "Сохранить"
    const buttonRef = useRef(null);
    
    // Строки таблицы
    const [rows, setRows] = useState([{}]);
    
    // Сохраняем индекс строки, по которой кликнули правой кнопкой
    const [selectedRowIndex, setSelectedRowIndex] = useState(-1);
    const [menuPosition, setMenuPosition] = useState({ x: null, y: null });

    const [isShowMenu, setShowMenu] = useState(false);
    const [isShowModal, setShowModal] = useState(false);

    // Загружаем список для выбора нового больного
    const [loadedItems, setItems] = useState([]);

    useEffect(() => {
        // Функция для получения данных с сервера
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5000/sick');
                if (!response.ok)
                    throw new Error('Network response was not ok');
                const result = await response.json();
                
                console.log(result);
                // Установка полученных данных в состояние
                setRows(result.parsedData);
            } catch (error) {
                //setError(error.message); // Установка сообщения об ошибке
            }
        };
        fetchData(); // Вызов функции получения данных
    }, []);

    // Обработка вызова кастомного меню
    function handleTableContextMenu(event) {
        event.preventDefault();
        setMenuPosition({ x: event.clientX, y: event.clientY });
        setShowMenu(true);
        setShowModal(false);
    }

    function handleTableClick(event) {
        event.preventDefault();
        // При клике вне меню или модального окна - закрываем их
        setShowMenu(false);
    }

    function handleContextMenu(event, rowIndex) {
        // Отменяем стандартное поведение браузера (контекстное меню)
        event.preventDefault();
        // Запоминаем индекс строки
        setSelectedRowIndex(rowIndex);
        setMenuPosition({x: event.clientX, y: event.clientY });
        setShowMenu(true);
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

    // Обработка вставки новой строки
    function handleInsert() {
        if (selectedRowIndex === null)
            return;
        fetch('http://localhost:5000/manList') // Указываем URL ресурса
        .then(response => {
            if (!response.ok)
                throw new Error(`Network response was not ok: ${response.status}`);
            return response.json(); // Преобразуем ответ в JSON
        })
        .then(data => {
            console.log(data); // Выводим полученные данные в консоль
            setItems(data.mergedData);
            setShowModal(true);
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
    }

    function handleDelete() {
        if (selectedRowIndex !== -1) {
            const newData = [...rows];
            newData.splice(selectedRowIndex, 1);
            setRows(newData);
        }
    }

    const closeModal = (newMan) => {
        setShowModal(false); // Закрываем модальное окно
        if(!newMan)
            return;
        const newData = [...rows];
        newData.splice(newData.length, 0, {});
        newData[newData.length - 1].rank = newMan.rank;
        newData[newData.length - 1].name = newMan.name;
        newData[newData.length - 1].group = newMan.group;
        newData[newData.length - 1].nameMedInstitution = "";
        newData[newData.length - 1].diagnosis = "";
        newData[newData.length - 1].date = "";
        newData[newData.length - 1]["k/l"] = "";
        setRows(newData);
    };

    const onButtonSaveClicked = async (e) => {
        console.log("bttn click");
        try {
            const response = await fetch('http://localhost:5000/sick', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              // Отправляем список больных
              body: JSON.stringify({ rows }),
            });
      
            if (!response.ok) {
              throw new Error('Ошибка при отправке данных о больных.');
            }
          } catch (error) {
            console.error('Ошибка:', error);
          } 
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
                                <tr key={rowIndex}
                                onContextMenu={(e) => handleContextMenu(e, rowIndex)}
                                onClick={(e) => setSelectedRowIndex(rowIndex)}
                                className={selectedRowIndex === rowIndex ? 'row-selected' : ''}
                                >
                                    <td>{rowIndex}</td>
                                    <td>{row.rank}</td>
                                    <td>{row.name}</td>
                                    <td>{row.group}</td>
                                    <td>
                                        <ComboBox 
                                        selectedItem={row.medInstitution}
                                        onChange={(newValue) => 
                                            handleChange(rowIndex, "medInstitution", newValue?.value)}
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
            <button 
                className='med_table-button'
                ref={buttonRef}
                onClick={() => onButtonSaveClicked()}
            >
                Сохранить
            </button>
            {isShowMenu &&
                <ContextMenu
                x={menuPosition.x}
                y={menuPosition.y}
                handleDelete={handleDelete}
                handleInsert={handleInsert}
            />}
            {isShowModal && 
            <ChooseMan
                x={menuPosition.x}
                y={menuPosition.y}
                items={loadedItems}    
                handleCloseModal={closeModal}
            />}
      </div>
    );
};

export default MedTable;