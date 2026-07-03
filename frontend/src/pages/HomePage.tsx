import {CgProfile} from 'react-icons/cg';
import NavItem from '../components/navItem';
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
  const loginTime = localStorage.getItem('loginTime');
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
        <CgProfile className={styles['profile-icon']} />
      </div>
    </div>
  );
}