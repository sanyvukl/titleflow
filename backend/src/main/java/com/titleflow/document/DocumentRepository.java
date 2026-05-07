package com.titleflow.document;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DocumentRepository extends JpaRepository<Document, Long> {

    @EntityGraph(attributePaths = {
            "titleApplication",
            "uploadedBy"
    })
    List<Document> findByTitleApplicationIdOrderByUploadedAtDesc(Long titleApplicationId);

    @EntityGraph(attributePaths = {
            "titleApplication",
            "uploadedBy"
    })
    Optional<Document> findByIdAndTitleApplicationId(Long id, Long titleApplicationId);

    @Override
    @EntityGraph(attributePaths = {
            "titleApplication",
            "uploadedBy"
    })
    Optional<Document> findById(Long id);
}