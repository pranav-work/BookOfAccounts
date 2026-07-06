import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Home from './pages/HomePage';
import ProtectedLayout from './routes/ProtectedLayout';
import RootRedirect from './routes/RootRedirect';
import './App.css'
function App() {
  return (
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<LoginPage />} />
        <Route element = {<ProtectedLayout />}>
          {/* Add your protected routes here */}
          <Route path="/home" element={<Home />} />
        </Route>
      </Routes>
  );
}

export default App
