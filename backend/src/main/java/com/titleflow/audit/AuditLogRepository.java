package com.titleflow.audit;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    @EntityGraph(attributePaths = {
            "titleApplication",
            "actor"
    })
    List<AuditLog> findByTitleApplicationIdOrderByCreatedAtAsc(Long titleApplicationId);

    @EntityGraph(attributePaths = {
            "titleApplication",
            "actor"
    })
    List<AuditLog> findByActorIdOrderByCreatedAtDesc(Long actorId);
}