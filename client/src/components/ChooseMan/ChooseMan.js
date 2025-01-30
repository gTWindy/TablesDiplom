import { useState, useRef, useEffect } from 'react';
import './ChooseMan.css';
import Modal from 'react-modal';

import { Tree } from "antd";

const ChooseMan = ({items, handleCloseModal }) => {

    let [selectedItem, setSelectedItem] = useState(null);
    let [selectedItemInfo, setSelectedItemInfo] = useState(null);

    const onItemSelect = (selectedKeys, info) => {
        console.log(info);
        console.log(selectedKeys);
        setSelectedItem(info.selectedNodes[0]);
    }

    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '700px', // Ширина модального окна
            height: '500px', // Высота модального окна
        },
    };

    return (
        <Modal
            isOpen={true}
            onRequestClose={() => handleCloseModal(selectedItem)}
            style={customStyles}>
            <Tree
                onSelect={onItemSelect}
                treeData={items}
            />
            <button
                onClick={() => handleCloseModal(selectedItem)}
            >
                Выбрать
            </button>
        </Modal>
    );
};

export default ChooseMan;