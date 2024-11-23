import { useState, useRef, useEffect } from 'react';
import ChooseMan from './ChooseMan';

const ContextMenu = ({ x, y, selectedRowIndex, data, setData }) => {
    const contextMenuRef = useRef(null);
    const [showModal, setShowModal] = useState(false);
    const [items, setItems] = useState([]);

    useEffect(() => {
        if (x !== null && y !== null) {
            contextMenuRef.current.style.left = `${x}px`;
            contextMenuRef.current.style.top = `${y}px`;
            contextMenuRef.current.style.display = 'block';
        } else {
            contextMenuRef.current.style.display = 'none';
        }
    }, [x, y]);

    function handleDelete() {
        if (selectedRowIndex !== null) {
            const newData = [...data];
            newData.splice(selectedRowIndex, 1);
            setData(newData);
            contextMenuRef.current.style.display = 'none';
        }
    }

    function handleInsert() {
        if (selectedRowIndex === null)
            return;
        fetch('http://localhost:5000/manList') // Указываем URL ресурса
        .then(response => {
            if (!response.ok)
                throw new Error(`Network response was not ok: ${response.status}`);
            return response.json(); // Преобразуем ответ в JSON
        })
        .then(data => {
            console.log(data); // Выводим полученные данные в консоль
            setItems(data.mergedData);
            setShowModal(true);
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
        
        contextMenuRef.current.style.display = 'none';
    }

    const closeModal = (newMan) => {
        setShowModal(false); // Закрываем модальное окно
        const newData = [...data];
        newData.splice(selectedRowIndex + 1, 0, 
            Array.from({ length: 7 }, (_, colIndex) => ({
                id: `${selectedRowIndex}-${colIndex}`,
                value: ''
            }))
        );
        newData[selectedRowIndex + 1][0].value = newMan.rank;
        newData[selectedRowIndex + 1][1].value = newMan.surname;
        newData[selectedRowIndex + 1][2].value = newMan.group;
        setData(newData);
    };

    return (
        <>
        <div ref={contextMenuRef} className="context-menu">
            <ul>
                <li onClick={handleDelete}>Удалить строку</li>
                <li onClick={handleInsert}>Вставить новую строку</li>
            </ul>
        </div>
        <ChooseMan isOpen={showModal} onClose={closeModal} items={items} />
        </>
    );
};

export default ContextMenu;