import { useEffect, useMemo, useState } from 'react';
import { apiGet } from '../../api';
import Card from './Card.jsx';
import Legend from './Legend.jsx';
import Loader from './Loader.jsx';
import styles from './TeacherDashboard.module.css';

export default function TeacherDashboard() {
	const [counts, setCounts] = useState({});
	const [subjects, setSubjects] = useState([]);
	const [summary, setSummary] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		const fetchDashboardData = async () => {
			try {
				setLoading(true);
				setError('');

				// Fetch all data in parallel
				const [countsData, subjectsData, summaryData] = await Promise.all([
					apiGet('/dashboard/subjectCounts'),
					apiGet('/subjects'),
					apiGet('/dashboard/summary')
				]);

				setCounts(countsData);
				setSubjects(subjectsData);
				setSummary(summaryData);
			} catch (err) {
				console.error('Failed to fetch dashboard data:', err);
				setError('Failed to load dashboard data. Please try again.');
			} finally {
				setLoading(false);
			}
		};

		fetchDashboardData();
	}, []);

	const chartData = useMemo(() => {
		return subjects.map(s => ({
			name: s.name,
			value: counts[s.name] || 0,
			color: colors[subjects.indexOf(s) % colors.length]
		}));
	}, [subjects, counts]);

	if (loading) {
		return (
			<div className={styles.loadingContainer}>
				<Loader text="Loading dashboard..." variant="pulse" size="large" />
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
			<div className={styles.header}>
				<h1 className={styles.title}>Teacher Dashboard</h1>
				<p className={styles.subtitle}>Overview of classroom attendance and performance</p>
			</div>

			<div className={styles.grid}>
				{/* Summary Stats - Full width at top */}
				<div className={styles.summarySection}>
					<Card title="Class Overview" className={styles.summaryCard}>
						<Summary summary={summary} />
					</Card>
				</div>

				{/* Middle row with chart and calendar */}
				<div className={styles.middleRow}>
					<Card title="Attendance by Subject" className={styles.chartCard}>
						<div className={styles.chartSection}>
							<PieChart data={chartData} />
							<div className={styles.legendSection}>
								<Legend
									items={chartData.map((d, i) => ({
										label: `${d.name}`,
										color: colors[i % colors.length],
										count: d.value
									}))}
									orientation="vertical"
									showCount={true}
									size="medium"
								/>
							</div>
						</div>
					</Card>

					<Card title="Today's Date" className={styles.calendarCard}>
						<div className={styles.calendarSection}>
							<input
								type="date"
								className={styles.datePicker}
								defaultValue={new Date().toISOString().split('T')[0]}
								onChange={(e) => console.log('Date changed:', e.target.value)}
							/>
							<div className={styles.currentDate}>
								<div className={styles.dateDisplay}>
									{new Date().toLocaleDateString('en-US', {
										weekday: 'long',
										year: 'numeric',
										month: 'long',
										day: 'numeric'
									})}
								</div>
								<div className={styles.timeDisplay}>
									{new Date().toLocaleTimeString('en-US', {
										hour: '2-digit',
										minute: '2-digit'
									})}
								</div>
							</div>
						</div>
					</Card>
				</div>

				{/* Quick Actions */}
				<Card title="Quick Actions" className={styles.actionsCard}>
					<div className={styles.actions}>
						<button className={styles.actionButton}>
							<span className={styles.actionIcon}>📊</span>
							<span className={styles.actionText}>View Reports</span>
						</button>
						<button className={styles.actionButton}>
							<span className={styles.actionIcon}>👥</span>
							<span className={styles.actionText}>Manage Students</span>
						</button>
						<button className={styles.actionButton}>
							<span className={styles.actionIcon}>📚</span>
							<span className={styles.actionText}>Subjects</span>
						</button>
						<button className={styles.actionButton}>
							<span className={styles.actionIcon}>✅</span>
							<span className={styles.actionText}>Mark Attendance</span>
						</button>
					</div>
				</Card>
			</div>

			{/* Recent Activity */}
			<Card title="Recent Activity" className={styles.activityCard}>
				<div className={styles.activityList}>
					<div className={styles.activityItem}>
						<span className={styles.activityIcon}>✅</span>
						<div className={styles.activityContent}>
							<span className={styles.activityText}>Attendance marked for Mathematics</span>
							<span className={styles.activityTime}>2 hours ago</span>
						</div>
					</div>
					<div className={styles.activityItem}>
						<span className={styles.activityIcon}>👤</span>
						<div className={styles.activityContent}>
							<span className={styles.activityText}>New student registered: John Doe</span>
							<span className={styles.activityTime}>5 hours ago</span>
						</div>
					</div>
					<div className={styles.activityItem}>
						<span className={styles.activityIcon}>📚</span>
						<div className={styles.activityContent}>
							<span className={styles.activityText}>Physics subject added to curriculum</span>
							<span className={styles.activityTime}>Yesterday</span>
						</div>
					</div>
				</div>
			</Card>
		</div>
	);
}

