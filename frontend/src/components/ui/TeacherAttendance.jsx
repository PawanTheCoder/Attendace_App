import { useState, useEffect } from 'react';
import { apiGet, apiPost } from '../../api';
import Card from './Card.jsx';
import styles from './TeacherAttendance.module.css';

export default function TeacherAttendance({ user }) {
    const [students, setStudents] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [selectedSubjectId, setSelectedSubjectId] = useState('');
    const [attendance, setAttendance] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [todayRecords, setTodayRecords] = useState([]);

    useEffect(() => {
        loadData();
        fetchTodayAttendance();
    }, []);

    async function loadData() {
        try {
            setLoading(true);
            const [studentsData, subjectsData] = await Promise.all([
                apiGet('/students'),
                apiGet('/subjects')
            ]);
            setStudents(studentsData);
            setSubjects(subjectsData);
            if (subjectsData.length > 0) {
                setSelectedSubjectId(subjectsData[0].id);
            }
        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setLoading(false);
        }
    }

    async function fetchTodayAttendance() {
        try {
            const response = await apiGet('/attendance/today');
            setTodayRecords(response);
        } catch (error) {
            console.error('Failed to fetch today\'s attendance:', error);
        }
    }

    const handleAttendanceChange = (studentId, status) => {
        setAttendance(prev => ({
            ...prev,
            [studentId]: status
        }));
    };

    const submitAttendance = async () => {
        if (!selectedSubjectId) {
            alert('Please select a subject');
            return;
        }

        const attendanceEntries = Object.entries(attendance);
        if (attendanceEntries.length === 0) {
            alert('Please mark attendance for at least one student');
            return;
        }

        setSubmitting(true);
        try {
            const promises = attendanceEntries.map(([studentId, status]) =>
                apiPost('/attendance/mark', {
                    studentId: parseInt(studentId),
                    subjectId: parseInt(selectedSubjectId),
                    status: status,
                    teacherId: user.id
                })
            );

            await Promise.all(promises);
            alert(`Attendance marked successfully for ${attendanceEntries.length} students!`);
            setAttendance({});
            fetchTodayAttendance(); // Refresh today's records
        } catch (error) {
            console.error('Failed to submit attendance:', error);
            alert('Failed to submit attendance');
        } finally {
            setSubmitting(false);
        }
    };

    const getStudentStatus = (studentId) => {
        return attendance[studentId] || todayRecords.find(record =>
            record.studentId === studentId && record.subjectId === parseInt(selectedSubjectId)
        )?.status || 'NOT_MARKED';
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>
                    <div className={styles.spinner}></div>
                    <p>Loading attendance data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Mark Attendance</h1>
                <p className={styles.subtitle}>Record daily attendance for students</p>
            </div>

            <div className={styles.content}>
                <Card className={styles.controlCard}>
                    <div className={styles.controls}>
                        <div className={styles.subjectGroup}>
                            <label className={styles.label}>Select Subject:</label>
                            <select
                                value={selectedSubjectId}
                                onChange={(e) => setSelectedSubjectId(e.target.value)}
                                className={styles.select}
                            >
                                <option value="">Choose a subject...</option>
                                {subjects.map(subject => (
                                    <option key={subject.id} value={subject.id}>
                                        {subject.name} ({subject.code})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.stats}>
                            <div className={styles.stat}>
                                <span className={styles.statNumber}>{students.length}</span>
                                <span className={styles.statLabel}>Total Students</span>
                            </div>
                            <div className={styles.stat}>
                                <span className={styles.statNumber}>
                                    {Object.values(attendance).filter(status => status === 'PRESENT').length}
                                </span>
                                <span className={styles.statLabel}>Marked Present</span>
                            </div>
                        </div>

                        <button
                            onClick={submitAttendance}
                            disabled={submitting || !selectedSubjectId || Object.keys(attendance).length === 0}
                            className={styles.submitButton}
                        >
                            {submitting ? (
                                <>
                                    <div className={styles.buttonSpinner}></div>
                                    Submitting...
                                </>
                            ) : (
                                `Submit Attendance (${Object.keys(attendance).length})`
                            )}
                        </button>
                    </div>
                </Card>

                {selectedSubjectId && (
                    <Card className={styles.studentsCard}>
                        <h3 className={styles.sectionTitle}>
                            Students - {subjects.find(s => s.id === parseInt(selectedSubjectId))?.name}
                        </h3>

                        <div className={styles.studentsGrid}>
                            {students.map(student => {
                                const status = getStudentStatus(student.id);
                                return (
                                    <div key={student.id} className={styles.studentCard}>
                                        <div className={styles.studentInfo}>
                                            <div className={styles.avatar}>
                                                {student.username.charAt(0).toUpperCase()}
                                            </div>
                                            <div className={styles.studentDetails}>
                                                <div className={styles.studentName}>{student.username}</div>
                                                <div className={styles.studentId}>ID: {student.id}</div>
                                            </div>
                                        </div>

                                        <div className={styles.attendanceControls}>
                                            <button
                                                className={`${styles.statusButton} ${styles.present} ${attendance[student.id] === 'PRESENT' ? styles.active : ''
                                                    }`}
                                                onClick={() => handleAttendanceChange(student.id, 'PRESENT')}
                                            >
                                                ✅ Present
                                            </button>
                                            <button
                                                className={`${styles.statusButton} ${styles.absent} ${attendance[student.id] === 'ABSENT' ? styles.active : ''
                                                    }`}
                                                onClick={() => handleAttendanceChange(student.id, 'ABSENT')}
                                            >
                                                ❌ Absent
                                            </button>
                                        </div>

                                        <div className={styles.currentStatus}>
                                            <span className={`${styles.statusBadge} ${styles[status.toLowerCase()]}`}>
                                                {status.replace('_', ' ')}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
}