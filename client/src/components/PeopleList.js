import { useTable } from 'react-table';
import { useState, useMemo } from 'react';

import { useEffect } from 'react';

const columns = [
    {
        Header: '№ п/п',
        accessor: 'number',// accessor is the "key" in the data
    },
    {
        Header: 'Курс',
        accessor: 'course',
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
];

const PeopleList = ({ peopleList }) => {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({
        columns: columns,
        data: peopleList,
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
}

export default PeopleList;