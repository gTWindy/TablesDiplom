import { useState, useMemo, useRef } from 'react';

import ChooseManEdit from '../components/ChooseMan/ChooseManEdit';
import { TableEditorModel } from './TableEditorModel'
import './Table.css';
import { useEffect } from 'react';
import PeopleList from '../components/PeopleList';
import { observer } from "mobx-react-lite";
import EditTable from '../components/EditTable';

const EditTable2 = observer(({ groups }) => {
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
        setChooseManOpen(false);
        setNeedSave(true);
    }

    // Нажатие кнопки сохранить
    const onButtonSaveClicked = async () => {
        tableModel?.setSavedName(nameInput.current.value);
        tableModel?.setSavedRank(rankInput.current.value);
        setNeedSave(false);
        await tableModel.sendBusyListToServer();
    };

    return (
        <>
            <div className='table_header'>
                <h4>РАЗВЕРНУТАЯ СТРОЕВАЯ ЗАПИСКА<br />{tableModel?.numberOfCourse ?? ''} курса на {tableModel?.savedDate ?? ''}</h4>
            </div>
            <EditTable 
                dataToView={tableModel?.data ?? []}
                onCellClick={(cell) => {
                    setClickedCell(cell);
                    setChooseManOpen(true)
                }}
            >
            </EditTable>
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
                    ref={nameInput}
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
                peopleList: tableModel?.getBusyManListForTable() || []
            }}>
            </PeopleList>
            {chooseManOpen &&
                <ChooseManEdit
                    isOpen={chooseManOpen}
                    items={tableModel ? tableModel.getManListForChoose(clickedCell.row, clickedCell.column) : []}
                    selectedItems={tableModel ? tableModel.getBusyManList(clickedCell.row, clickedCell.column) : []}
                    handleCloseModal={(ides) => onCloseModal(ides)}
                />
            }
        </>
    );
});

export default EditTable2;