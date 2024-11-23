import { useState } from 'react';
import './ChooseMan.css';
const ChooseMan = ({ isOpen, onClose, items }) => {
    
    let [selectedItem, setSelectedItem] = useState(null);
    let [selectedItemInfo, setSelectedItemInfo] = useState(null);

    if (!isOpen) return null;
    const handleClickOutside = (e) => {
        // Закрываем модалку при клике вне её области
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const onItemClick = (e, group, index) => {
        debugger;
        if (selectedItem)
            selectedItem.style.backgroundColor = 'white';
        setSelectedItem(e.currentTarget);
        e.currentTarget.style.backgroundColor = 'gray';
        setSelectedItemInfo({
            surname: items[group][index].ФИО,
            rank: items[group][index]["Воинское звание"],
            group: group
        })
    }

    return (
        <div className="modal" onClick={handleClickOutside}>
            <div className="modal-content">
                <h2>Список</h2>
                <ul>
                    <li> 5111
                        <ul>
                            {items['5111'].map(
                                (item, index) => 
                                <li>
                                    <div className='item' onClick={(event) => onItemClick(event, '5111', index) }>{item.ФИО}</div>
                                </li>
                            )}
                        </ul>
                    </li>
                    <li> 5112
                        <ul>
                            {items['5112'].map(
                                    (item, index) =>
                                    <li>
                                        <div className='item' onClick={(event) => onItemClick(event, '5112', index) }>{item.ФИО}</div>
                                    </li>
                                )}
                        </ul>
                    </li>
                </ul>
                <button 
                    onClick={() => onClose(selectedItemInfo)}>
                    Выбрать
                </button>
            </div>
        </div>
    );
};

export default ChooseMan;