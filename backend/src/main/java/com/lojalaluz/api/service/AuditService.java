package com.lojalaluz.api.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lojalaluz.api.model.AuditLog;
import com.lojalaluz.api.repository.AuditLogRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * Serviço de Auditoria para registrar todas as ações administrativas
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AuditService {

    private final AuditLogRepository auditLogRepository;
    private final ObjectMapper objectMapper;

    /**
     * Registra uma ação de auditoria de forma assíncrona
     */
    @Async
    public void logAction(String action, String entityType, Long entityId, Object details, AuditLog.AuditStatus status) {
        try {
            String userEmail = getCurrentUserEmail();
            String userName = getCurrentUserName();
            String ipAddress = getClientIP();
            String userAgent = getUserAgent();
            String detailsJson = details != null ? objectMapper.writeValueAsString(details) : null;

            AuditLog auditLog = AuditLog.builder()
                    .action(action)
                    .entityType(entityType)
                    .entityId(entityId)
                    .details(detailsJson)
                    .userEmail(userEmail)
                    .userName(userName)
                    .ipAddress(ipAddress)
                    .userAgent(userAgent)
                    .status(status)
                    .build();

            auditLogRepository.save(auditLog);
            
            log.info("📋 Audit: {} {} {} by {} from {}", 
                    action, entityType, entityId, userEmail, ipAddress);
        } catch (Exception e) {
            log.error("Erro ao salvar log de auditoria", e);
        }
    }

    /**
     * Métodos de conveniência
     */
    public void logCreate(String entityType, Long entityId, Object entity) {
        logAction("CREATE", entityType, entityId, entity, AuditLog.AuditStatus.SUCCESS);
    }

    public void logUpdate(String entityType, Long entityId, Object changes) {
        logAction("UPDATE", entityType, entityId, changes, AuditLog.AuditStatus.SUCCESS);
    }

    public void logDelete(String entityType, Long entityId, Object entity) {
        logAction("DELETE", entityType, entityId, entity, AuditLog.AuditStatus.SUCCESS);
    }

    public void logLogin(String userEmail, boolean success) {
        logAction("LOGIN", "USER", null, 
                Map.of("email", userEmail, "success", success),
                success ? AuditLog.AuditStatus.SUCCESS : AuditLog.AuditStatus.FAILURE);
    }

    public void logOrderStatusChange(Long orderId, String oldStatus, String newStatus) {
        logAction("STATUS_CHANGE", "ORDER", orderId,
                Map.of("oldStatus", oldStatus, "newStatus", newStatus),
                AuditLog.AuditStatus.SUCCESS);
    }

    public void logAdminAccess(String resource) {
        logAction("ACCESS", "ADMIN", null,
                Map.of("resource", resource),
                AuditLog.AuditStatus.SUCCESS);
    }

    /**
     * Consultas de auditoria
     */
    public Page<AuditLog> getAuditLogs(Pageable pageable) {
        return auditLogRepository.findAll(pageable);
    }

    public Page<AuditLog> getAuditLogsByUser(String userEmail, Pageable pageable) {
        return auditLogRepository.findByUserEmailOrderByCreatedAtDesc(userEmail, pageable);
    }

    public Page<AuditLog> getAuditLogsByEntity(String entityType, Pageable pageable) {
        return auditLogRepository.findByEntityTypeOrderByCreatedAtDesc(entityType, pageable);
    }

    public List<AuditLog> getEntityHistory(String entityType, Long entityId) {
        return auditLogRepository.findByEntity(entityType, entityId);
    }

    public List<AuditLog> getRecentLogs(int hours) {
        LocalDateTime since = LocalDateTime.now().minusHours(hours);
        return auditLogRepository.findByDateRange(since, LocalDateTime.now());
    }

    /**
     * Helpers
     */
    private String getCurrentUserEmail() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
            return auth.getName();
        }
        return "anonymous";
    }

    private String getCurrentUserName() {
        // Poderia buscar do UserDetails se necessário
        return null;
    }

    private String getClientIP() {
        try {
            ServletRequestAttributes attrs = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attrs != null) {
                HttpServletRequest request = attrs.getRequest();
                String xForwardedFor = request.getHeader("X-Forwarded-For");
                if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
                    return xForwardedFor.split(",")[0].trim();
                }
                return request.getRemoteAddr();
            }
        } catch (Exception e) {
            log.debug("Could not get client IP", e);
        }
        return "unknown";
    }

    private String getUserAgent() {
        try {
            ServletRequestAttributes attrs = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attrs != null) {
                return attrs.getRequest().getHeader("User-Agent");
            }
        } catch (Exception e) {
            log.debug("Could not get user agent", e);
        }
        return "unknown";
    }
}
