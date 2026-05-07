package com.titleflow.application;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface TitleApplicationRepository extends JpaRepository<TitleApplication, Long> {

    @EntityGraph(attributePaths = {
            "dealer",
            "vehicle",
            "buyerOwner",
            "sellerOwner"
    })
    List<TitleApplication> findByDealerIdOrderByCreatedAtDesc(Long dealerId);

    @EntityGraph(attributePaths = {
            "dealer",
            "vehicle",
            "buyerOwner",
            "sellerOwner"
    })
    Optional<TitleApplication> findByIdAndDealerId(Long id, Long dealerId);

    @EntityGraph(attributePaths = {
            "dealer",
            "vehicle",
            "buyerOwner",
            "sellerOwner"
    })
    List<TitleApplication> findByStatusOrderByCreatedAtAsc(TitleApplicationStatus status);

    @EntityGraph(attributePaths = {
            "dealer",
            "vehicle",
            "buyerOwner",
            "sellerOwner"
    })
    List<TitleApplication> findByStatusInOrderByCreatedAtAsc(Collection<TitleApplicationStatus> statuses);

    @Override
    @EntityGraph(attributePaths = {
            "dealer",
            "vehicle",
            "buyerOwner",
            "sellerOwner"
    })
    Optional<TitleApplication> findById(Long id);
}