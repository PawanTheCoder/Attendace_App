import { useState } from 'react';
import Card from './Card.jsx';
import styles from './Profile.module.css';

export default function Profile({ user }) {
    const [activeTab, setActiveTab] = useState('profile');

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>User Profile</h1>
                <p className={styles.subtitle}>Manage your account information</p>
            </div>

            <div className={styles.content}>
                <div className={styles.profileCard}>
                    <Card className={styles.userInfo}>
                        <div className={styles.avatarSection}>
                            <div className={styles.avatar}>
                                {user?.name?.charAt(0)?.toUpperCase() || user?.username?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <div className={styles.userDetails}>
                                <h2 className={styles.userName}>{user?.name || user?.username}</h2>
                                <p className={styles.userRole}>{user?.role}</p>
                                <div className={styles.userId}>User ID: #{user?.id}</div>
                            </div>
                        </div>

                        <div className={styles.infoGrid}>
                            <div className={styles.infoItem}>
                                <label className={styles.infoLabel}>Username</label>
                                <div className={styles.infoValue}>{user?.username}</div>
                            </div>
                            <div className={styles.infoItem}>
                                <label className={styles.infoLabel}>Role</label>
                                <div className={styles.infoValue}>
                                    <span className={styles.roleBadge}>{user?.role}</span>
                                </div>
                            </div>
                            <div className={styles.infoItem}>
                                <label className={styles.infoLabel}>User ID</label>
                                <div className={styles.infoValue}>#{user?.id}</div>
                            </div>
                            <div className={styles.infoItem}>
                                <label className={styles.infoLabel}>Status</label>
                                <div className={styles.infoValue}>
                                    <span className={styles.statusActive}>Active</span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className={styles.systemInfo}>
                        <h3 className={styles.sectionTitle}>System Information</h3>
                        <div className={styles.systemDetails}>
                            <div className={styles.systemItem}>
                                <label>Last Login</label>
                                <span>Just now</span>
                            </div>
                            <div className={styles.systemItem}>
                                <label>Account Created</label>
                                <span>Recently</span>
                            </div>
                            <div className={styles.systemItem}>
                                <label>Session</label>
                                <span className={styles.sessionActive}>Active</span>
                            </div>
                        </div>
                    </Card>
                </div>

                <Card className={styles.quickStats}>
                    <h3 className={styles.sectionTitle}>Quick Stats</h3>
                    <div className={styles.stats}>
                        <div className={styles.stat}>
                            <div className={styles.statIcon}>📊</div>
                            <div className={styles.statContent}>
                                <div className={styles.statNumber}>0</div>
                                <div className={styles.statLabel}>Classes Today</div>
                            </div>
                        </div>
                        <div className={styles.stat}>
                            <div className={styles.statIcon}>✅</div>
                            <div className={styles.statContent}>
                                <div className={styles.statNumber}>0</div>
                                <div className={styles.statLabel}>Students Present</div>
                            </div>
                        </div>
                        <div className={styles.stat}>
                            <div className={styles.statIcon}>🎯</div>
                            <div className={styles.statContent}>
                                <div className={styles.statNumber}>0%</div>
                                <div className={styles.statLabel}>Attendance Rate</div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}