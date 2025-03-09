import { useMemo } from 'react';
import { useTable } from 'react-table';

const columns = [
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
  ];

const PeopleList = ({ props }) => {
    
    const memoColumns = useMemo(() => {
        if (props.isGeneralTable) {
            columns[1].Header = "Курс";
            columns[1].accessor = "course";
        }
        return columns.map(column => ({
            ...column,
            Cell: ({ value, row, column: { id } }) => {
                // Для столбца "Примечание" даем возможность что-то писать
                if (id === "remark")
                    return <input/>
                else {
                    // Для остальных столбцов выводим обычное значение
                    return <span>{value}</span>;
                }
            }
        }))
    }, []);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({
        columns: memoColumns,
        data: props.peopleList,
    });

    return (
        <>
            <table {...getTableProps()} className="styled-table table_of_absent">
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
}

export default PeopleList;