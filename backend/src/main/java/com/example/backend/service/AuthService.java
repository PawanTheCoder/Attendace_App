package com.example.backend.service;

import com.example.backend.model.*;
import com.example.backend.repo.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class AuthService {
	private final UserRepository userRepository;

	public AuthService(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	@Transactional
	public User login(String username, String password) {
		Optional<User> userOpt = userRepository.findByUsername(username);

		if (userOpt.isPresent()) {
			User user = userOpt.get();
			// Simple password check (no hashing as requested)
			if (user.getPassword().equals(password)) {
				return user;
			} else {
				throw new RuntimeException("Invalid password");
			}
		} else {
			throw new RuntimeException("User not found");
		}
	}

	@Transactional
	public User register(String username, String password, UserRole role, String name, String email) {
		if (userRepository.existsByUsername(username)) {
			throw new RuntimeException("Username already exists");
		}

		User user = new User();
		user.setUsername(username);
		user.setPassword(password); // Stored as plain text (as requested)
		user.setRole(role);
		user.setName(name);
		user.setEmail(email);

		return userRepository.save(user);
	}

	@Transactional
	public User loginOrRegister(String username, String password) {
		Optional<User> userOpt = userRepository.findByUsername(username);

		if (userOpt.isPresent()) {
			// Login existing user
			User user = userOpt.get();
			if (user.getPassword().equals(password)) {
				return user;
			} else {
				throw new RuntimeException("Invalid password");
			}
		} else {
			// Auto-register new user as STUDENT
			User user = new User();
			user.setUsername(username);
			user.setPassword(password);
			user.setRole(UserRole.STUDENT);
			user.setName(username); // Use username as default name
			user.setEmail(username + "@student.edu"); // Default email

			return userRepository.save(user);
		}
	}

	public Optional<User> findByUsername(String username) {
		return userRepository.findByUsername(username);
	}
}