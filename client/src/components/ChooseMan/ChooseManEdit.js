import { useState, useRef, useEffect } from 'react';
import Modal from 'react-modal';
import './ChooseMan.css';
const ChooseManEdit = ({x, y, isOpen, items, selectedItems, handleCloseModal}) => {
    let [selectedItemIds, setSelectedItemsIds] = useState(selectedItems);
    let [modalIsOpen, setIsOpen] = useState(isOpen);   

    useEffect(() => {
        setIsOpen(isOpen);
    }, [isOpen, ]);

    const onItemClick = (e, index) => {
        if (!selectedItemIds.includes(items[index]["Порядковый номер"])) {
            e.currentTarget.style.backgroundColor = 'gray';
            const id = items[index]['Порядковый номер'];
            // Добавляем новый ID в массив
            selectedItemIds = [...selectedItemIds, id];
            // Обновляем состояние
            setSelectedItemsIds(selectedItemIds);
        }
        else {
            e.currentTarget.style.backgroundColor = 'white';
            setSelectedItemsIds(selectedItemIds.filter(item => item !== items[index]['Порядковый номер']));
        }
        
    }

    const closeModal = () => {
        handleCloseModal(selectedItemIds);
        // Очищаем
        setSelectedItemsIds([]);
    }
    const customStyles = {
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          width: '400px', // Ширина модального окна
          height: '300px', // Высота модального окна
        },
    };
    return (
        <Modal
        isOpen={modalIsOpen}
        //onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        //contentLabel="Example Modal"
      >
            <div
            className="modal" 
            >
                <div className="modal-content">
                    <h2>Список</h2>
                    <ul>
                        <li> 5112
                            <ul>
                                {items.map(
                                        (item, index) =>
                                            selectedItemIds.includes(item["Порядковый номер"]) ?
                                            <li>
                                                <div className="choose_man-item_selected" onClick={(event) => onItemClick(event, index) }>{item.ФИО}</div>
                                            </li>
                                            :
                                            <li>
                                                <div className="choose_man-item" onClick={(event) => onItemClick(event, index) }>{item.ФИО}</div>
                                            </li>
                                    )}
                            </ul>
                        </li>
                    </ul>
                    <button 
                        onClick={() => closeModal()}
                    >
                        Выбрать
                    </button>
                </div>
            </div>
        </Modal>
    );

};

export default ChooseManEdit;