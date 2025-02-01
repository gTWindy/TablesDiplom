import { useTable } from 'react-table';
import { useState, useMemo } from 'react';
import '../Table/Table.css';
import { observer } from "mobx-react-lite";

const columns = [
  {
    Header: 'N п/п',
    accessor: 'number',// accessor is the "key" in the data
  },
  {
    Header: 'Подразделение',
    accessor: 'groupNumber',// accessor is the "key" in the data
  },
  {
    Header: 'По списку',
    accessor: 'list',
  },
  {
    Header: 'На лицо',
    accessor: 'have',
  },
  {
    Header: 'Наряд',
    accessor: 'service',
  },
  {
    Header: 'Лазарет',
    accessor: 'lazaret',
  },
  {
    Header: 'Госпиталь',
    accessor: 'hospital',
  },
  {
    Header: 'Командировка',
    accessor: 'trip',
  },
  {
    Header: 'Отпуск',
    accessor: 'vacation',
  },
  {
    Header: 'Увольнение',
    accessor: 'dismissal',
  },
  {
    Header: 'Прочее',
    accessor: 'other',
  }
]

const EditTable = observer(({ dataToView, onCellClick, isGeneral }) => {
    // Для хранения текущей ячейки
    const [clickedCell, setClickedCell] = useState({ row: null, column: null });

    // Идентификаторы редактируемых столбцов
    const editableColumnIds = ['service', 'trip', 'vacation', 'dismissal', 'other'];

    const memoizedColumns = useMemo(
        () => {
            if (isGeneral) {
                columns[1].Header = "Курс";
                columns[1].accessor = "course";
            }
            return columns.map(column => ({
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
                                    onCellClick(newClickedCell);
                                }}
                            >
                                {value}
                            </div>
                        );
                    } else {
                        // Для остальных столбцов выводим обычное значение
                        return <span>{value}</span>;
                    }
                },
            }))},
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
        data: [...dataToView],
    });

    return (
        <>
            <table {...getTableProps()} className="styled-table">
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


        </>
    );
});

export default EditTable;