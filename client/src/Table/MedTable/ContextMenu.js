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
        newData.splice(newData.length, 0, {});
        newData[newData.length - 1].rank = newMan.rank;
        newData[newData.length - 1].name = newMan.name;
        newData[newData.length - 1].group = newMan.group;
        newData[newData.length - 1].nameMedInstitution = "";
        newData[newData.length - 1].diagnosis = "";
        newData[newData.length - 1].date = "";
        newData[newData.length - 1]["k/l"] = "";
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
        <ChooseMan isOpen={showModal} x={x} y={y} onClose={closeModal} items={items} />
        </>
    );
};

export default ContextMenu;