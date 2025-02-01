import { useState, useMemo } from 'react';

import './Table.css';
import { useEffect } from 'react';
import PeopleList from '../components/PeopleList';
import EditTable from '../components/EditTable';

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
              list: 50,
              have: 50 - (dataByColumns[i].service.length + dataByColumns[i].lazaret.length + dataByColumns[i].hospital.length + 
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
    return (
        <>
            <div className='table_header'>
                <h4>РАЗВЕРНУТАЯ СТРОЕВАЯ ЗАПИСКА<br/> на </h4>
            </div>
            <EditTable
              dataToView={data}
              onCellClick={(cell) => {
                  //setClickedCell(cell);
                  //setChooseManOpen(true)
              }}
              isGeneral = {true}            
            >
            </EditTable>
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
        <PeopleList props={{
          isGeneral: true,
          peopleList: busyList
        }}>
        </PeopleList >
      </>
    );
}

export default GeneralTable;