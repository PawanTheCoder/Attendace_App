import { useState } from 'react';
import { authAPI } from '../api'; // Use authAPI instead of login function
import styles from './Auth.module.css';

export default function Auth({ onAuthed }) {
	const [isLogin, setIsLogin] = useState(true);
	const [formData, setFormData] = useState({
		username: '',
		password: '',
		name: '',
		email: '',
		role: 'STUDENT'
	});
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	const handleInputChange = (field, value) => {
		setFormData(prev => ({
			...prev,
			[field]: value
		}));
		setError('');
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');

		// Basic validation
		if (!formData.username.trim() || !formData.password.trim()) {
			setError('Username and password are required');
			return;
		}

		setIsLoading(true);

		try {
			let response;

			if (isLogin) {
				// Login attempt
				response = await authAPI.login({
					username: formData.username,
					password: formData.password
				});
			} else {
				// Registration attempt
				response = await authAPI.register({
					username: formData.username,
					password: formData.password,
					role: formData.role,
					name: formData.name || formData.username,
					email: formData.email || `${formData.username}@student.edu`
				});
			}

			// Store user data from backend response
			const userData = {
				id: response.id,
				username: response.username,
				role: response.role,
				name: response.name || formData.username,
				email: response.email || ''
			};

			localStorage.setItem('user', JSON.stringify(userData));
			onAuthed(userData);

		} catch (err) {
			console.error('Login error:', err);
			setError(err.message || 'Authentication failed. Please check if the backend server is running.');
		} finally {
			setIsLoading(false);
		}
	};

	const switchMode = () => {
		setIsLogin(!isLogin);
		setError('');
		// Clear password but keep username for convenience
		setFormData(prev => ({
			...prev,
			password: '',
			name: '',
			email: ''
		}));
	};

	const fillDemoCredentials = (type) => {
		if (type === 'teacher') {
			setFormData(prev => ({
				...prev,
				username: 'teacher',
				password: 'teacher123'
			}));
		} else {
			setFormData(prev => ({
				...prev,
				username: 'alice',
				password: 'student123'
			}));
		}
		setError('');
	};

	return (
		<div className={styles.container}>
			{/* Background Decoration */}
			<div className={styles.background}>
				<div className={styles.shape1}></div>
				<div className={styles.shape2}></div>
				<div className={styles.shape3}></div>
			</div>

			{/* Main Card */}
			<div className={styles.card}>
				{/* Header */}
				<div className={styles.header}>
					<div className={styles.logo}>
						<span className={styles.logoIcon}>✅</span>
						<span className={styles.logoText}>Attendance Pro</span>
					</div>
					<h1 className={styles.title}>
						{isLogin ? 'Welcome Back' : 'Join Attendance System'}
					</h1>
					<p className={styles.subtitle}>
						{isLogin
							? 'Sign in to manage your classroom attendance'
							: 'Create an account to start tracking attendance'
						}
					</p>
				</div>

				{/* Demo Credentials Hint */}
				<div className={styles.demoSection}>
					<p className={styles.demoLabel}>Quick Access:</p>
					<div className={styles.demoButtons}>
						<button
							type="button"
							className={styles.demoButton}
							onClick={() => fillDemoCredentials('teacher')}
						>
							Teacher Demo
						</button>
						<button
							type="button"
							className={styles.demoButton}
							onClick={() => fillDemoCredentials('student')}
						>
							Student Demo
						</button>
					</div>
				</div>

				{/* Form */}
				<form onSubmit={handleSubmit} className={styles.form}>
					{/* Registration Fields */}
					{!isLogin && (
						<>
							<div className={styles.inputGroup}>
								<label className={styles.label}>Full Name</label>
								<input
									className={styles.input}
									type="text"
									placeholder="Enter your full name"
									value={formData.name}
									onChange={(e) => handleInputChange('name', e.target.value)}
									required={!isLogin}
								/>
							</div>

							<div className={styles.inputGroup}>
								<label className={styles.label}>Email</label>
								<input
									className={styles.input}
									type="email"
									placeholder="Enter your email"
									value={formData.email}
									onChange={(e) => handleInputChange('email', e.target.value)}
								/>
							</div>

							<div className={styles.inputGroup}>
								<label className={styles.label}>Account Type</label>
								<select
									className={styles.select}
									value={formData.role}
									onChange={(e) => handleInputChange('role', e.target.value)}
								>
									<option value="STUDENT">Student</option>
									<option value="TEACHER">Teacher</option>
								</select>
							</div>
						</>
					)}

					{/* Common Fields */}
					<div className={styles.inputGroup}>
						<label className={styles.label}>Username</label>
						<input
							className={styles.input}
							type="text"
							placeholder="Enter your username"
							value={formData.username}
							onChange={(e) => handleInputChange('username', e.target.value)}
							required
						/>
					</div>

					<div className={styles.inputGroup}>
						<label className={styles.label}>Password</label>
						<div className={styles.passwordContainer}>
							<input
								className={styles.input}
								type={showPassword ? 'text' : 'password'}
								placeholder="Enter your password"
								value={formData.password}
								onChange={(e) => handleInputChange('password', e.target.value)}
								required
								minLength={3}
							/>
							<button
								type="button"
								className={styles.passwordToggle}
								onClick={() => setShowPassword(!showPassword)}
							>
								{showPassword ? '🙈' : '👁️'}
							</button>
						</div>
					</div>

					{/* Submit Button */}
					<button
						className={`${styles.submitButton} ${isLoading ? styles.loading : ''}`}
						type="submit"
						disabled={isLoading}
					>
						{isLoading ? (
							<span className={styles.buttonContent}>
								<span className={styles.spinner}></span>
								{isLogin ? 'Signing In...' : 'Creating Account...'}
							</span>
						) : (
							isLogin ? 'Sign In' : 'Create Account'
						)}
					</button>

					{/* Error Message */}
					{error && (
						<div className={styles.error}>
							<span className={styles.errorIcon}>⚠️</span>
							{error}
						</div>
					)}
				</form>

				{/* Switch Mode */}
				<div className={styles.switchMode}>
					<p>
						{isLogin ? "Don't have an account?" : "Already have an account?"}
						<button
							type="button"
							className={styles.switchButton}
							onClick={switchMode}
						>
							{isLogin ? 'Sign Up' : 'Sign In'}
						</button>
					</p>
				</div>

				{/* Connection Status */}
				<div className={styles.connectionStatus}>
					<span className={styles.statusIcon}>
						{error && error.includes('backend') ? '🔴' : '🟢'}
					</span>
					{error && error.includes('backend')
						? 'Backend server not reachable'
						: 'Ready to connect'
					}
				</div>
			</div>
		</div>
	);
}