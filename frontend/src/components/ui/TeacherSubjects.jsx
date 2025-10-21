import { useState, useEffect } from 'react';
import { apiGet, apiPost } from '../../api';
import Card from './Card.jsx';
import styles from './TeacherSubjects.module.css';

export default function TeacherSubjects() {
    const [subjects, setSubjects] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ name: '', code: '' });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchSubjects();
    }, []);

    const fetchSubjects = async () => {
        try {
            setLoading(true);
            const data = await apiGet('/subjects');
            setSubjects(data);
        } catch (error) {
            console.error('Failed to fetch subjects:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const newSubject = await apiPost('/subjects', formData);
            setSubjects(prev => [...prev, newSubject]);
            setFormData({ name: '', code: '' });
            setShowForm(false);
            // Removed alert for better UX
        } catch (error) {
            console.error('Failed to create subject:', error);
            alert('Failed to create subject');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>
                    <div className={styles.spinner}></div>
                    <p>Loading subjects...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Manage Subjects</h1>
                <p className={styles.subtitle}>Create and manage course subjects</p>
            </div>

            <div className={styles.content}>
                <Card className={styles.actionsCard}>
                    <div className={styles.actionsHeader}>
                        <h3 className={styles.sectionTitle}>Subjects ({subjects.length})</h3>
                        <button
                            onClick={() => setShowForm(true)}
                            className={styles.addButton}
                        >
                            + Add New Subject
                        </button>
                    </div>

                    {showForm && (
                        <div className={styles.form}>
                            <h4>Add New Subject</h4>
                            <form onSubmit={handleSubmit}>
                                <div className={styles.formGroup}>
                                    <label>Subject Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                        placeholder="e.g., Mathematics"
                                        required
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Subject Code</label>
                                    <input
                                        type="text"
                                        value={formData.code}
                                        onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                                        placeholder="e.g., MATH101"
                                        required
                                    />
                                </div>
                                <div className={styles.formActions}>
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className={styles.cancelButton}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className={styles.submitButton}
                                    >
                                        {submitting ? (
                                            <>
                                                <div className={styles.buttonSpinner}></div>
                                                Creating...
                                            </>
                                        ) : (
                                            'Create Subject'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </Card>

                {subjects.length === 0 ? (
                    <Card className={styles.emptyState}>
                        <div className={styles.emptyIcon}>📚</div>
                        <h3>No Subjects Found</h3>
                        <p>Get started by creating your first subject.</p>
                        <button
                            onClick={() => setShowForm(true)}
                            className={styles.addButton}
                        >
                            + Create First Subject
                        </button>
                    </Card>
                ) : (
                    <div className={styles.subjectsGrid}>
                        {subjects.map(subject => (
                            <Card key={subject.id} className={styles.subjectCard}>
                                <div className={styles.subjectHeader}>
                                    <h3 className={styles.subjectName}>{subject.name}</h3>
                                    <span className={styles.subjectCode}>{subject.code}</span>
                                </div>
                                <div className={styles.subjectDetails}>
                                    <div className={styles.detail}>
                                        <span className={styles.detailLabel}>Subject ID:</span>
                                        <span className={styles.detailValue}>#{subject.id}</span>
                                    </div>
                                    <div className={styles.detail}>
                                        <span className={styles.detailLabel}>Status:</span>
                                        <span className={styles.statusActive}>Active</span>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}