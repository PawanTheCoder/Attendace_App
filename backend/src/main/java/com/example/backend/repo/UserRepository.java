package com.example.backend.repo;

import com.example.backend.model.User;
import com.example.backend.model.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
	Optional<User> findByUsername(String username);

	// FIXED: Use UserRole enum instead of String
	List<User> findByRole(UserRole role);

	boolean existsByUsername(String username);

	// New methods for user management
	@Query("SELECT u FROM User u WHERE u.role = 'STUDENT' ORDER BY u.name")
	List<User> findAllStudents();

	@Query("SELECT u FROM User u WHERE u.role = 'TEACHER' ORDER BY u.name")
	List<User> findAllTeachers();
}