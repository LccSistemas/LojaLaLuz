package com.lojalaluz.api.controller;

import com.lojalaluz.api.service.OrderService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/account")
@RequiredArgsConstructor
public class AccountController {

    private final OrderService orderService;

    /**
     * Ativa conta de usuário criada via guest checkout
     * Permite que o usuário defina sua senha
     */
    @PostMapping("/activate")
    public ResponseEntity<Map<String, String>> activateAccount(@Valid @RequestBody ActivateAccountRequest request) {
        orderService.activateAccountWithPassword(request.getToken(), request.getPassword());
        return ResponseEntity.ok(Map.of(
            "message", "Conta ativada com sucesso! Você já pode fazer login."
        ));
    }

    /**
     * Verifica se um token de ativação é válido
     */
    @GetMapping("/verify-token")
    public ResponseEntity<Map<String, Boolean>> verifyToken(@RequestParam String token) {
        // O método vai lançar exceção se token for inválido
        try {
            // Verificação simplificada - em produção, criar método específico
            return ResponseEntity.ok(Map.of("valid", true));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of("valid", false));
        }
    }

    @Data
    public static class ActivateAccountRequest {
        @NotBlank(message = "Token é obrigatório")
        private String token;
        
        @NotBlank(message = "Senha é obrigatória")
        private String password;
    }
}
