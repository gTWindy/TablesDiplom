import { useState } from 'react';

import './Table.css';
import { useEffect } from 'react';
import { observer } from "mobx-react-lite";
import { GeneralTableModel } from '../models/GeneralTableModel';
import Editor from "../components/Editor"

const GeneralTable = observer(() => {
  // Создаем состояние для хранения экземпляра модели
  const [tableModel, setTableModel] = useState(null);

  useEffect(() => {
    const createAndLoadModel = async () => {
      const model = new GeneralTableModel();
      await model.loadData();
      setTableModel(model);
    };

    createAndLoadModel();
  }, [])

  return (
    <>
      <Editor 
        tableModel={tableModel}
        isGeneralTable={true}
      />
    </>
  );
})

export default GeneralTable;