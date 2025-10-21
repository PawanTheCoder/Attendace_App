package com.example.backend.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "attendance", uniqueConstraints = {
		@UniqueConstraint(columnNames = { "student_id", "subject_id", "attendance_date" })
})
public class Attendance {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(optional = false)
	@JoinColumn(name = "student_id")
	private Student student;

	@ManyToOne(optional = false)
	@JoinColumn(name = "subject_id")
	private Subject subject;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private AttendanceStatus status = AttendanceStatus.ABSENT;

	@Column(name = "attendance_date", nullable = false)
	private LocalDate date; // For daily tracking

	@Column(name = "marked_at")
	private LocalDateTime markedAt; // when set to PRESENT

	@ManyToOne(optional = false)
	@JoinColumn(name = "marked_by")
	private User markedBy; // Which teacher marked the attendance

	@Column(name = "updated_at")
	private LocalDateTime updatedAt = LocalDateTime.now();

	@PreUpdate
	public void onUpdate() {
		this.updatedAt = LocalDateTime.now();
	}

	@PrePersist
	public void onCreate() {
		this.updatedAt = LocalDateTime.now();
		if (this.date == null) {
			this.date = LocalDate.now();
		}
	}

	// Constructors
	public Attendance() {
	}

	public Attendance(Student student, Subject subject, AttendanceStatus status, User markedBy) {
		this.student = student;
		this.subject = subject;
		this.status = status;
		this.markedBy = markedBy;
		this.date = LocalDate.now();
		if (status == AttendanceStatus.PRESENT) {
			this.markedAt = LocalDateTime.now();
		}
	}

	// Getters and Setters
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Student getStudent() {
		return student;
	}

	public void setStudent(Student student) {
		this.student = student;
	}

	public Subject getSubject() {
		return subject;
	}

	public void setSubject(Subject subject) {
		this.subject = subject;
	}

	public AttendanceStatus getStatus() {
		return status;
	}

	public void setStatus(AttendanceStatus status) {
		this.status = status;
		if (status == AttendanceStatus.PRESENT && this.markedAt == null) {
			this.markedAt = LocalDateTime.now();
		}
	}

	public LocalDate getDate() {
		return date;
	}

	public void setDate(LocalDate date) {
		this.date = date;
	}

	public LocalDateTime getMarkedAt() {
		return markedAt;
	}

	public void setMarkedAt(LocalDateTime markedAt) {
		this.markedAt = markedAt;
	}

	public User getMarkedBy() {
		return markedBy;
	}

	public void setMarkedBy(User markedBy) {
		this.markedBy = markedBy;
	}

	public LocalDateTime getUpdatedAt() {
		return updatedAt;
	}

	public void setUpdatedAt(LocalDateTime updatedAt) {
		this.updatedAt = updatedAt;
	}
}