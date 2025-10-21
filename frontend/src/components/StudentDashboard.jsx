import { useEffect, useMemo, useState } from 'react';
import { apiGet } from '../api';
import Card from './ui/Card.jsx';
import Loader from './ui/Loader.jsx';
import AttendanceTable from './AttendanceTable.jsx';
import styles from './StudentDashboard.module.css';

export default function StudentDashboard({ user }) {
    const [attendance, setAttendance] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedPeriod, setSelectedPeriod] = useState('today'); // today, week, month

    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                setLoading(true);
                setError('');

                const [subjectsData, attendanceData] = await Promise.all([
                    apiGet('/subjects'),
                    user?.id ? apiGet(`/students/${user.id}/attendance`) : Promise.resolve([])
                ]);

                setSubjects(subjectsData);
                setAttendance(attendanceData);
            } catch (err) {
                console.error('Failed to fetch student data:', err);
                setError('Failed to load your attendance data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchStudentData();
    }, [user]);

    // Process attendance data for display
    const attendanceData = useMemo(() => {
        const attendanceMap = new Map();

        // Initialize all subjects as ABSENT
        subjects.forEach(subject => {
            attendanceMap.set(subject.id, {
                id: subject.id,
                subject: subject.name,
                subjectCode: subject.code,
                status: 'ABSENT',
                date: new Date().toISOString().split('T')[0],
                lastUpdated: null
            });
        });

        // Update with actual attendance records
        attendance.forEach(record => {
            if (attendanceMap.has(record.subjectId)) {
                attendanceMap.set(record.subjectId, {
                    ...attendanceMap.get(record.subjectId),
                    status: record.status,
                    date: record.markedAt,
                    lastUpdated: record.updatedAt || record.createdAt
                });
            }
        });

        return Array.from(attendanceMap.values());
    }, [subjects, attendance]);

    // Calculate statistics
    const stats = useMemo(() => {
        const total = attendanceData.length;
        const present = attendanceData.filter(item => item.status === 'PRESENT').length;
        const absent = attendanceData.filter(item => item.status === 'ABSENT').length;
        const attendanceRate = total > 0 ? Math.round((present / total) * 100) : 0;

        return { total, present, absent, attendanceRate };
    }, [attendanceData]);

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <Loader text="Loading your attendance..." variant="dots" size="large" />
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.errorContainer}>
                <div className={styles.error}>
                    <span className={styles.errorIcon}>⚠️</span>
                    {error}
                    <button
                        className={styles.retryButton}
                        onClick={() => window.location.reload()}
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {/* Header Section */}
            <div className={styles.header}>
                <div className={styles.welcomeSection}>
                    <h1 className={styles.title}>Welcome, {user?.name || user?.username}!</h1>
                    <p className={styles.subtitle}>Here's your attendance overview</p>
                </div>
                <div className={styles.periodSelector}>
                    <label htmlFor="period" className={styles.periodLabel}>View:</label>
                    <select
                        id="period"
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                        className={styles.periodSelect}
                    >
                        <option value="today">Today</option>
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                    </select>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className={styles.statsGrid}>
                <Card className={styles.statCard}>
                    <div className={styles.statContent}>
                        <div className={styles.statIcon}>📊</div>
                        <div className={styles.statInfo}>
                            <div className={styles.statValue}>{stats.attendanceRate}%</div>
                            <div className={styles.statLabel}>Attendance Rate</div>
                        </div>
                    </div>
                </Card>

                <Card className={styles.statCard}>
                    <div className={styles.statContent}>
                        <div className={styles.statIcon}>✅</div>
                        <div className={styles.statInfo}>
                            <div className={styles.statValue}>{stats.present}</div>
                            <div className={styles.statLabel}>Present</div>
                        </div>
                    </div>
                </Card>

                <Card className={styles.statCard}>
                    <div className={styles.statContent}>
                        <div className={styles.statIcon}>❌</div>
                        <div className={styles.statInfo}>
                            <div className={styles.statValue}>{stats.absent}</div>
                            <div className={styles.statLabel}>Absent</div>
                        </div>
                    </div>
                </Card>

                <Card className={styles.statCard}>
                    <div className={styles.statContent}>
                        <div className={styles.statIcon}>📚</div>
                        <div className={styles.statInfo}>
                            <div className={styles.statValue}>{stats.total}</div>
                            <div className={styles.statLabel}>Total Subjects</div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Attendance Table */}
            <Card title="Your Attendance" className={styles.attendanceCard}>
                <div className={styles.tableContainer}>
                    {attendanceData.length === 0 ? (
                        <div className={styles.emptyState}>
                            <div className={styles.emptyIcon}>📝</div>
                            <h3>No Attendance Records</h3>
                            <p>Your attendance records will appear here once they are marked.</p>
                        </div>
                    ) : (
                        <table className={styles.attendanceTable}>
                            <thead>
                                <tr>
                                    <th className={styles.tableHeader}>Subject</th>
                                    <th className={styles.tableHeader}>Status</th>
                                    <th className={styles.tableHeader}>Date</th>
                                    <th className={styles.tableHeader}>Last Updated</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendanceData.map((record, index) => (
                                    <tr key={record.id || index} className={styles.tableRow}>
                                        <td className={styles.subjectCell}>
                                            <div className={styles.subjectInfo}>
                                                <span className={styles.subjectName}>{record.subject}</span>
                                                {record.subjectCode && (
                                                    <span className={styles.subjectCode}>{record.subjectCode}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className={styles.statusCell}>
                                            <span className={`${styles.status} ${styles[record.status.toLowerCase()]}`}>
                                                <span className={styles.statusIcon}>
                                                    {record.status === 'PRESENT' ? '✅' : '❌'}
                                                </span>
                                                {record.status}
                                            </span>
                                        </td>
                                        <td className={styles.dateCell}>
                                            {record.date ? new Date(record.date).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className={styles.dateCell}>
                                            {record.lastUpdated
                                                ? new Date(record.lastUpdated).toLocaleDateString()
                                                : 'Not updated'
                                            }
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </Card>

            {/* Quick Info Section */}
            <div className={styles.infoGrid}>
                <Card title="Attendance Tips" className={styles.tipCard}>
                    <div className={styles.tipsList}>
                        <div className={styles.tipItem}>
                            <span className={styles.tipIcon}>💡</span>
                            <span>Regular attendance improves learning outcomes</span>
                        </div>
                        <div className={styles.tipItem}>
                            <span className={styles.tipIcon}>💡</span>
                            <span>Contact your teacher if you have attendance concerns</span>
                        </div>
                        <div className={styles.tipItem}>
                            <span className={styles.tipIcon}>💡</span>
                            <span>Check this dashboard regularly for updates</span>
                        </div>
                    </div>
                </Card>

                <Card title="Quick Actions" className={styles.actionsCard}>
                    <div className={styles.actions}>
                        <button className={styles.actionButton}>
                            <span className={styles.actionIcon}>📧</span>
                            <span>Contact Teacher</span>
                        </button>
                        <button className={styles.actionButton}>
                            <span className={styles.actionIcon}>📋</span>
                            <span>View Schedule</span>
                        </button>
                        <button className={styles.actionButton}>
                            <span className={styles.actionIcon}>🔄</span>
                            <span>Refresh Data</span>
                        </button>
                    </div>
                </Card>
            </div>
        </div>
    );
}