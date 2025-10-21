import { useState, useEffect } from 'react';
import styles from './DashboardHome.module.css';

export default function DashboardHome({ user, stats, loading, onRefresh }) {
    const [subjectCounts, setSubjectCounts] = useState(null);

    useEffect(() => {
        if (user?.role === 'TEACHER') {
            fetchSubjectCounts();
        }
    }, [user]);

    const fetchSubjectCounts = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/dashboard/subjectCounts');
            if (response.ok) {
                const data = await response.json();
                setSubjectCounts(data);
            }
        } catch (error) {
            console.error('Failed to fetch subject counts:', error);
        }
    };

    if (loading) {
        return <div className={styles.loading}>Loading dashboard...</div>;
    }

    return (
        <div className={styles.dashboardHome}>
            <div className={styles.header}>
                <h1>Welcome back, {user?.name || user?.username}!</h1>
                <button onClick={onRefresh} className={styles.refreshButton}>
                    🔄 Refresh
                </button>
            </div>

            {user?.role === 'TEACHER' && stats && (
                <>
                    {/* Stats Grid */}
                    <div className={styles.statsGrid}>
                        <div className={styles.statCard}>
                            <div className={styles.statValue}>{stats.totalStudents || 0}</div>
                            <div className={styles.statLabel}>Total Students</div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statValue}>{stats.totalSubjects || 0}</div>
                            <div className={styles.statLabel}>Total Subjects</div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statValue}>{stats.presentTotal || 0}</div>
                            <div className={styles.statLabel}>Present Today</div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statValue}>{stats.absentTotal || 0}</div>
                            <div className={styles.statLabel}>Absent Today</div>
                        </div>
                    </div>

                    {/* Subject-wise Attendance */}
                    {subjectCounts && (
                        <div className={styles.section}>
                            <h2>Attendance by Subject</h2>
                            <div className={styles.subjectGrid}>
                                {Object.entries(subjectCounts).map(([subject, count]) => (
                                    <div key={subject} className={styles.subjectCard}>
                                        <div className={styles.subjectName}>{subject}</div>
                                        <div className={styles.attendanceCount}>{count} present</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}

            {user?.role === 'STUDENT' && (
                <div className={styles.studentView}>
                    <h2>Your Attendance Overview</h2>
                    {/* Add student-specific content here */}
                </div>
            )}
        </div>
    );
}