package com.example.backend.service;

import com.example.backend.model.*;
import com.example.backend.repo.AttendanceRepository;
import com.example.backend.repo.StudentRepository;
import com.example.backend.repo.UserRepository;
import com.example.backend.repo.SubjectRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AttendanceService {
	private final AttendanceRepository attendanceRepository;
	private final StudentRepository studentRepository;
	private final UserRepository userRepository;
	private final SubjectRepository subjectRepository;

	public AttendanceService(AttendanceRepository attendanceRepository,
			StudentRepository studentRepository,
			UserRepository userRepository,
			SubjectRepository subjectRepository) {
		this.attendanceRepository = attendanceRepository;
		this.studentRepository = studentRepository;
		this.userRepository = userRepository;
		this.subjectRepository = subjectRepository;
	}

	@Transactional
	public Attendance markAttendance(Long studentId, Long subjectId, AttendanceStatus status, Long teacherId) {
		LocalDate today = LocalDate.now();

		// Find existing attendance for today or create new
		Attendance attendance = attendanceRepository
				.findByStudentIdAndSubjectIdAndDate(studentId, subjectId, today)
				.orElseGet(() -> {
					Attendance a = new Attendance();
					Student student = studentRepository.findById(studentId)
							.orElseThrow(() -> new RuntimeException("Student not found"));
					Subject subject = subjectRepository.findById(subjectId)
							.orElseThrow(() -> new RuntimeException("Subject not found"));
					User teacher = userRepository.findById(teacherId)
							.orElseThrow(() -> new RuntimeException("Teacher not found"));

					a.setStudent(student);
					a.setSubject(subject);
					a.setMarkedBy(teacher);
					a.setDate(today);
					return a;
				});

		attendance.setStatus(status);
		if (status == AttendanceStatus.PRESENT) {
			attendance.setMarkedAt(LocalDateTime.now());
		} else {
			attendance.setMarkedAt(null);
		}

		return attendanceRepository.save(attendance);
	}

	public List<Attendance> getStudentAttendance(Long studentId) {
		return attendanceRepository.findByStudentId(studentId);
	}

	public List<Attendance> getStudentAttendanceByDateRange(Long studentId, LocalDate start, LocalDate end) {
		return attendanceRepository.findByStudentIdAndDateBetween(studentId, start, end);
	}

	public List<Attendance> getTodayAttendance() {
		return attendanceRepository.findByDate(LocalDate.now());
	}

	public Map<String, Long> getSubjectWiseCounts() {
		Map<String, Long> result = new HashMap<>();
		LocalDate today = LocalDate.now();

		subjectRepository.findAll().forEach(subject -> {
			Long presentCount = attendanceRepository.countPresentStudentsByDate(today);
			result.put(subject.getName(), presentCount != null ? presentCount : 0L);
		});
		return result;
	}

	public Map<String, Long> getTodaySubjectWiseCounts() {
		Map<String, Long> result = new HashMap<>();
		LocalDate today = LocalDate.now();

		List<Object[]> counts = attendanceRepository.countAttendanceBySubjectAndDate(today);
		for (Object[] count : counts) {
			String subjectName = (String) count[0];
			Long presentCount = (Long) count[1];
			result.put(subjectName, presentCount);
		}

		// Ensure all subjects are in the result, even with zero counts
		subjectRepository.findAll().forEach(subject -> {
			result.putIfAbsent(subject.getName(), 0L);
		});

		return result;
	}

	public Map<String, Object> getDashboardSummary() {
		long studentCount = userRepository.findByRole(UserRole.STUDENT).size();
		long subjectCount = subjectRepository.count();

		LocalDate today = LocalDate.now();
		Long presentTotal = attendanceRepository.countPresentStudentsByDate(today);

		Map<String, Object> res = new HashMap<>();
		res.put("totalStudents", studentCount);
		res.put("totalSubjects", subjectCount);
		res.put("presentTotal", presentTotal != null ? presentTotal : 0L);
		res.put("absentTotal", Math.max(0, studentCount - (presentTotal != null ? presentTotal : 0L)));
		res.put("perSubject", getTodaySubjectWiseCounts());

		return res;
	}

	@Transactional
	public void resetDailyAttendance() {
		LocalDate today = LocalDate.now();
		attendanceRepository.resetAttendanceForDate(today);
	}
}