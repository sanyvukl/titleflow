package com.titleflow.lien;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LienRepository extends JpaRepository<Lien, Long> {

    @EntityGraph(attributePaths = {
            "titleApplication",
            "lender",
            "titleApplication.dealer",
            "titleApplication.vehicle",
            "titleApplication.buyerOwner",
            "titleApplication.sellerOwner"
    })
    List<Lien> findByTitleApplicationIdOrderByCreatedAtDesc(Long titleApplicationId);

    @EntityGraph(attributePaths = {
            "titleApplication",
            "lender",
            "titleApplication.dealer",
            "titleApplication.vehicle",
            "titleApplication.buyerOwner",
            "titleApplication.sellerOwner"
    })
    List<Lien> findByLenderIdOrderByCreatedAtDesc(Long lenderId);

    @EntityGraph(attributePaths = {
            "titleApplication",
            "lender",
            "titleApplication.dealer",
            "titleApplication.vehicle",
            "titleApplication.buyerOwner",
            "titleApplication.sellerOwner"
    })
    Optional<Lien> findByIdAndTitleApplicationId(Long id, Long titleApplicationId);

    boolean existsByTitleApplicationIdAndStatus(Long titleApplicationId, LienStatus status);
}