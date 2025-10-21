package com.example.backend.repo;

import com.example.backend.model.Attendance;
import com.example.backend.model.AttendanceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

	// Find attendance by student, subject, and date (for daily tracking)
	Optional<Attendance> findByStudentIdAndSubjectIdAndDate(Long studentId, Long subjectId, LocalDate date);

	// Find all attendance for a student
	List<Attendance> findByStudentId(Long studentId);

	// Find attendance for a student within date range
	List<Attendance> findByStudentIdAndDateBetween(Long studentId, LocalDate start, LocalDate end);

	// Find today's attendance for a subject
	List<Attendance> findBySubjectIdAndDate(Long subjectId, LocalDate date);

	// Find all attendance for a specific date
	List<Attendance> findByDate(LocalDate date);

	// Method for automatic daily reset - UPDATED for new model
	@Modifying
	@Query("UPDATE Attendance a SET a.status = 'ABSENT' WHERE a.date = :date")
	void resetAttendanceForDate(@Param("date") LocalDate date);

	// Get today's attendance for dashboard - UPDATED for new model
	@Query("SELECT a FROM Attendance a WHERE a.date = CURRENT_DATE")
	List<Attendance> findTodayAttendance();

	// New methods for dashboard statistics
	@Query("SELECT COUNT(DISTINCT a.student) FROM Attendance a WHERE a.date = :date AND a.status = 'PRESENT'")
	Long countPresentStudentsByDate(@Param("date") LocalDate date);

	@Query("SELECT a.subject.name, COUNT(a) FROM Attendance a WHERE a.date = :date AND a.status = 'PRESENT' GROUP BY a.subject.name")
	List<Object[]> countAttendanceBySubjectAndDate(@Param("date") LocalDate date);

	// Find attendance by student and subject (without date) - for legacy support
	List<Attendance> findByStudentIdAndSubjectId(Long studentId, Long subjectId);

	// Additional useful queries
	List<Attendance> findByStudentIdAndStatusAndDate(Long studentId, AttendanceStatus status, LocalDate date);

	List<Attendance> findByStatusAndDate(AttendanceStatus status, LocalDate date);

	@Query("SELECT a FROM Attendance a WHERE a.student.id = :studentId ORDER BY a.date DESC")
	List<Attendance> findRecentAttendanceByStudentId(@Param("studentId") Long studentId);

	@Query("SELECT a FROM Attendance a WHERE a.date BETWEEN :startDate AND :endDate ORDER BY a.date DESC")
	List<Attendance> findAttendanceByDateRange(@Param("startDate") LocalDate startDate,
			@Param("endDate") LocalDate endDate);
}