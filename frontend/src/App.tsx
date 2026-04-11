import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';

import './App.css'

function App() {
  return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
      </Routes>
  );
}

export default App
