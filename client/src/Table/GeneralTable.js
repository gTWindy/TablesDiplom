import { useTable } from 'react-table';
import { useState, useMemo } from 'react';

import ChooseManEdit from '../components/ChooseMan/ChooseManEdit';
import {TableEditorModel} from './TableEditorModel'
import './Table.css';
import { useEffect } from 'react';
import PeopleList from '../components/PeopleList';

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
  const [busyList, setBusyList] = useState([]);

  useEffect(() => {
      const createAndLoadModel = async () => {
        try {
          const response = await fetch(`http://localhost:5000/busyList`);
          if (!response.ok)
            throw new Error(`Network response was not ok: ${response.status}`);
          const loadedData = await response.json();
          const dataByColumns = loadedData.byColumns;
          let newData = [];
          for (let i = 0; i < dataByColumns.length; ++i) {
            newData.push({
              course: i+1,
              list: 100,
              have: 100 - (dataByColumns[i].service.length + dataByColumns[i].lazaret.length + dataByColumns[i].hospital.length + 
                dataByColumns[i].trip.length + dataByColumns[i].vacation.length + dataByColumns[i].dismissal.length + dataByColumns[i].other.length),
              service: dataByColumns[i].service.length,
              lazaret: dataByColumns[i].lazaret.length,
              hospital: dataByColumns[i].hospital.length,
              trip: dataByColumns[i].trip.length,
              vacation: dataByColumns[i].vacation.length,
              dismissal: dataByColumns[i].dismissal.length,
              other: dataByColumns[i].other.length
            })
          }
          setData(newData);
          setBusyList(loadedData.list);
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
            <div className='table_header'>
                <h4>РАЗВЕРНУТАЯ СТРОЕВАЯ ЗАПИСКА<br/> на </h4>
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
                Дежурный
              </span>
              <button
                onClick={() => console.log('grpd-table btn-sv clicked')}
              >
                Утвердить
              </button>
            </div>
            <PeopleList peopleList={busyList}>
            </PeopleList>
        </>
    );
}

export default GeneralTable;