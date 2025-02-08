import { useState, useRef } from 'react';

import './Table.css';
import { useEffect } from 'react';
import PeopleList from '../components/PeopleList';
import EditTable from '../components/EditTable';
import { observer } from "mobx-react-lite";
import { GeneralTableModel } from './GeneralTableModel';
import ChooseMan from '../components/ChooseMan/ChooseMan';

const GeneralTable = observer(() => {
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

  useEffect(() => {
    const createAndLoadModel = async () => {
      const model = new GeneralTableModel();
      await model.loadData();
      setTableModel(model);
    };

    createAndLoadModel();
  }, [])

  // Обрабатываем закрытия модального окна
  const onCloseModal = (idesMan) => {
    tableModel.setCheckedMan(clickedCell.row, clickedCell.column, idesMan);
    setChooseManOpen(false);
    setNeedSave(true);
  }

  return (
    <>
      <div className='table_header'>
        <h4>РАЗВЕРНУТАЯ СТРОЕВАЯ ЗАПИСКА<br /> на </h4>
      </div>
      <EditTable
        dataToView={tableModel?.getDataForView() ?? []}
        onCellClick={(cell) => {
          setClickedCell(cell);
          setChooseManOpen(true)
        }}
        isGeneral={true}
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
        peopleList: tableModel?.getBusyListForView() ?? []
      }}>
      </PeopleList >
      {chooseManOpen &&
        <ChooseMan
          isOpen={chooseManOpen}
          items={tableModel?.groupsList[clickedCell.row] ?? []}
          selectedItems={[]}
          handleCloseModal={(ides) => onCloseModal(ides)}
          isCheckable={true}
          checkedKeys={tableModel?.getCheckedMan(clickedCell.row, clickedCell.column) ?? []}
        />
      }
    </>
  );
})

export default GeneralTable;