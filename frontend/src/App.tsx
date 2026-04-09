import useBackendStatus from './hooks/useBackendStatus'
import LoginPage from './pages/LoginPage';
import './App.css'

function App() {
  const backendStatus = useBackendStatus();
  if (!backendStatus) {
    return (
    <div className="App">
      <div className='na-container'>
        <p>Backend is not available</p>
      </div>
    </div>
  );
  } else{
    if (backendStatus.status !== 'ok') {
      return (
        <div className="App">
          <div className='na-container'>
            <p>Backend is not healthy: {backendStatus.message}</p>
          </div>
        </div>
      );
    } else {
      return (
        <div className="App">
          <LoginPage />
        </div>
      );
    }
  }
}

export default App
