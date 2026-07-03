import { useEffect, useRef, useState } from 'react';
import {CgProfile} from 'react-icons/cg';
import { useNavigate } from 'react-router-dom';
import NavItem from '../components/navItem';
import { useAuth } from '../context/AuthContext';
import { logoutUser } from '../services/logoutUser';
import styles from './HomePage.module.css';

const formatLoginTime = (loginTime: string | null) => {
  if (!loginTime) return '';
  const timestamp = Number(loginTime);
  const date = Number.isNaN(timestamp) ? new Date(loginTime) : new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return 'Not available';
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
};

export default function Home() {
  const authContext = useAuth();
  const navigate = useNavigate();
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const loginTime = localStorage.getItem('loginTime');

  useEffect(() => {
    const closeProfileMenu = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', closeProfileMenu);
    return () => document.removeEventListener('mousedown', closeProfileMenu);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      authContext?.logout();
      navigate('/login', { replace: true });
    }
  };

  return (
    <div className={styles['home-page']}>
      <div className = {styles['nav-bar']}>
        <NavItem name='Dashboard' />
        {/* <NavItem name='Transactions' />
        <NavItem name='Budget' />
        <NavItem name='Policies' />
        <NavItem name='Liabilities' />
        <NavItem name='Portfolio' /> */}
        <div className = {styles['session']}>
          logged in since : {formatLoginTime(loginTime)}
        </div>
        <div className={styles['profile-menu']} ref={profileMenuRef}>
          <button
            type="button"
            className={styles['profile-button']}
            aria-label="Open profile menu"
            aria-expanded={isProfileMenuOpen}
            onClick={() => setIsProfileMenuOpen((isOpen) => !isOpen)}
          >
            <CgProfile className={styles['profile-icon']} />
          </button>
          {isProfileMenuOpen && (
            <div className={styles['profile-dropdown']}>
              <button
                type="button"
                className={styles['logout-button']}
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
