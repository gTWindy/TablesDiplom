import { useState, useRef, useEffect } from 'react';

const ContextMenu = ({ x, y, handleDelete, handleInsert }) => {
    const contextMenuRef = useRef(null);

    useEffect(() => {
        if (x !== null && y !== null) {
            contextMenuRef.current.style.left = `${x}px`;
            contextMenuRef.current.style.top = `${y}px`;
            contextMenuRef.current.style.display = 'block';
        } else {
            contextMenuRef.current.style.display = 'none';
        }
    }, [x, y]);

    return (
        <>
        <div ref={contextMenuRef} className="context-menu">
            <ul>
                <li onClick={handleDelete}>Удалить строку</li>
                <li onClick={handleInsert}>Вставить новую строку</li>
            </ul>
        </div>
        </>
    );
};

export default ContextMenu;