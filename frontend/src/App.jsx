import { useEffect, useState } from 'react'
import Header from './components/Header.jsx'
import Layout from './components/Layout.jsx'
import Auth from './components/Auth.jsx'
import TeacherDashboard from './components/ui/TeacherDashboard.jsx'
import TeacherStudents from './components/ui/TeacherStudents.jsx'
import TeacherAttendance from './components/ui/TeacherAttendance.jsx'
import TeacherSubjects from './components/ui/TeacherSubjects.jsx'
import TeacherReports from './components/ui/TeacherReports.jsx'
import Profile from './components/ui/Profile.jsx'
import StudentDashboard from './components/StudentDashboard.jsx'

export default function App() {
	const [user, setUser] = useState(null)
	const [route, setRoute] = useState('home')

	useEffect(() => {
		const saved = localStorage.getItem('user')
		if (saved) setUser(JSON.parse(saved))
	}, [])

	function onLogout() {
		localStorage.removeItem('user')
		setUser(null)
		setRoute('home')
	}

	// Handle routes with real components
	function renderContent() {
		if (!user) return null

		if (user.role === 'TEACHER') {
			switch (route) {
				case 'home':
					return <TeacherDashboard />
				case 'students':
					return <TeacherStudents />
				case 'attendance':
					return <TeacherAttendance user={user} />
				case 'subjects':
					return <TeacherSubjects />
				case 'reports':
					return <TeacherReports />
				case 'profile':
					return <Profile user={user} />
				default:
					return <TeacherDashboard />
			}
		} else {
			return <StudentDashboard user={user} />
		}
	}

	if (!user) {
		return <Auth onAuthed={(u) => { setUser(u); setRoute('home') }} />
	}

	return (
		<div>
			<Header user={user} onLogout={onLogout} navigate={setRoute} active={route} />
			<Layout user={user} active={route} navigate={setRoute}>
				{renderContent()}
			</Layout>
		</div>
	)
}