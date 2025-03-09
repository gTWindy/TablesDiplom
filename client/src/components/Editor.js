import { useState, useRef } from 'react';

import ChooseMan from '../components/ChooseMan/ChooseMan';
import '../Table/Table.css';
import PeopleList from '../components/PeopleList';
import { observer } from "mobx-react-lite";
import EditTable from '../components/EditTable';

const Editor = observer(({ tableModel, isGeneralTable }) => {
    const [chooseManOpen, setChooseManOpen] = useState(false);
    // Для хранения текущей ячейки
    const [clickedCell, setClickedCell] = useState({ row: null, column: null });
    // Ввод имени
    const nameInput = useRef(null);
    // Ввод звания
    const rankInput = useRef(null);
    // Признак наличия несохраненных изменений
    const [needSave, setNeedSave] = useState(false);

    // Обрабатываем закрытия модального окна
    const onCloseModal = (idesMan) => {
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
            <button className="svg-container">
                <img src="./printer.svg"/>
            </button>
            <div className='table_header'>
                <h4>РАЗВЕРНУТАЯ СТРОЕВАЯ ЗАПИСКА<br />
                {!isGeneralTable ?
                    `${tableModel?.numberOfCourse ?? ""} курса на ${tableModel?.savedDate ?? ''}`
                    :
                    `Факультета АСУ на ${tableModel?.savedDate ?? ''}`
                }
                </h4>
            </div>
            <EditTable 
                dataToView={tableModel?.getDataForView() ?? []}
                onCellClick={(cell) => {
                    setClickedCell(cell);
                    setChooseManOpen(true)
                }}
                isGeneralTable={isGeneralTable}
            >
            </EditTable>
            <div className='undertable_block'>
                <span>
                    {!isGeneralTable ?
                        `Дежурный за ${tableModel?.numberOfCourse ?? ''} курс`
                        :
                        "Дежурный по факультету"
                    }
                </span>

                <input
                    ref={rankInput}
                    defaultValue={tableModel?.getSavedRank() || null}
                    placeholder="Звание"
                    onChange={() => setNeedSave(true)}
                ></input>
                <input
                    ref={nameInput}
                    defaultValue={tableModel?.getSavedName() || null}
                    placeholder="ФИО"
                    onChange={() => setNeedSave(true)}
                ></input>

                <button
                    onClick={() => onButtonSaveClicked()}
                    disabled={!needSave}
                >
                    Утвердить
                </button>
            </div>
            <PeopleList props={{
                peopleList: tableModel?.getBusyManListForTable() || [],
                isGeneralTable
            }}>
            </PeopleList>
            {chooseManOpen &&
                <ChooseMan
                    isOpen={chooseManOpen}
                    items={tableModel ? tableModel.getManListForChoose(clickedCell.row, clickedCell.column) : []}
                    isCheckable={true}
                    checkedKeys={tableModel ? tableModel.getBusyManIdList(clickedCell.row, clickedCell.column) : []}
                    handleCloseModal={(ides) => onCloseModal(ides)}
                />
            }
        </>
    );
});

export default Editor;