export const API_BASE = 'http://localhost:8080/api';

// Generic API request with better error handling
async function apiRequest(path, options = {}) {
	const config = {
		headers: {
			'Content-Type': 'application/json',
			...options.headers,
		},
		credentials: 'include',
		...options,
	};

	try {
		const response = await fetch(`${API_BASE}${path}`, config);

		if (!response.ok) {
			// Try to get error message from response
			let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
			try {
				const errorData = await response.json();
				errorMessage = errorData.error || errorData.message || errorMessage;
			} catch {
				// If response is not JSON, use status text
			}
			throw new Error(errorMessage);
		}

		// For 204 No Content responses
		if (response.status === 204) {
			return null;
		}

		return await response.json();
	} catch (error) {
		console.error(`API Request failed for ${path}:`, error);
		throw error;
	}
}

// Specific HTTP methods
export async function apiPost(path, body) {
	return apiRequest(path, {
		method: 'POST',
		body: JSON.stringify(body),
	});
}

export async function apiGet(path) {
	return apiRequest(path, { method: 'GET' });
}

export async function apiPut(path, body) {
	return apiRequest(path, {
		method: 'PUT',
		body: JSON.stringify(body),
	});
}

export async function apiDelete(path) {
	return apiRequest(path, { method: 'DELETE' });
}

// Auth APIs
export const authAPI = {
	login: (credentials) => apiPost('/auth/login', credentials),
	register: (userData) => apiPost('/auth/register', userData),
	getProfile: (username) => apiGet(`/auth/profile?username=${username}`),
};

// Attendance APIs - UPDATED for new backend
export const attendanceAPI = {
	markAttendance: (attendanceData) =>
		apiPost('/attendance/mark', {
			studentId: String(attendanceData.studentId),
			subjectId: String(attendanceData.subjectId),
			status: attendanceData.status,
			teacherId: String(attendanceData.teacherId) // REQUIRED: Added teacherId
		}),

	getStudentAttendance: (studentId) =>
		apiGet(`/students/${studentId}/attendance`),

	getTodayAttendance: () => apiGet('/attendance/today'),

	getMyAttendance: (studentId) => apiGet(`/my-attendance?studentId=${studentId}`),
};

// Student APIs - UPDATED for new User model
export const studentAPI = {
	getAll: () => apiGet('/students'),
	getById: (studentId) => apiGet(`/users/${studentId}`),
};

// Subject APIs
export const subjectAPI = {
	getAll: () => apiGet('/subjects'),
	create: (subjectData) => apiPost('/subjects', subjectData),
	getById: (subjectId) => apiGet(`/subjects/${subjectId}`),
};

// Dashboard APIs
export const dashboardAPI = {
	getSummary: () => apiGet('/dashboard/summary'),
	getSubjectCounts: () => apiGet('/dashboard/subjectCounts'),
};

// User APIs - NEW for user management
export const userAPI = {
	getAllStudents: () => apiGet('/users/students'),
	getAllTeachers: () => apiGet('/users/teachers'),
	getUser: (userId) => apiGet(`/users/${userId}`),
	createUser: (userData) => apiPost('/users', userData),
};

// High-level helpers for backward compatibility
export async function login(username, password) {
	const response = await authAPI.login({ username, password });
	return response;
}

export async function listStudents() {
	return studentAPI.getAll();
}

export async function listSubjects() {
	return subjectAPI.getAll();
}

export async function markAttendance(studentId, subjectId, status, teacherId) {
	// UPDATED: Now requires teacherId
	if (!teacherId) {
		throw new Error('teacherId is required to mark attendance');
	}
	return attendanceAPI.markAttendance({
		studentId,
		subjectId,
		status,
		teacherId
	});
}

export async function getStudentAttendance(studentId) {
	return attendanceAPI.getStudentAttendance(studentId);
}

export async function getSubjectCounts() {
	return dashboardAPI.getSubjectCounts();
}

export async function getDashboardSummary() {
	return dashboardAPI.getSummary();
}

// Export everything
export default {
	// Core methods
	apiPost,
	apiGet,
	apiPut,
	apiDelete,

	// High-level helpers (legacy)
	login,
	listStudents,
	listSubjects,
	markAttendance,
	getStudentAttendance,
	getSubjectCounts,
	getDashboardSummary,

	// API groups (recommended)
	authAPI,
	attendanceAPI,
	studentAPI,
	subjectAPI,
	dashboardAPI,
	userAPI,
};