import { useTable } from 'react-table';
import { useState, useMemo } from 'react';

import ChooseManEdit from '../components/ChooseMan/ChooseManEdit';
import {TableEditorModel} from './TableEditorModel'
import './Table.css';
import { useEffect } from 'react';

import {columns } from '../Table/TableEditorModel';

const EditTable2 = () => {
    // Создаем состояние для хранения экземпляра модели
    const [tableModel, setTableModel] = useState(null);
    const [chooseManOpen, setChooseManOpen] = useState(false);
    // Для хранения текущей ячейки
    const [clickedCell, setClickedCell] = useState({ row: null, column: null });
    
    // Создаем экземпляр модели только один раз при монтировании компонента
    useEffect(() => {
        const createAndLoadModel = async () => {
            const model = new TableEditorModel([5111, 5112, 5113, 5114, 5115]);
            await model.loadData();
            setTableModel(model);
        };

        createAndLoadModel();
    }, []);

    const onCloseModal = (idesMan) => {
        console.log(idesMan);
        tableModel.setBusyManList(clickedCell.row, clickedCell.column, idesMan);
        updateCellValue(clickedCell.row, clickedCell.column, idesMan.length);
    }

    const updateCellValue = (rowIndex, columnId, newValue) => {
        // Логика обработки клика и получения нового значения
        console.log(`Clicked on cell at row ${rowIndex}, column ${columnId}`);
        // Копируем данные
        const updatedData = [...tableModel.data];
        // Обновление данных
        updatedData[rowIndex]['have'] = updatedData[rowIndex][columnId] ? updatedData[rowIndex]['have'] - newValue + updatedData[rowIndex][columnId] : updatedData[rowIndex]['have'] - newValue ;
        updatedData[rowIndex][columnId] = newValue;
        
        tableModel.data = updatedData;
        // Сохраняем обновленные данные
        setTableModel(tableModel);
    };
    
    // Идентификаторы редактируемых столбцов
    const editableColumnIds = ['service', 'trip', 'vacation', 'dismissal', 'other'];

    const memoizedColumns = useMemo(
        () =>
        columns.map(column => ({
            ...column,
            Cell: ({ value, row, column: { id } }) => {
                // Если столбец для редактирования
                if (editableColumnIds.includes(id)) {
                    return (
                    <div className='cell-input'
                        style={{ cursor: 'pointer' }}
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
                } else if (id === 'number')
                    return row.index + 1; // Добавляем порядковый номер строки
                else
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
        data: tableModel ? tableModel.data : [],
    });

    return (
    <>
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
        {chooseManOpen &&
            <ChooseManEdit
            x={700}
            y={500}
            isOpen={chooseManOpen}
            items={tableModel ? tableModel.getManListForChoose(clickedCell.row, clickedCell.column) : []}    
            selectedItems = {tableModel ? tableModel.getBusyManList(clickedCell.row, clickedCell.column) : [] }
            handleCloseModal={(ides) => {
                setChooseManOpen(false);
                onCloseModal(ides);
            }}
            />
        }
    </>
  );
}

export default EditTable2;