import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/loginUser';
import useBackendStatus from '../hooks/useBackendStatus';
import { useAuth } from '../context/AuthContext';
import styles from './LoginPage.module.css';
import api from '../services/api';

type AuthMode = 'login' | 'register' | 'forgot-password';

function LoginForm( { onSwitch }: { onSwitch: (mode: AuthMode) => void }) {
  const authContext = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    try{
      const tokens = await loginUser(email, password);
      authContext?.login(tokens.access, tokens.refresh);
      navigate('/dashboard');
    } catch (error) {
      alert('Login failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };
  return (
    <form 
      className={`${styles['login-form']}`}
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
        <span className={`${styles['register-link']}`}
          onClick={() => onSwitch("register")}
        >Register</span>
        <span className={`${styles['forgot-password-link']}`}
          onClick={() => onSwitch("forgot-password")}
        >Forgot Password?</span>
      </div>
    </form>
  )
}

function RegisterForm( { onSwitch }: { onSwitch: (mode: AuthMode) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (!e.target.value) {
      setEmailError('Email is required');
    } else{
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setEmailError(emailRegex.test(e.target.value) ? '' : 'Invalid email format');
    }
  };
  const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    const hasUpperCase = /[A-Z]/.test(e.target.value);
    const hasLowerCase = /[a-z]/.test(e.target.value);
    const hasNumber = /[0-9]/.test(e.target.value);
    if (!e.target.value) {
      setPasswordError('Password is required');
    } else if (e.target.value.length < 8) {
      setPasswordError('Password must be at least 8 characters');
    } else if (!hasUpperCase || !hasLowerCase || !hasNumber) {
      setPasswordError('Password must include uppercase, lowercase, and number');
    } else {
      setPasswordError('');
    }
  }

  const onConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    if (e.target.value !== password) {
      setConfirmPasswordError('Passwords do not match');
    } else {
      setConfirmPasswordError('');
    }
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    try{
      // Call registration API here
      const res = await api.post('/registration/', { email, password });
      if (res.status !== 201) {
        throw new Error('Registration failed with status ' + res.status);
      } 
      alert('Registration successful! Please log in.');
      onSwitch('login');  
    } catch (error) {
      alert('Registration failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };
  return (
    <form className={`${styles['login-form']}`} onSubmit={handleSubmit}>
      <div className={`${styles['form-group']}`}>
        <label htmlFor="email">Email:</label>
        <input 
          type="email" id="email" name="email" 
          value={email} onChange={onEmailChange}
          required 
        />
      </div>
      {emailError && <p className={styles['error-message']}>{emailError}</p>}         
      <div className={`${styles['form-group']}`}>
        <label htmlFor="password">Password:</label>
        <input 
          type="password" id="password" name="password" 
          value={password} onChange={onPasswordChange}
          required 
        />
      </div>
      {passwordError && <p className={styles['error-message']}>{passwordError}</p>}
      <div className={`${styles['form-group']}`}>
        <label htmlFor="confirm-password">Confirm Password:</label>
        <input 
          type="password" id="confirm-password" name="confirm-password" 
          value={confirmPassword} onChange={onConfirmPasswordChange}
          required 
        />
      </div>
      {confirmPasswordError && <p className={styles['error-message']}>{confirmPasswordError}</p>}
      <button 
        type="submit" className={`${styles['login-button']}`}
      >Register</button>
      <span onClick={() => onSwitch('login')} className={styles['switch-link']}>
        Back to Login
      </span>
    </form>
  )
}

function ForgotPasswordForm( { onSwitch }: { onSwitch: (mode: AuthMode) => void }) {
  const [email, setEmail] = useState('');
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle forgot password logic here
    try{
      alert('Password reset link sent to your email!');
      onSwitch('login');
    } catch (error) {
      alert('Failed to send reset link: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  return (
    <form className={`${styles['login-form']}`} onSubmit={handleSubmit}>
      <div className={`${styles['form-group']}`}>
        <label htmlFor="email">Email:</label>
        <input 
          type="email" id="email" name="email" 
          value={email} onChange={(e) => setEmail(e.target.value)}
          required disabled
        />
      </div>         
      <button 
        type="submit" className={`${styles['login-button']}`} disabled
      >Reset Password
      </button>
      <span onClick={() => onSwitch('login')} className={styles['switch-link']}>
        Back to Login
      </span>
    </form>
  )
}

export default function LoginPage() {
  const [mode, setMode] = useState<AuthMode>('login');
  const backendStatus = useBackendStatus();
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
            {mode === 'login' && <LoginForm onSwitch = {setMode}/>}
            {mode === 'register' && <RegisterForm onSwitch = {setMode}/>}
            {mode === 'forgot-password' && <ForgotPasswordForm onSwitch = {setMode}/>}
          </div>
        </div>
        
    )
    }
  }
}

 
  