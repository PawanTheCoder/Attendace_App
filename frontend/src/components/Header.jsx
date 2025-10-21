import { useEffect, useState } from 'react';
import styles from './Header.module.css'

export default function Header({ user, onLogout, navigate, active }) {
    const [now, setNow] = useState(new Date());
    useEffect(() => {
        const id = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(id);
    }, []);

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <div className={styles.left}>
                    {/* Brand logo moved to sidebar, so we can remove or keep minimal */}
                    <div className={styles.breadcrumb}>
                        <strong>Dashboard</strong>
                        <span className={styles.role}>{user?.role === 'TEACHER' ? 'Teacher' : 'Student'} Portal</span>
                    </div>
                </div>
                <div className={styles.right}>
                    <div className={styles.timeInfo}>
                        <span className={styles.date}>{now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                        <span className={styles.time}>{now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                    </div>
                    {user && (
                        <div className={styles.userInfo}>
                            <div className={styles.userDetails}>
                                <span className={styles.userName}>{user.name || user.username}</span>
                                <span className={styles.userRole}>{user.role?.toLowerCase()}</span>
                            </div>
                            <div className={styles.userAvatar}>
                                {user.name?.charAt(0)?.toUpperCase() || user.username?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <button className={styles.logout} onClick={onLogout} title="Logout">
                                <span className={styles.logoutIcon}>🚪</span>
                                <span className={styles.logoutText}>Logout</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}