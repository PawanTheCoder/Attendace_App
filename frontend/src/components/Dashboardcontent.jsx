import { useState, useEffect } from 'react';
import Students from './Students';
import Attendance from './Attendance';
import Subjects from './Subjects';
import Reports from './Reports';
import Profile from './Profile';
import DashboardHome from './DashboardHome';
import styles from './DashboardContent.module.css';

export default function DashboardContent({ section, user, attendanceStats, loading, onRefresh }) {
    const renderSection = () => {
        switch (section) {
            case 'home':
                return (
                    <DashboardHome
                        user={user}
                        stats={attendanceStats}
                        loading={loading}
                        onRefresh={onRefresh}
                    />
                );
            case 'students':
                return <Students user={user} />;
            case 'attendance':
                return <Attendance user={user} />;
            case 'subjects':
                return <Subjects user={user} />;
            case 'reports':
                return <Reports user={user} />;
            case 'profile':
                return <Profile user={user} />;
            default:
                return <DashboardHome user={user} stats={attendanceStats} loading={loading} />;
        }
    };

    return (
        <div className={styles.dashboardContent}>
            {renderSection()}
        </div>
    );
}