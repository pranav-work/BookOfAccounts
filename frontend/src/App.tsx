import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import './App.css'
import ProtectedLayout from './routes/ProtectedLayout';

function App() {
  return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element = {<ProtectedLayout />}>
          {/* Add your protected routes here */}
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
  );
}

export default App
