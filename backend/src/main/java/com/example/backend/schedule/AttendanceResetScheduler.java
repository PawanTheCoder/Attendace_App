package com.example.backend.schedule;

import com.example.backend.model.AttendanceStatus;
import com.example.backend.repo.AttendanceRepository;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.LocalDateTime;

@Component
@EnableScheduling
public class AttendanceResetScheduler {
	private final AttendanceRepository attendanceRepository;

	public AttendanceResetScheduler(AttendanceRepository attendanceRepository) {
		this.attendanceRepository = attendanceRepository;
	}

	// Run every 15 minutes
	@Scheduled(fixedRate = 15 * 60 * 1000)
	public void resetExpiredPresence() {
		LocalDateTime now = LocalDateTime.now();
		attendanceRepository.findAll().forEach(a -> {
			if (a.getStatus() == AttendanceStatus.PRESENT && a.getMarkedAt() != null) {
				if (Duration.between(a.getMarkedAt(), now).toHours() >= 12) {
					a.setStatus(AttendanceStatus.ABSENT);
					a.setMarkedAt(null);
					attendanceRepository.save(a);
				}
			}
		});
	}
}
