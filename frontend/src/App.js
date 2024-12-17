import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UploadPage from './FileUpload';
// import ScanResultsPage from './ScanResults';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<UploadPage />} />
            </Routes>
        </Router>
    );
};

export default App;
