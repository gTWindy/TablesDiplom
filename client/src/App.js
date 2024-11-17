import { Routes, Route, Link } from 'react-router-dom';

import Login from './Login';

import DataTable from './Table/Table';
import EditTable from './Table/TableEditor';
import MedTable from './Table/MedTable/MedTable';

const App = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<Login/>}/>
                <Route path="/5kurs" element={<EditTable/>}/>
                <Route path="/dejfak" element={<DataTable/>}/>
                <Route path="/lazaret" element={<MedTable/>}/>
            </Routes>
        </>
    )
}

export default App;