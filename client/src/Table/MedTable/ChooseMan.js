import './ChooseMan.css';
const ChooseMan = ({ isOpen, onClose, items }) => {
    if (!isOpen) return null;

    const handleClickOutside = (e) => {
        // Закрываем модалку при клике вне её области
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="modal" onClick={handleClickOutside}>
            <div className="modal-content">
                <h2>Список</h2>
                <ul>
                    {items.map((item) => <li>{item}</li>)}
                    <li>1</li>
                    <li>2</li>
                    <li>3</li>
                    <li>4</li>
                </ul>
                <button onClick={onClose}>Закрыть</button>
            </div>
        </div>
    );
};

export default ChooseMan;