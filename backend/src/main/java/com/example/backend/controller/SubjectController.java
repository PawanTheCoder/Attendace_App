package com.example.backend.controller;

import com.example.backend.model.Subject;
import com.example.backend.repo.SubjectRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/subjects")
public class SubjectController {
	private final SubjectRepository subjectRepository;

	public SubjectController(SubjectRepository subjectRepository) {
		this.subjectRepository = subjectRepository;
	}

	@GetMapping
	public List<Subject> getAllSubjects() {
		return subjectRepository.findAllOrderedByName();
	}

	@PostMapping
	public ResponseEntity<?> create(@RequestBody Map<String, String> body) {
		try {
			String name = body.getOrDefault("name", "").trim();
			String code = body.getOrDefault("code", "").trim();

			if (name.isEmpty()) {
				return ResponseEntity.badRequest().body(Map.of("error", "Name is required"));
			}

			if (subjectRepository.findByName(name).isPresent()) {
				return ResponseEntity.badRequest().body(Map.of("error", "Subject with this name already exists"));
			}

			if (!code.isEmpty() && subjectRepository.findByCode(code).isPresent()) {
				return ResponseEntity.badRequest().body(Map.of("error", "Subject with this code already exists"));
			}

			Subject subject = new Subject();
			subject.setName(name);
			subject.setCode(code.isEmpty() ? null : code);

			return ResponseEntity.ok(subjectRepository.save(subject));
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
		}
	}

	@GetMapping("/{id}")
	public ResponseEntity<?> getSubject(@PathVariable Long id) {
		return subjectRepository.findById(id)
				.map(ResponseEntity::ok)
				.orElse(ResponseEntity.notFound().build());
	}
}