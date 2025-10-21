package com.example.backend.config;

import com.example.backend.model.Subject;
import com.example.backend.model.User;
import com.example.backend.model.Student;
import com.example.backend.model.Attendance;
import com.example.backend.model.AttendanceStatus;
import com.example.backend.model.UserRole;
import com.example.backend.repo.SubjectRepository;
import com.example.backend.repo.UserRepository;
import com.example.backend.repo.StudentRepository;
import com.example.backend.repo.AttendanceRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Configuration
public class DataSeeder {

	@Bean
	CommandLineRunner seedData(SubjectRepository subjectRepository,
			UserRepository userRepository,
			StudentRepository studentRepository,
			AttendanceRepository attendanceRepository,
			PasswordEncoder passwordEncoder) {
		return args -> {
			// Seed Subjects (only if they don't exist)
			seedSubjects(subjectRepository);

			// Seed Users (only if no users exist)
			seedUsers(userRepository, studentRepository, passwordEncoder);

			// Seed sample attendance data for testing
			seedSampleAttendance(subjectRepository, studentRepository, userRepository, attendanceRepository);
		};
	}

	private void seedSubjects(SubjectRepository subjectRepository) {
		String[] subjectNames = { "Math", "Science", "English", "History", "Computer Science", "Physics" };
		String[] subjectCodes = { "MATH101", "SCI201", "ENG301", "HIS401", "CS501", "PHY601" };

		for (int i = 0; i < subjectNames.length; i++) {
			if (subjectRepository.findByName(subjectNames[i]).isEmpty()) {
				Subject subject = new Subject();
				subject.setName(subjectNames[i]);
				subject.setCode(subjectCodes[i]);
				subjectRepository.save(subject);
				System.out.println("Seeded subject: " + subjectNames[i]);
			}
		}
	}

	private void seedUsers(UserRepository userRepository, StudentRepository studentRepository,
			PasswordEncoder passwordEncoder) {
		// Only seed if no users exist
		if (userRepository.count() == 0) {
			// Create a teacher
			User teacher = new User();
			teacher.setUsername("teacher");
			teacher.setPassword(passwordEncoder.encode("teacher123"));
			teacher.setRole(UserRole.TEACHER);
			teacher.setName("John Smith");
			teacher.setEmail("teacher@school.edu");
			userRepository.save(teacher);
			System.out.println("Seeded teacher: teacher/teacher123");

			// Create sample students
			String[][] students = {
					{ "alice", "Alice Johnson", "alice@student.edu" },
					{ "bob", "Bob Brown", "bob@student.edu" },
					{ "carol", "Carol Davis", "carol@student.edu" },
					{ "david", "David Wilson", "david@student.edu" },
					{ "emma", "Emma Martinez", "emma@student.edu" }
			};

			for (String[] student : students) {
				User studentUser = new User();
				studentUser.setUsername(student[0]);
				studentUser.setPassword(passwordEncoder.encode("student123"));
				studentUser.setRole(UserRole.STUDENT);
				studentUser.setName(student[1]);
				studentUser.setEmail(student[2]);
				User saved = userRepository.save(studentUser);
				// also create Student row used by attendance
				Student s = new Student();
				s.setUsername(saved.getUsername());
				studentRepository.save(s);
				System.out.println("Seeded student: " + student[0] + "/student123");
			}
		} else {
			System.out.println("Users already exist, skipping user seeding");
		}
	}

	private void seedSampleAttendance(SubjectRepository subjectRepository,
			StudentRepository studentRepository,
			UserRepository userRepository,
			AttendanceRepository attendanceRepository) {
		// Only seed sample attendance if no attendance records exist
		if (attendanceRepository.count() == 0) {
			// Get teacher and students
			User teacher = userRepository.findByRole(UserRole.TEACHER).stream()
					.findFirst()
					.orElse(null);

			var students = studentRepository.findAll();
			var subjects = subjectRepository.findAll();

			if (teacher != null && !students.isEmpty() && !subjects.isEmpty()) {
				// Create some sample attendance for yesterday
				LocalDate yesterday = LocalDate.now().minusDays(1);

				for (Student student : students.subList(0, Math.min(3, students.size()))) {
					for (Subject subject : subjects.subList(0, Math.min(2, subjects.size()))) {
						Attendance attendance = new Attendance();
						attendance.setStudent(student);
						attendance.setSubject(subject);
						attendance.setStatus(AttendanceStatus.PRESENT);
						attendance.setDate(yesterday);
						attendance.setMarkedBy(teacher);
						attendance.setMarkedAt(LocalDateTime.now().minusDays(1));
						attendanceRepository.save(attendance);
					}
				}
				System.out.println("Seeded sample attendance data for testing");
			}
		} else {
			System.out.println("Attendance records already exist, skipping attendance seeding");
		}
	}
}