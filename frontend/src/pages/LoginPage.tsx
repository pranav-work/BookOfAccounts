import styles from './LoginPage.module.css';

function LoginPage() {
    return (
        <div className={`${styles['login-page']}`}>
            <div className={`${styles['login-container']}`}>
                <form className={`${styles['login-form']}`}>
                    <div className={`${styles['form-group']}`}>
                        <label htmlFor="username">Email:</label>
                        <input type="text" id="username" name="username" />
                    </div>
                    <div className={`${styles['form-group']}`}>
                        <label htmlFor="password">Password:</label>
                        <input type="password" id="password" name="password" />
                    </div>
                    <button type="submit" className={`${styles['login-button']}`}>Login</button>
                    <div className={styles['login-actions']}>
                        <a href="/register" className={`${styles['register-link']}`}>Register</a>
                        <a href="/forgot-password" className={`${styles['forgot-password-link']}`}>Forgot Password?</a>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;
