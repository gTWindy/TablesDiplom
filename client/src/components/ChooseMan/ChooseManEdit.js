import { useState, useRef, useEffect } from 'react';
import Modal from 'react-modal';
import './ChooseMan.css';
const ChooseManEdit = ({x, y, isOpen, items, handleCloseModal}) => {
    let [selectedItem, setSelectedItem] = useState(null);
    let [selectedItemInfo, setSelectedItemInfo] = useState(null);
    let [modalIsOpen, setIsOpen] = useState(isOpen);   

    useEffect(() => {
        setIsOpen(isOpen);
    }, [isOpen]);

    const onItemClick = (e, index) => {
        debugger;
        if (selectedItem)
            selectedItem.style.backgroundColor = 'white';
        setSelectedItem(e.currentTarget);
        e.currentTarget.style.backgroundColor = 'gray';
        setSelectedItemInfo({
            name: items[index].ФИО,
            rank: items[index]["Воинское звание"],
        })
    }

    const closeModal = () => {
        handleCloseModal(selectedItemInfo);
    }

    return (
        <Modal
        isOpen={modalIsOpen}
        //onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        //style={customStyles}
        //contentLabel="Example Modal"
      >
            <div
            className="modal" 
            
            style={{
                top: `${y}px`,
                left: `${x}px`
            }}
            >
                <div className="modal-content">
                    <h2>Список</h2>
                    <ul>
                        <li> 5112
                            <ul>
                                {items.map(
                                        (item, index) =>
                                        <li>
                                            <div className="choose_man-item" onClick={(event) => onItemClick(event, '5112', index) }>{item.ФИО}</div>
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