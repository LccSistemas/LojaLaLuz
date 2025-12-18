package com.lojalaluz.api.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * Entidade para registrar logs de auditoria de ações administrativas
 */
@Entity
@Table(name = "audit_logs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String action; // CREATE, UPDATE, DELETE, LOGIN, etc.

    @Column(nullable = false)
    private String entityType; // PRODUCT, ORDER, CATEGORY, USER, etc.

    private Long entityId;

    @Column(length = 2000)
    private String details; // JSON com detalhes da ação

    @Column(nullable = false)
    private String userEmail;

    private String userName;

    @Column(nullable = false)
    private String ipAddress;

    private String userAgent;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AuditStatus status;

    public enum AuditStatus {
        SUCCESS, FAILURE, WARNING
    }
}
