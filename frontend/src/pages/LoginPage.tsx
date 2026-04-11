import { useState } from 'react';
import { loginUser } from '../services/loginUser';
import styles from './LoginPage.module.css';
import useBackendStatus from '../hooks/useBackendStatus';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const backendStatus = useBackendStatus();
    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        await loginUser(email, password);
    };
    if (!backendStatus) {
    return (
    <div className={`${styles['login-page']}`}>
      <div className={`${styles['login-container']} ${styles['na-container']}`}>
        <p>Backend is not available</p>
      </div>
    </div>
  );
  } else{
    if (backendStatus.status !== 'ok') {
      return (
        <div className={`${styles['login-page']}`}>
          <div className={`${styles['login-container']} ${styles['na-container']}`}>
            <p>Backend is not healthy: {backendStatus.message}</p>
          </div>
        </div>
      );
    } else {
      return (
        < div className={`${styles['login-page']}`}>
            <div className={`${styles['login-container']}`}>
            <form className={`${styles['login-form']}`}
                onSubmit={handleSubmit}
            >
                <div className={`${styles['form-group']}`}>
                    <label htmlFor="email">Email:</label>
                    <input 
                        type="email" id="email" name="email" 
                        value={email} onChange={(e) => setEmail(e.target.value)}
                        required 
                    />
                </div>
                <div className={`${styles['form-group']}`}>
                    <label htmlFor="password">Password:</label>
                    <input 
                        type="password" id="password" name="password" 
                        value={password} onChange={(e) => setPassword(e.target.value)}
                        required 
                    />
                </div>
                <button 
                    type="submit" className={`${styles['login-button']}`}
                >Login</button>
                <div className={styles['login-actions']}>
                    <a href="/register" className={`${styles['register-link']}`}>Register</a>
                    <a href="/forgot-password" className={`${styles['forgot-password-link']}`}>Forgot Password?</a>
                </div>
            </form>
        </div>
        </div>
        
    )
    }
  }

    
}

export default LoginPage;
 
  