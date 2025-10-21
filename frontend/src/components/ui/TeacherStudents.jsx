import { useEffect, useState } from 'react';
import { apiGet, apiPost } from '../../api';
import Card from './Card.jsx';
import styles from './TeacherStudents.module.css';

export default function TeacherStudents() {
    const [students, setStudents] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [selectedSubjectId, setSelectedSubjectId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [marking, setMarking] = useState(null);
    const [attendanceStatus, setAttendanceStatus] = useState({});

    useEffect(() => {
        loadData();
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
            setSelectedSubjectId(subjectsData[0]?.id || null);
        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setLoading(false);
        }
    }

    async function mark(studentId, status) {
        if (!selectedSubjectId) {
            alert('Please select a subject first');
            return;
        }

        setMarking(studentId);
        try {
            await apiPost('/attendance/mark', {
                studentId: String(studentId),
                subjectId: String(selectedSubjectId),
                status
            });

            // Update local state for immediate feedback
            setAttendanceStatus(prev => ({
                ...prev,
                [studentId]: status
            }));

            // Show success feedback
            const student = students.find(s => s.id === studentId);
            // Removed the alert for better UX
        } catch (error) {
            console.error('Failed to mark attendance:', error);
            alert('Failed to update attendance');
        } finally {
            setMarking(null);
        }
    }

    const getStatusText = (studentId) => {
        return attendanceStatus[studentId] || 'Not marked';
    };

    const getStatusClass = (studentId) => {
        const status = attendanceStatus[studentId];
        if (status === 'PRESENT') return styles.statusPresent;
        if (status === 'ABSENT') return styles.statusAbsent;
        return styles.statusDefault;
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>
                    <div className={styles.spinner}></div>
                    <p>Loading students data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Student Management</h1>
                <p className={styles.subtitle}>Mark and manage student attendance</p>
            </div>

            <Card className={styles.card}>
                <div className={styles.controls}>
                    <div className={styles.subjectSelector}>
                        <label className={styles.label}>Select Subject:</label>
                        <select
                            value={selectedSubjectId || ''}
                            onChange={e => setSelectedSubjectId(Number(e.target.value))}
                            className={styles.select}
                        >
                            <option value="">Choose a subject...</option>
                            {subjects.map(s => (
                                <option key={s.id} value={s.id}>
                                    {s.name} ({s.code})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.stats}>
                        <span className={styles.stat}>
                            Total Students: <strong>{students.length}</strong>
                        </span>
                        <span className={styles.stat}>
                            Subjects: <strong>{subjects.length}</strong>
                        </span>
                    </div>
                </div>

                {students.length === 0 ? (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>👨‍🎓</div>
                        <h3>No Students Found</h3>
                        <p>There are no students registered in the system yet.</p>
                    </div>
                ) : (
                    <div className={styles.tableContainer}>
                        <table className={styles.table}>
                            <thead className={styles.tableHeader}>
                                <tr>
                                    <th className={styles.th}>Student ID</th>
                                    <th className={styles.th}>Username</th>
                                    <th className={styles.th}>Current Status</th>
                                    <th className={styles.th}>Actions</th>
                                </tr>
                            </thead>
                            <tbody className={styles.tableBody}>
                                {students.map(student => (
                                    <tr key={student.id} className={styles.tableRow}>
                                        <td className={styles.td}>
                                            <span className={styles.studentId}>#{student.id}</span>
                                        </td>
                                        <td className={styles.td}>
                                            <div className={styles.studentInfo}>
                                                <span className={styles.username}>{student.username}</span>
                                                {student.name && (
                                                    <span className={styles.name}>({student.name})</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className={styles.td}>
                                            <span className={`${styles.status} ${getStatusClass(student.id)}`}>
                                                {getStatusText(student.id)}
                                            </span>
                                        </td>
                                        <td className={styles.td}>
                                            <div className={styles.actions}>
                                                <button
                                                    className={`${styles.button} ${styles.presentButton}`}
                                                    onClick={() => mark(student.id, 'PRESENT')}
                                                    disabled={marking === student.id}
                                                    title="Mark as Present"
                                                >
                                                    {marking === student.id ? (
                                                        <div className={styles.buttonSpinner}></div>
                                                    ) : (
                                                        '✅ Present'
                                                    )}
                                                </button>
                                                <button
                                                    className={`${styles.button} ${styles.absentButton}`}
                                                    onClick={() => mark(student.id, 'ABSENT')}
                                                    disabled={marking === student.id}
                                                    title="Mark as Absent"
                                                >
                                                    {marking === student.id ? (
                                                        <div className={styles.buttonSpinner}></div>
                                                    ) : (
                                                        '❌ Absent'
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {selectedSubjectId && (
                    <div className={styles.footer}>
                        <p className={styles.footerText}>
                            💡 Select a student and mark their attendance for <strong>
                                {subjects.find(s => s.id === selectedSubjectId)?.name || 'selected subject'}
                            </strong>
                        </p>
                    </div>
                )}
            </Card>
        </div>
    );
}