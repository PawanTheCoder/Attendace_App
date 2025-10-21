import styles from './StudentCard.module.css'

export default function StudentCard({ student, onMark, subjectId, currentUser }) {
  const handleMarkAttendance = async (status) => {
    if (!subjectId) {
      alert('Please select a subject first');
      return;
    }
    if (!currentUser) {
      alert('User not authenticated');
      return;
    }

    try {
      await onMark(student.id, subjectId, status, currentUser.id);
    } catch (error) {
      console.error('Failed to mark attendance:', error);
      alert('Failed to mark attendance: ' + error.message);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.avatar}>
          {student.name?.charAt(0)?.toUpperCase() || student.username?.charAt(0)?.toUpperCase() || 'S'}
        </div>
        <div className={styles.studentInfo}>
          <div className={styles.name}>
            {student.name || student.username}
          </div>
          <div className={styles.username}>
            @{student.username}
          </div>
          {student.email && (
            <div className={styles.email}>
              {student.email}
            </div>
          )}
        </div>
      </div>

      <div className={styles.actions}>
        <button
          className={`${styles.actionButton} ${styles.present}`}
          onClick={() => handleMarkAttendance('PRESENT')}
          title="Mark as Present"
        >
          <span className={styles.buttonIcon}>✅</span>
          <span className={styles.buttonText}>Present</span>
        </button>
        <button
          className={`${styles.actionButton} ${styles.absent}`}
          onClick={() => handleMarkAttendance('ABSENT')}
          title="Mark as Absent"
        >
          <span className={styles.buttonIcon}>❌</span>
          <span className={styles.buttonText}>Absent</span>
        </button>
      </div>

      <div className={styles.footer}>
        <div className={styles.status}>
          Last updated: Just now
        </div>
      </div>
    </div>
  );
}