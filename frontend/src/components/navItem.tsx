import styles from './navItem.module.css';
export default function NavItem({name}:{name:string}) {
  return (
    <div className={styles['nav-item']}>
        <div className={styles['nav-item-ltail']}></div>
        <div className={styles['nav-item-text']}>{name}</div>
        <div className={styles['nav-item-rtail']}></div>
    </div>
  );
}