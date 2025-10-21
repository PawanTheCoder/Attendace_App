package com.example.backend.controller;

import com.example.backend.model.User;
import com.example.backend.model.UserRole;
import com.example.backend.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
	private final AuthService authService;

	public AuthController(AuthService authService) {
		this.authService = authService;
	}

	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
		try {
			String username = body.getOrDefault("username", "");
			String password = body.getOrDefault("password", "");

			if (username.isEmpty() || password.isEmpty()) {
				return ResponseEntity.badRequest().body(Map.of("error", "Username and password are required"));
			}

			User user = authService.loginOrRegister(username, password);
			return ResponseEntity.ok(Map.of(
					"id", user.getId(),
					"username", user.getUsername(),
					"role", user.getRole().name(),
					"name", user.getName() != null ? user.getName() : user.getUsername(),
					"email", user.getEmail() != null ? user.getEmail() : ""));
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
		}
	}

	@PostMapping("/register")
	public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
		try {
			String username = body.getOrDefault("username", "");
			String password = body.getOrDefault("password", "");
			String roleStr = body.getOrDefault("role", "STUDENT");
			String name = body.getOrDefault("name", username);
			String email = body.getOrDefault("email", "");

			UserRole role;
			try {
				role = UserRole.valueOf(roleStr.toUpperCase());
			} catch (IllegalArgumentException e) {
				return ResponseEntity.badRequest().body(Map.of("error", "Invalid role. Use TEACHER or STUDENT"));
			}

			User user = authService.register(username, password, role, name, email);
			return ResponseEntity.ok(Map.of(
					"id", user.getId(),
					"username", user.getUsername(),
					"role", user.getRole().name(),
					"name", user.getName(),
					"email", user.getEmail()));
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
		}
	}

	@GetMapping("/profile")
	public ResponseEntity<?> getProfile(@RequestParam String username) {
		try {
			User user = authService.findByUsername(username)
					.orElseThrow(() -> new RuntimeException("User not found"));
			return ResponseEntity.ok(Map.of(
					"id", user.getId(),
					"username", user.getUsername(),
					"role", user.getRole().name(),
					"name", user.getName(),
					"email", user.getEmail()));
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
		}
	}
}