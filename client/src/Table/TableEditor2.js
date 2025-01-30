import { useTable } from 'react-table';
import { useState, useMemo, useRef } from 'react';

import ChooseManEdit from '../components/ChooseMan/ChooseManEdit';
import {TableEditorModel} from './TableEditorModel'
import './Table.css';
import { useEffect } from 'react';

import { columns } from '../Table/TableEditorModel';
import PeopleList from '../components/PeopleList';
import { observer } from "mobx-react-lite";

const EditTable2 = observer(({groups}) => {
    // Создаем состояние для хранения экземпляра модели
    const [tableModel, setTableModel] = useState(null);
    const [chooseManOpen, setChooseManOpen] = useState(false);
    // Для хранения текущей ячейки
    const [clickedCell, setClickedCell] = useState({ row: null, column: null });
    // Ввод имени
    const nameInput = useRef(null);
    // Ввод звания
    const rankInput = useRef(null);
    // Признак наличия несохраненных изменений
    const [needSave, setNeedSave] = useState(false);


    // Создаем экземпляр модели только один раз при монтировании компонента
    useEffect(() => {
        const createAndLoadModel = async () => {
            const model = new TableEditorModel(groups);
            await model.loadData();
            setTableModel(model);
        };

        createAndLoadModel();
    }, []);

    // Обрабатываем закрытия модального окна
    const onCloseModal = (idesMan) => {
        console.log(idesMan);
        tableModel.setBusyManListAction(clickedCell.row, clickedCell.column, idesMan);
        setNeedSave(true);
    }
    
    // Нажатие кнопки сохранить
    const onButtonSaveClicked = async () => {
        tableModel?.setSavedName(nameInput.current.value);
        tableModel?.setSavedRank(rankInput.current.value);
        setNeedSave(false);
        await tableModel.sendBusyListToServer();
    };   

    // Идентификаторы редактируемых столбцов
    const editableColumnIds = ['service', 'trip', 'vacation', 'dismissal', 'other'];

    const memoizedColumns = useMemo(
        () =>
        columns.map(column => ({
            ...column,
            Cell: ({ value, row, column: { id } }) => {
                // Добавляем порядковый номер строки, если это первый столбец
                if (id === 'number')
                    return row.index + 1;
                // Если последняя строка т.е. строка "Всего"
                if (row.index === 5) {
                    return <span>{value}</span>;
                }
                // Если столбец для редактирования
                if (editableColumnIds.includes(id)) {
                    return (
                    <div className='cell-input'
                        onClick={() => {
                            const newClickedCell = {
                                row: row.index,
                                column: id
                            };
                            setClickedCell(newClickedCell);
                            setChooseManOpen(true);
                        }}
                    >
                        {value}
                    </div>
                        );
                } else
                    return <span>{value}</span>; // Для остальных столбцов выводим обычное значение
                },
            })),
            []
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({
        columns: memoizedColumns,
        data: tableModel ? [...tableModel.data] : [],
    });

    return (
    <>
        <div className='table_header'>
            <h4>РАЗВЕРНУТАЯ СТРОЕВАЯ ЗАПИСКА<br/>{tableModel?.numberOfCourse ?? ''} курса на {tableModel?.savedDate ?? ''}</h4>
        </div>
        <table {...getTableProps()}  className="styled-table">
        <thead>
            {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                ))}
            </tr>
            ))}
        </thead>
        <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
            prepareRow(row);
            return (
                <tr {...row.getRowProps()}>
                        {row.cells.map((cell) => (
                            <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                        ))}
                    </tr>
                );
            })}
                </tbody>
            </table>
            <div className='undertable_block'>
                <span>
                    Дежурный за {tableModel?.numberOfCourse ?? ''} курс
                </span>
                
                <input
                ref={rankInput}
                defaultValue={tableModel?.getSavedRank() || null}
                placeholder='Звание'
                ></input>
                <input
                ref = {nameInput}
                defaultValue={tableModel?.getSavedName() || null}
                placeholder='ФИО'
                ></input>

                <button
                    onClick={() => onButtonSaveClicked()}
                    disabled={!needSave}
                >
                    Утвердить
                </button>
            </div>
            <PeopleList props={{
                    columns: [
                        {
                            Header: '№ п/п',
                            accessor: 'number',// порядковый номер
                        },
                        {
                            Header: 'Подразделение',
                            accessor: 'group',
                        },
                        {
                            Header: 'Звание',
                            accessor: 'rank',
                        },
                        {
                            Header: 'ФИО',
                            accessor: 'name',
                        },
                        {
                            Header: 'Причина отсутствия',
                            accessor: 'reason',
                        },
                        {
                            Header: 'Примечание',
                            accessor: 'remark',
                        },
                        {
                            Header: 'Телефон',
                            accessor: 'phone',
                        },

                    ],
                    peopleList: tableModel?.getBusyManListForTable() || []
            }}>
            </PeopleList>
            {chooseManOpen &&
                <ChooseManEdit
                    x={700}
                    y={500}
                    isOpen={chooseManOpen}
                    items={tableModel ? tableModel.getManListForChoose(clickedCell.row, clickedCell.column) : []}
                    selectedItems={tableModel ? tableModel.getBusyManList(clickedCell.row, clickedCell.column) : []}
                    handleCloseModal={(ides) => {
                        setChooseManOpen(false);
                        onCloseModal(ides);
                    }}
                />
            }
    </>
  );
});

export default EditTable2;