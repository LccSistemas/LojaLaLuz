package com.lojalaluz.api.repository;

import com.lojalaluz.api.model.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    Page<AuditLog> findByUserEmailOrderByCreatedAtDesc(String userEmail, Pageable pageable);

    Page<AuditLog> findByEntityTypeOrderByCreatedAtDesc(String entityType, Pageable pageable);

    Page<AuditLog> findByActionOrderByCreatedAtDesc(String action, Pageable pageable);

    @Query("SELECT a FROM AuditLog a WHERE a.createdAt BETWEEN :start AND :end ORDER BY a.createdAt DESC")
    List<AuditLog> findByDateRange(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT a FROM AuditLog a WHERE a.entityType = :entityType AND a.entityId = :entityId ORDER BY a.createdAt DESC")
    List<AuditLog> findByEntity(@Param("entityType") String entityType, @Param("entityId") Long entityId);

    // Estatísticas para dashboard admin
    @Query("SELECT a.action, COUNT(a) FROM AuditLog a WHERE a.createdAt >= :since GROUP BY a.action")
    List<Object[]> countByActionSince(@Param("since") LocalDateTime since);

    @Query("SELECT a.userEmail, COUNT(a) FROM AuditLog a WHERE a.createdAt >= :since GROUP BY a.userEmail ORDER BY COUNT(a) DESC")
    List<Object[]> countByUserSince(@Param("since") LocalDateTime since);
}
