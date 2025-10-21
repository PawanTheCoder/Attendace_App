import { useState, useEffect } from 'react';
import styles from './Sidebar.module.css';

export default function Sidebar({ user, navigate, active }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [attendanceStats, setAttendanceStats] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch attendance stats when user changes
  useEffect(() => {
    if (user?.role === 'TEACHER') {
      fetchAttendanceStats();
    }
  }, [user]);

  const fetchAttendanceStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/dashboard/summary');
      if (response.ok) {
        const data = await response.json();
        setAttendanceStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch attendance stats:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle navigation with API calls for specific sections
  const handleNavigation = async (sectionId) => {
    navigate(sectionId);

    // Refresh data when navigating to dashboard
    if (sectionId === 'home' && user?.role === 'TEACHER') {
      await fetchAttendanceStats();
    }
  };

  const menuItems = [
    { id: 'home', label: 'Dashboard', icon: '📊', roles: ['TEACHER', 'STUDENT'] },
    { id: 'students', label: 'Students', icon: '👨‍🎓', roles: ['TEACHER'] },
    { id: 'attendance', label: 'Attendance', icon: '✅', roles: ['TEACHER'] },
    { id: 'subjects', label: 'Subjects', icon: '📚', roles: ['TEACHER'] },
    { id: 'reports', label: 'Reports', icon: '📈', roles: ['TEACHER'] },
    { id: 'profile', label: 'Profile', icon: '👤', roles: ['TEACHER', 'STUDENT'] },
  ];

  const filteredItems = menuItems.filter(item =>
    item.roles.includes(user?.role)
  );

  // Calculate real attendance rate
  const calculateAttendanceRate = () => {
    if (!attendanceStats) return null;
    const { totalStudents, presentTotal } = attendanceStats;
    if (totalStudents > 0) {
      return Math.round((presentTotal / totalStudents) * 100);
    }
    return 0;
  };

  const attendanceRate = calculateAttendanceRate();

  return (
    <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.brand}>
          <span className={styles.logo}>✅</span>
          {!isCollapsed && <span className={styles.brandText}>Attendance Pro</span>}
        </div>
        <button
          className={styles.toggleButton}
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? '➡️' : '⬅️'}
        </button>
      </div>

      {/* User Info */}
      {!isCollapsed && (
        <div className={styles.userInfo}>
          <div className={styles.avatar}>
            {user?.name?.charAt(0)?.toUpperCase() || user?.username?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className={styles.userDetails}>
            <div className={styles.userName}>{user?.name || user?.username || 'User'}</div>
            <div className={styles.userRole}>{user?.role?.toLowerCase() || 'user'}</div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className={styles.nav}>
        {filteredItems.map(item => (
          <button
            key={item.id}
            className={`${styles.navItem} ${active === item.id ? styles.active : ''}`}
            onClick={() => handleNavigation(item.id)}
            title={isCollapsed ? item.label : ''}
          >
            <span className={styles.navIcon}>{item.icon}</span>
            {!isCollapsed && (
              <span className={styles.navLabel}>{item.label}</span>
            )}
            {active === item.id && !isCollapsed && (
              <div className={styles.activeIndicator}></div>
            )}
          </button>
        ))}
      </nav>

      {/* Refresh Button for Teachers */}
      {!isCollapsed && user?.role === 'TEACHER' && (
        <div className={styles.refreshSection}>
          <button
            className={styles.refreshButton}
            onClick={fetchAttendanceStats}
            disabled={loading}
          >
            <span className={styles.refreshIcon}>🔄</span>
            {!isCollapsed && (
              <span className={styles.refreshText}>
                {loading ? 'Refreshing...' : 'Refresh Stats'}
              </span>
            )}
          </button>
        </div>
      )}

      {/* Footer with Real Stats - Only for Teachers */}
      {!isCollapsed && user?.role === 'TEACHER' && (
        <div className={styles.footer}>
          <div className={styles.stats}>
            <div className={styles.statHeader}>
              <span className={styles.statTitle}>Today's Attendance</span>
              {attendanceStats && (
                <span className={styles.statUpdate}>Live</span>
              )}
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>
                {attendanceRate !== null ? `${attendanceRate}%` : '--%'}
              </span>
              <span className={styles.statLabel}>Overall Rate</span>
            </div>
            {attendanceStats && (
              <div className={styles.detailedStats}>
                <div className={styles.statDetail}>
                  <span className={`${styles.statDetailValue} ${styles.present}`}>
                    {attendanceStats.presentTotal || 0}
                  </span>
                  <span className={styles.statDetailLabel}>Present</span>
                </div>
                <div className={styles.statDetail}>
                  <span className={`${styles.statDetailValue} ${styles.absent}`}>
                    {attendanceStats.absentTotal || 0}
                  </span>
                  <span className={styles.statDetailLabel}>Absent</span>
                </div>
                <div className={styles.statDetail}>
                  <span className={styles.statDetailValue}>
                    {attendanceStats.totalStudents || 0}
                  </span>
                  <span className={styles.statDetailLabel}>Total</span>
                </div>
              </div>
            )}
            {loading && (
              <div className={styles.loadingStats}>Updating data...</div>
            )}
          </div>
        </div>
      )}

      {/* Simple Footer for Students */}
      {!isCollapsed && user?.role === 'STUDENT' && (
        <div className={styles.footer}>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statNumber}>🎓</span>
              <span className={styles.statLabel}>Student Portal</span>
            </div>
            <div className={styles.studentInfo}>
              <div className={styles.studentId}>ID: {user?.id}</div>
              <div className={styles.studentStatus}>Active</div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}