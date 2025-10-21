import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import DashboardContent from './DashboardContent';
import styles from './Dashboard.module.css';

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [activeSection, setActiveSection] = useState('home');
    const [attendanceStats, setAttendanceStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch user data from localStorage or API
        const userData = JSON.parse(localStorage.getItem('user'));
        setUser(userData);
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:8080/api/dashboard/summary');
            if (response.ok) {
                const data = await response.json();
                setAttendanceStats(data);
            }
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const navigate = (section) => {
        setActiveSection(section);
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className={styles.dashboard}>
            <Sidebar
                user={user}
                navigate={navigate}
                active={activeSection}
                attendanceStats={attendanceStats}
            />
            <main className={styles.mainContent}>
                <DashboardContent
                    section={activeSection}
                    user={user}
                    attendanceStats={attendanceStats}
                    loading={loading}
                    onRefresh={fetchDashboardData}
                />
            </main>
        </div>
    );
}