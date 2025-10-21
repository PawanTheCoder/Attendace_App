package com.example.backend.controller;

import com.example.backend.model.*;
import com.example.backend.service.AttendanceService;
import com.example.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class AttendanceController {
	private final AttendanceService attendanceService;
	private final UserService userService;

	public AttendanceController(AttendanceService attendanceService,
			UserService userService) {
		this.attendanceService = attendanceService;
		this.userService = userService;
	}

	@GetMapping("/students")
	public List<User> listStudents() {
		return userService.getAllStudents();
	}

	@PostMapping("/attendance/mark")
	public ResponseEntity<?> mark(@RequestBody Map<String, String> body) {
		try {
			Long studentId = Long.valueOf(body.get("studentId"));
			Long subjectId = Long.valueOf(body.get("subjectId"));
			AttendanceStatus status = AttendanceStatus.valueOf(body.get("status"));
			Long teacherId = Long.valueOf(body.get("teacherId")); // Get teacher ID from request

			Attendance attendance = attendanceService.markAttendance(studentId, subjectId, status, teacherId);
			return ResponseEntity.ok(attendance);
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
		}
	}

	@GetMapping("/students/{studentId}/attendance")
	public ResponseEntity<?> studentAttendance(@PathVariable Long studentId) {
		try {
			List<Attendance> attendance = attendanceService.getStudentAttendance(studentId);
			return ResponseEntity.ok(attendance);
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
		}
	}

	@GetMapping("/attendance/today")
	public List<Attendance> getTodayAttendance() {
		return attendanceService.getTodayAttendance();
	}

	@GetMapping("/dashboard/subjectCounts")
	public Map<String, Long> subjectCounts() {
		return attendanceService.getTodaySubjectWiseCounts();
	}

	@GetMapping("/dashboard/summary")
	public Map<String, Object> summary() {
		return attendanceService.getDashboardSummary();
	}
}