import { useState } from 'react';
import './ChooseMan.css';
const ChooseMan = ({ isOpen, onClose, items }) => {
    let [selectedItem, setSelectedItem] = useState(null);
    if (!isOpen) return null;
    const handleClickOutside = (e) => {
        // Закрываем модалку при клике вне её области
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const onItemClick = (e) => {
        debugger;
        if (selectedItem)
            selectedItem.style.backgroundColor = 'white';
        setSelectedItem(e.currentTarget);
        selectedItem.style.backgroundColor = 'gray';
    }

    return (
        <div className="modal" onClick={handleClickOutside}>
            <div className="modal-content">
                <h2>Список</h2>
                <ul>
                    <li> 5111
                        <ul>
                            {items['5111'].map(
                                (item) => 
                                <li>
                                    <div className='item' onClick={(event) => onItemClick(event) }>{item.ФИО}</div>
                                </li>
                            )}
                        </ul>
                    </li>
                    <li> 5112
                        <ul>
                            {items['5112'].map(
                                    (item) => 
                                    <li>
                                        <div className='item' onClick={(event) => onItemClick(event) }>{item.ФИО}</div>
                                    </li>
                                )}
                        </ul>
                    </li>
                </ul>
                <button onClick={onClose}>Выбрать</button>
            </div>
        </div>
    );
};

export default ChooseMan;