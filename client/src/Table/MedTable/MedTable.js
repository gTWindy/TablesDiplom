import React, {
    useState,
    useEffect
} from 'react';
import ContextMenu from './ContextMenu';
import ChooseMan from '../../components/ChooseMan/ChooseMan';
import ComboBox from '../../components/ComboBox';
import '../Table.css';
import './MedTable.css';
import { dateOptions } from '../../App';
import { sendToServer, getFromServer } from '../../Net';

const courseTranslate = [
    "Первый курс",
    "Второй курс",
    "Третий курс",
    "Четвёртый курс",
    "Пятый курс"
]

const MedTable = () => {
    // Строки таблицы
    const [rows, setRows] = useState([{}]);
    // Позиция для кастомного меню
    const [menuPosition, setMenuPosition] = useState({ x: null, y: null });
    // Индекс строки, по которой кликнули правой кнопкой
    const [selectedRowIndex, setSelectedRowIndex] = useState(-1);
    // Признак наличия несохраненных изменений
    const [needSave, setNeedSave] = useState(false);

    const [isShowMenu, setShowMenu] = useState(false);
    const [isShowModal, setShowModal] = useState(false);

    // Загружаем список для выбора нового больного
    const [loadedItems, setItems] = useState([]);

    useEffect(() => {

        const fetchData = async () => {
            // Загружаем список больных
            const resultSick = await getFromServer("http://localhost:5000/sick");
            // Загружаем список всех курсантов, для возможности выбора нового больного
            const result = getFromServer("http://localhost:5000/manList");
            if (!resultSick || !result) {
                return;
            }
            // Установка полученных данных в состояние
            setRows(resultSick);
            
            const newData = Object.keys(result).map(course => ({
                title: courseTranslate[course],
                key: course,
                selectable: false,
                children: Object.keys(result[course]).map(group => ({
                    title: group,
                    key: group,
                    selectable: false,
                    children: result[course][group].map(man => ({
                        title: man['ФИО'] + ' ' + man['Личный номер'],
                        key: man['Личный номер'],
                        course,
                        group,
                        value: { ...man },
                    }))
                }))
            }));
            setItems(newData);
        }
        fetchData();
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
        setShowMenu(true);
    }

    // Если пользователь что-то изменил в ячейке
    const handleChange = (rowId, propertyName, newValue) => {
        const updatedRows = rows.map((row, rIndex) => {
            if (rIndex !== rowId)
                return row; // Если строка не та, которую мы ищем, возвращаем её без изменений
            if (row[propertyName] === newValue)
                return row;
            row[propertyName] = newValue;
            return row;
        });
        setNeedSave(true);
        setRows(updatedRows);
    };

    // Обработка вставки новой строки
    function handleInsert() {
        if (selectedRowIndex === null)
            return;
        setShowModal(true);
    }

    function handleDelete() {
        if (selectedRowIndex !== -1) {
            const newData = [...rows];
            newData.splice(selectedRowIndex, 1);
            setRows(newData);
        }
    }

    // Обработка вставки нового больного и закрытия модального окна
    const closeModal = (newManNode) => {
        setShowModal(false); // Закрываем модальное окно
        if (!newManNode)
            return;
        const newRows = [...rows];

        newRows.splice(newRows.length, 0, {});
        newRows[newRows.length - 1].rank = newManNode.value['Воинское звание'];
        newRows[newRows.length - 1].name = newManNode.value['ФИО'];
        newRows[newRows.length - 1].group = newManNode.group;
        newRows[newRows.length - 1].medInstitution = "";
        newRows[newRows.length - 1].diagnosis = "";
        // Берём текущую дату
        const formattedDate = new Date().toLocaleDateString('ru-RU', dateOptions);
        newRows[newRows.length - 1].date = formattedDate;
        newRows[newRows.length - 1]["k/l"] = "";
        newRows[newRows.length - 1]['Личный номер'] = newManNode.value['Личный номер'];
        setRows(newRows);
    };

    // Нажатие кнопки сохранить
    const onButtonSaveClicked = async () => {
        setNeedSave(false);
        sendToServer("http://localhost:5000/sick", { rows });
    };

    return (
        <>
            <button className="svg-container">
                <img src="./printer.svg"/>
            </button>
            <div className='table_header'>
                <h3>Справка-доклад по заболеваемости военнослужащих академии по сосмоянию на
                    {" 01.01.2001"}
                </h3>
            </div>
            <div
                className="med_table-container"
                onContextMenu={(e) => handleTableContextMenu(e)}
                onClick={(e) => handleTableClick(e)}
            >
                <table className="styled-table">
                    <thead>
                        <tr>
                            <th>№ п/п</th>
                            <th>Воинское звание</th>
                            <th>ФИО</th>
                            <th>Состав подразделения</th>
                            <th>Название лечебного учреждения</th>
                            <th>Диагноз</th>
                            <th>Дата госпитализации</th>
                            <th>К/д</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, rowIndex) => (
                            <tr key={rowIndex}
                                onContextMenu={(e) => handleContextMenu(e, rowIndex)}
                                onClick={(e) => setSelectedRowIndex(rowIndex)}
                                className={selectedRowIndex === rowIndex ? 'row-selected' : ''}
                            >
                                <td>{rowIndex + 1}</td>
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
                                        value={row.diagnosis || ""}
                                        onChange={(e) => handleChange(rowIndex, "diagnosis", e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input className='cell-input'
                                        type="text"
                                        value={row.date || ""}
                                        onChange={(e) => handleChange(rowIndex, "date", e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input className='cell-input'
                                        type="text"
                                        value={row["k/l"] || ""}
                                        onChange={(e) => handleChange(rowIndex, "k/l", e.target.value)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className='undertable_block'>
                    <button
                        className='med_table-button'
                        onClick={async () => {
                            await onButtonSaveClicked();
                        }}
                        disabled={!needSave}
                    >
                        Сохранить
                    </button>
                </div>
                {isShowMenu &&
                    <ContextMenu
                        x={menuPosition.x}
                        y={menuPosition.y}
                        handleDelete={handleDelete}
                        handleInsert={handleInsert}
                    />}
                {isShowModal &&
                    <ChooseMan
                        items={loadedItems}
                        handleCloseModal={closeModal}
                    />}
            </div>
        </>
    );
};

export default MedTable;