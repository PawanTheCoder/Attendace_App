package com.example.backend.repo;

import com.example.backend.model.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface SubjectRepository extends JpaRepository<Subject, Long> {
	Optional<Subject> findByName(String name);

	Optional<Subject> findByCode(String code);

	// New method for teacher dashboard
	@Query("SELECT s FROM Subject s ORDER BY s.name")
	List<Subject> findAllOrderedByName();
}