import { Routes, Route, useNavigate } from 'react-router-dom';

import Login from './Login';

import DataTable from './Table/Table';
// Моя собственная таблица
import EditTable from './Table/TableEditor';
// React таблица
import EditTable2 from './Table/TableEditor2';

import MedTable from './Table/MedTable/MedTable';

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
                <Route path="/1kurs" element={<EditTable numberOfCourse={1}/>}/>
                <Route path="/2kurs" element={<EditTable numberOfCourse={2}/>}/>
                <Route path="/3kurs" element={<EditTable numberOfCourse={3}/>}/>
                <Route path="/4kurs" element={<EditTable numberOfCourse={4}/>}/>
                <Route path="/5kurs" element={<EditTable2 numbersOfGroups={[5111, 5112, 5113, 5114, 5115]}/>}/>
                <Route path="/dejfak" element={<DataTable/>}/>
                <Route path="/lazaret" element={<MedTable/>}/>
            </Routes>
        </>
    )
}

export default App;