package com.lojalaluz.api.controller;

import com.lojalaluz.api.dto.AuthResponse;
import com.lojalaluz.api.dto.LoginRequest;
import com.lojalaluz.api.dto.RegisterRequest;
import com.lojalaluz.api.service.AuthService;
import com.lojalaluz.api.service.CartService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final CartService cartService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request,
            @RequestHeader(value = "X-Session-Id", required = false) String sessionId) {
        
        AuthResponse response = authService.login(request);
        
        // Mesclar carrinho de visitante com carrinho do usuário
        if (sessionId != null && !sessionId.isEmpty()) {
            cartService.mergeCart(sessionId, response.getUserId());
        }
        
        return ResponseEntity.ok(response);
    }
}
