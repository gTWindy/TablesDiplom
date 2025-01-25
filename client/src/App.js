import { Routes, Route, useNavigate } from 'react-router-dom';

import Login from './Login';

import GeneralTable from './Table/GeneralTable';
// Моя собственная таблица
import EditTable from './Table/TableEditor';
// React таблица
import EditTable2 from './Table/TableEditor2';



import MedTable from './Table/MedTable/MedTable';


// Объект модели таблицы пятого курса 
let tableModelFifthCourse = null;
// Настройки отображения даты 
export const dateOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
// Перевод колонок
export const translateForColumns =
{
    service: 'Наряд',
    lazaret: 'Лазарет',
    hospital: 'Госпиталь',
    trip: 'Командировка',
    vacation: 'Отпуск',
    dismissal: 'Увольнение',
    other: 'Прочее'
}

const App = () => {
    const navigate = useNavigate();
    
    const onAuthenticate = (page) => {
        switch (page) {
            case "DejFak":
                navigate("/dejfak");
                break;
            case "1kurs":
                navigate("/1kurs");
                break;
            case "2kurs":
                navigate("/2kurs");
                break;
            case "3kurs":
                navigate("/3kurs");
                break;
            case "4kurs":
                navigate("/4kurs");
                break;
            case "5kurs":
                //tableModelFifthCourse = new TableEditorModel([5111, 5112, 5113, 5114, 5115]);
                navigate("/5kurs");
                break;
            case "lazaret":
                navigate("/lazaret");
                break;
        }
    }
    
    return (
        <>
            <Routes>
                <Route path="/" element={<Login onAuthenticate={onAuthenticate}/>}/>
                <Route path="/1kurs" element={<EditTable2 groups={[1111, 1112, 1113, 1114, 1115]}/>}/>
                <Route path="/2kurs" element={<EditTable2 groups={[2111, 2112, 2113, 2114, 2115]}/>}/>
                <Route path="/3kurs" element={<EditTable2 groups={[3111, 3112, 3113, 3114, 3115]}/>}/>
                <Route path="/4kurs" element={<EditTable2 groups={[4111, 4112, 4113, 4114, 4115]}/>}/>
                <Route path="/5kurs" element={<EditTable2 groups={[5111, 5112, 5113, 5114, 5115]}/>}/>
                <Route path="/dejfak" element={<GeneralTable/>}/>
                <Route path="/lazaret" element={<MedTable/>}/>
            </Routes>
        </>
    )
}

export {
    App
};