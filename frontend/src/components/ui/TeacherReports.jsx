import { useState, useEffect } from 'react';
import { apiGet } from '../../api';
import Card from './Card.jsx';
import styles from './TeacherReports.module.css';

export default function TeacherReports() {
    const [subjectCounts, setSubjectCounts] = useState(null);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        loadReportsData();
    }, []);

    const loadReportsData = async () => {
        try {
            setLoading(true);
            const [countsData, summaryData] = await Promise.all([
                apiGet('/dashboard/subjectCounts'),
                apiGet('/dashboard/summary')
            ]);
            setSubjectCounts(countsData);
            setSummary(summaryData);
        } catch (error) {
            console.error('Failed to load reports data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getAttendanceRate = () => {
        if (!summary || summary.totalStudents === 0) return 0;
        return Math.round((summary.presentTotal / summary.totalStudents) * 100);
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>
                    <div className={styles.spinner}></div>
                    <p>Loading reports data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Reports & Analytics</h1>
                <p className={styles.subtitle}>Comprehensive attendance insights and statistics</p>
            </div>

            <div className={styles.tabs}>
                <button
                    className={`${styles.tab} ${activeTab === 'overview' ? styles.active : ''}`}
                    onClick={() => setActiveTab('overview')}
                >
                    📊 Overview
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'subjects' ? styles.active : ''}`}
                    onClick={() => setActiveTab('subjects')}
                >
                    📚 By Subject
                </button>
            </div>

            {activeTab === 'overview' && summary && (
                <div className={styles.overview}>
                    <div className={styles.statsGrid}>
                        <Card className={styles.statCard}>
                            <div className={styles.statIcon}>👨‍🎓</div>
                            <div className={styles.statContent}>
                                <div className={styles.statNumber}>{summary.totalStudents}</div>
                                <div className={styles.statLabel}>Total Students</div>
                            </div>
                        </Card>

                        <Card className={styles.statCard}>
                            <div className={styles.statIcon}>📚</div>
                            <div className={styles.statContent}>
                                <div className={styles.statNumber}>{summary.totalSubjects}</div>
                                <div className={styles.statLabel}>Total Subjects</div>
                            </div>
                        </Card>

                        <Card className={styles.statCard}>
                            <div className={styles.statIcon}>✅</div>
                            <div className={styles.statContent}>
                                <div className={styles.statNumber}>{summary.presentTotal}</div>
                                <div className={styles.statLabel}>Present Today</div>
                            </div>
                        </Card>

                        <Card className={styles.statCard}>
                            <div className={styles.statIcon}>❌</div>
                            <div className={styles.statContent}>
                                <div className={styles.statNumber}>{summary.absentTotal}</div>
                                <div className={styles.statLabel}>Absent Today</div>
                            </div>
                        </Card>
                    </div>

                    <Card className={styles.attendanceRateCard}>
                        <h3 className={styles.cardTitle}>Overall Attendance Rate</h3>
                        <div className={styles.rateCircle}>
                            <div className={styles.rateNumber}>{getAttendanceRate()}%</div>
                            <div className={styles.rateLabel}>Today</div>
                        </div>
                        <div className={styles.rateDetails}>
                            <div className={styles.rateDetail}>
                                <span className={styles.detailLabel}>Present:</span>
                                <span className={styles.detailValue}>{summary.presentTotal} students</span>
                            </div>
                            <div className={styles.rateDetail}>
                                <span className={styles.detailLabel}>Absent:</span>
                                <span className={styles.detailValue}>{summary.absentTotal} students</span>
                            </div>
                            <div className={styles.rateDetail}>
                                <span className={styles.detailLabel}>Total:</span>
                                <span className={styles.detailValue}>{summary.totalStudents} students</span>
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            {activeTab === 'subjects' && subjectCounts && (
                <Card className={styles.subjectsCard}>
                    <h3 className={styles.cardTitle}>Attendance by Subject</h3>
                    <div className={styles.chart}>
                        {Object.entries(subjectCounts).map(([subject, count]) => {
                            const percentage = Math.round((count / summary.totalStudents) * 100);
                            return (
                                <div key={subject} className={styles.chartItem}>
                                    <div className={styles.chartHeader}>
                                        <span className={styles.subjectName}>{subject}</span>
                                        <span className={styles.attendanceCount}>{count} students ({percentage}%)</span>
                                    </div>
                                    <div className={styles.chartBar}>
                                        <div
                                            className={styles.chartFill}
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className={styles.subjectsGrid}>
                        {Object.entries(subjectCounts).map(([subject, count]) => (
                            <div key={subject} className={styles.subjectStat}>
                                <div className={styles.subjectName}>{subject}</div>
                                <div className={styles.attendanceNumber}>{count}</div>
                                <div className={styles.attendanceLabel}>Present</div>
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            <div className={styles.footer}>
                <button onClick={loadReportsData} className={styles.refreshButton}>
                    🔄 Refresh Data
                </button>
                <span className={styles.lastUpdated}>Data updates in real-time</span>
            </div>
        </div>
    );
}