import { useState, useRef, useEffect } from 'react';
import './ChooseMan.css';
const ChooseMan = ({x, y, items, handleCloseModal}) => {
    
    let [selectedItem, setSelectedItem] = useState(null);
    let [selectedItemInfo, setSelectedItemInfo] = useState(null);

    const modalRef = useRef(null);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (!modalRef.current.contains(event.target)) {
                handleCloseModal(null);
            }
        };

        document.addEventListener('click', handleOutsideClick, true);
        
        // При размонтировании компонента удаляем слушателя события, чтобы избежать утечек памяти.
        return () => {
            document.removeEventListener('click', handleOutsideClick, true);
        };
    }, []);
    
    const handleClickOutside = (e) => {
        // Закрываем модалку при клике вне её области
        if (e.target === e.currentTarget) {
            handleCloseModal();
        }
    };

    const onItemClick = (e, group, index) => {
        debugger;
        if (selectedItem)
            selectedItem.style.backgroundColor = 'white';
        setSelectedItem(e.currentTarget);
        e.currentTarget.style.backgroundColor = 'gray';
        setSelectedItemInfo({
            name: items[group][index].ФИО,
            rank: items[group][index]["Воинское звание"],
            group: group
        })
    }

    return (
        <div
        ref={modalRef}
        className="modal" 
        onClick={handleClickOutside}
        style={{
            top: `${y}px`,
            left: `${x}px`
          }}
        >
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
                    onClick={() => handleCloseModal(selectedItemInfo)}>
                    Выбрать
                </button>
            </div>
        </div>
    );
};

export default ChooseMan;