package com.lojalaluz.api.config;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Rate Limiting Filter - Limita requisições por IP
 * - 100 requests por minuto para endpoints gerais
 * - 10 requests por minuto para login (proteção contra brute force)
 * - 20 requests por minuto para checkout
 */
@Component
@Order(1)
public class RateLimitingFilter implements Filter {

    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();
    private final Map<String, Bucket> loginBuckets = new ConcurrentHashMap<>();
    private final Map<String, Bucket> checkoutBuckets = new ConcurrentHashMap<>();

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        
        String clientIp = getClientIP(httpRequest);
        String path = httpRequest.getRequestURI();
        
        Bucket bucket;
        
        // Diferentes limites para diferentes endpoints
        if (path.contains("/auth/login")) {
            bucket = loginBuckets.computeIfAbsent(clientIp, this::createLoginBucket);
        } else if (path.contains("/checkout") || path.contains("/payments")) {
            bucket = checkoutBuckets.computeIfAbsent(clientIp, this::createCheckoutBucket);
        } else {
            bucket = buckets.computeIfAbsent(clientIp, this::createStandardBucket);
        }
        
        if (bucket.tryConsume(1)) {
            // Adiciona headers informativos
            httpResponse.addHeader("X-RateLimit-Remaining", String.valueOf(bucket.getAvailableTokens()));
            chain.doFilter(request, response);
        } else {
            httpResponse.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            httpResponse.setContentType("application/json");
            httpResponse.getWriter().write("{\"error\": \"Muitas requisições. Tente novamente em alguns segundos.\", \"code\": \"RATE_LIMIT_EXCEEDED\"}");
        }
    }

    private Bucket createStandardBucket(String key) {
        // 100 requests por minuto
        Bandwidth limit = Bandwidth.classic(100, Refill.greedy(100, Duration.ofMinutes(1)));
        return Bucket.builder().addLimit(limit).build();
    }

    private Bucket createLoginBucket(String key) {
        // 10 tentativas de login por minuto (proteção contra brute force)
        Bandwidth limit = Bandwidth.classic(10, Refill.greedy(10, Duration.ofMinutes(1)));
        return Bucket.builder().addLimit(limit).build();
    }

    private Bucket createCheckoutBucket(String key) {
        // 20 requisições de checkout por minuto
        Bandwidth limit = Bandwidth.classic(20, Refill.greedy(20, Duration.ofMinutes(1)));
        return Bucket.builder().addLimit(limit).build();
    }

    private String getClientIP(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        String xRealIP = request.getHeader("X-Real-IP");
        if (xRealIP != null && !xRealIP.isEmpty()) {
            return xRealIP;
        }
        return request.getRemoteAddr();
    }
}
