import { useTable } from 'react-table';
import { useState, useMemo } from 'react';

import ChooseManEdit from '../components/ChooseMan/ChooseManEdit';

import './Table.css';
import { useEffect } from 'react';

let data = [
{
    list: 10,
    groupNumber: 0
},
{
    list: 10,
    groupNumber: 0
},
{
    list: 10,
    groupNumber: 0
},
{
    list: 10,
    groupNumber: 0
},
{
    list: 10,
    groupNumber: 0
}
];

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
  },
];

//Список групп и людей в них
let manList = [];

const EditTable2 = ({numbersOfGroups}) => {
    const dataWithGroups = data.map((item, index)=>{
        item.groupNumber = numbersOfGroups[index];
        return item;
    })
    // Хранение данных в состоянии
    const [tableData, setTableData] = useState(dataWithGroups);
    const [chooseManOpen, setChooseManOpen] = useState(false);

    useEffect(() => {
        fetch('http://localhost:5000/5kurs') // Указываем URL ресурса
        .then(response => {
            if (!response.ok)
                throw new Error(`Network response was not ok: ${response.status}`);
            return response.json(); // Преобразуем ответ в JSON
        })
        .then(data => {
            console.log(data); // Выводим полученные данные в консоль
            manList = data.mergedJSON;
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
    },[])

    const updateCellValue = async (rowIndex, columnId, newValue) => {
        // Логика обработки клика и получения нового значения
        console.log(`Clicked on cell at row ${rowIndex}, column ${columnId}`);
        
        // Здесь вы можете выполнять асинхронную операцию, например, запрос к серверу
        await new Promise(resolve => setTimeout(resolve, 1000)); // Имитация задержки
        
        // Обновление данных
        const updatedData = [...tableData]; // Копируем данные
        //updatedData[rowIndex][columnId] = newValue; // Обновляем конкретную ячейку
        setTableData(updatedData); // Сохраняем обновленные данные
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
                            console.log('asdas');
                            setChooseManOpen(true);
                            updateCellValue();
                            console.log(chooseManOpen);
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
        data: tableData,
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
        <ChooseManEdit
            x={700}
            y={500}
            isOpen={chooseManOpen}
            items={manList['5111'] || []}    
            handleCloseModal={() => {setChooseManOpen(false)}}
        />
    </>
  );
}

export default EditTable2;