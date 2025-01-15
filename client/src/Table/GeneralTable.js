import { useTable } from 'react-table';
import { useState, useMemo } from 'react';

import ChooseManEdit from '../components/ChooseMan/ChooseManEdit';
import {TableEditorModel} from './TableEditorModel'
import './Table.css';
import { useEffect } from 'react';

const columns = [
    {
      Header: 'Курс',
      accessor: 'course',// accessor is the "key" in the data
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
];



const GeneralTable = () => {

  const [data, setData] = useState([]);

  useEffect(() => {
      const createAndLoadModel = async () => {
        try {
          const response = await fetch(`http://localhost:5000/busyList`);
          if (!response.ok)
            throw new Error(`Network response was not ok: ${response.status}`);
          const loadedData = await response.json();
          let newData = [];
          for (let i = 0; i < loadedData.length; ++i) {
            newData.push({
              course: i+1,
              list: 100,
              have: 100 - (loadedData[i].service.length + loadedData[i].lazaret.length + loadedData[i].hospital.length + 
                loadedData[i].trip.length + loadedData[i].vacation.length + loadedData[i].dismissal.length + loadedData[i].other.length),
              service: loadedData[i].service.length,
              lazaret: loadedData[i].lazaret.length,
              hospital: loadedData[i].hospital.length,
              trip: loadedData[i].trip.length,
              vacation: loadedData[i].vacation.length,
              dismissal: loadedData[i].dismissal.length,
              other: loadedData[i].other.length
            })
          }
          setData(newData);
        } catch (error) {
          console.error('There has been a problem with your fetch operation:', error);
        };
      };

      createAndLoadModel();
    }, [])

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({
        columns: columns,
        data: data,
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
            <button
                onClick={() => console.log('gettb-sav-btn-clck')}
            >
                Утвердить
            </button>
        </>
    );
}

export default GeneralTable;