function PieChart({ data }) {
	const total = data.reduce((sum, d) => sum + d.value, 0) || 1;
	let acc = 0;

	return (
		<div className={styles.pieChartContainer}>
			<svg viewBox="0 0 32 32" width="160" height="160" className={styles.pieChart}>
				{data.map((d, i) => {
					const start = acc / total;
					acc += d.value;
					const end = acc / total;
					return (
						<Slice
							key={i}
							start={start}
							end={end}
							color={d.color}
							title={`${d.name}: ${d.value} students`}
						/>
					);
				})}
				{/* Center circle with total count */}
				<circle cx="16" cy="16" r="5" fill="white" />
				<text
					x="16"
					y="16"
					textAnchor="middle"
					dy="0.3em"
					fontSize="3"
					fill="#6b7280"
					fontWeight="600"
					className={styles.pieChartText}
				>
					{total}
				</text>
			</svg>
		</div>
	);
}

function polarToCartesian(cx, cy, r, angle) {
	const rad = (angle - 90) * Math.PI / 180.0;
	return { x: cx + (r * Math.cos(rad)), y: cy + (r * Math.sin(rad)) };
}

function describeArc(x, y, radius, startAngle, endAngle) {
	const start = polarToCartesian(x, y, radius, endAngle);
	const end = polarToCartesian(x, y, radius, startAngle);
	const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
	const d = [
		'M', start.x, start.y,
		'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y,
		'L', x, y,
		'Z'
	].join(' ');
	return d;
}

function Slice({ start, end, color, title }) {
	const startAngle = 360 * start;
	const endAngle = 360 * end;
	const d = describeArc(16, 16, 15.5, startAngle, endAngle);
	return (
		<path
			d={d}
			fill={color}
			stroke="#fff"
			strokeWidth="0.5"
			title={title}
			className={styles.pieSlice}
		/>
	);
}

function Summary({ summary }) {
	if (!summary) {
		return <Loader text="Loading summary..." />;
	}

	const attendanceRate = summary.totalStudents > 0
		? Math.round((summary.presentTotal / summary.totalStudents) * 100)
		: 0;

	return (
		<div className={styles.summary}>
			<div className={styles.summaryGrid}>
				<Stat label="Total Students" value={summary.totalStudents} icon="👥" />
				<Stat label="Subjects" value={summary.totalSubjects} icon="📚" />
				<Stat label="Present Today" value={summary.presentTotal} icon="✅" type="success" />
				<Stat label="Absent Today" value={summary.absentTotal} icon="❌" type="danger" />
			</div>
			<div className={styles.attendanceRate}>
				<div className={styles.rateContainer}>
					<div className={styles.rateCircle} style={{ '--rate': attendanceRate }}>
						{attendanceRate}%
					</div>
					<div className={styles.rateLabel}>Overall Attendance Rate</div>
				</div>
			</div>
		</div>
	);
}

function Stat({ label, value, icon, type = 'default' }) {
	return (
		<div className={`${styles.stat} ${styles[type]}`}>
			<div className={styles.statIcon}>{icon}</div>
			<div className={styles.statContent}>
				<div className={styles.statValue}>{value}</div>
				<div className={styles.statLabel}>{label}</div>
			</div>
		</div>
	);
}

const colors = ['#4f46e5', '#22c55e', '#ef4444', '#f59e0b', '#06b6d4', '#8b5cf6', '#ec4899', '#84cc16'];