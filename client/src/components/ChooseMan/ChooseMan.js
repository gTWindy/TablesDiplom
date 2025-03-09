import { useState, useRef, useEffect } from 'react';
import './ChooseMan.css';
import Modal from 'react-modal';

import { Tree } from "antd";

const ChooseMan = ({items, handleCloseModal, isCheckable, checkedKeys }) => {

    let [selectedItem, setSelectedItem] = useState(null);
    let [checkedItem, setCheckedItem] = useState(checkedKeys);
    let [selectedItemInfo, setSelectedItemInfo] = useState(null);

    const onItemSelect = (selectedKeys, info) => {
        console.log(info);
        console.log(selectedKeys);
        setSelectedItem(info.selectedNodes[0]);
    }

    const onCheck = (checkedKeys) => {
        setCheckedItem(checkedKeys);
    }

    const onCloseModal = () => {
        if (isCheckable)
            handleCloseModal(checkedItem);
        else
            handleCloseModal(selectedItem);
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
            onRequestClose={() => onCloseModal()}
            style={customStyles}>
            <Tree
                onSelect={onItemSelect}
                treeData={items}
                checkable={isCheckable}
                onCheck={onCheck}
                checkedKeys={checkedItem}
            />
            <button
                onClick={() => onCloseModal()}
            >
                Выбрать
            </button>
        </Modal>
    );
};

export default ChooseMan;