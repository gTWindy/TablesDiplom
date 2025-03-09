import { useState } from 'react';

import { TableEditorModel } from '../models/TableEditorModel'
import { useEffect } from 'react';
import { observer } from "mobx-react-lite";
import Editor from '../components/Editor';

const EditTable2 = observer(({ groups }) => {
    // Создаем состояние для хранения экземпляра модели
    const [tableModel, setTableModel] = useState(null);

    // Создаем экземпляр модели только один раз при монтировании компонента
    useEffect(() => {
        const createAndLoadModel = async () => {
            const model = new TableEditorModel(groups);
            await model.loadData();
            setTableModel(model);
        };

        createAndLoadModel();
    }, []);

    return (
        <>
           <Editor 
            tableModel={tableModel}
            isGeneralTable={false}
           />
        </>
    );
});

export default EditTable2;