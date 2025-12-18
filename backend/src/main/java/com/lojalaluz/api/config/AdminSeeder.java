package com.lojalaluz.api.config;

import com.lojalaluz.api.model.User;
import com.lojalaluz.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Cria usuário admin em produção usando variáveis de ambiente
 * 
 * Variáveis de ambiente necessárias:
 * - ADMIN_EMAIL (padrão: admin@lojalaluz.com)
 * - ADMIN_PASSWORD (obrigatório em produção)
 * - ADMIN_NAME (padrão: Administrador)
 */
@Component
@Order(1)
@RequiredArgsConstructor
@Slf4j
public class AdminSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${ADMIN_EMAIL:admin@lojalaluz.com}")
    private String adminEmail;

    @Value("${ADMIN_PASSWORD:#{null}}")
    private String adminPassword;

    @Value("${ADMIN_NAME:Administrador}")
    private String adminName;

    @Override
    public void run(String... args) {
        // Verifica se já existe admin
        if (userRepository.existsByEmail(adminEmail)) {
            log.info("👤 Admin já existe: {}", adminEmail);
            return;
        }

        // Em produção, ADMIN_PASSWORD é obrigatório
        String password = adminPassword;
        if (password == null || password.isEmpty()) {
            // Fallback para desenvolvimento - senha padrão
            password = "Admin@LaLuz2024!";
            log.warn("⚠️ ADMIN_PASSWORD não definida, usando senha padrão para desenvolvimento");
        }

        // Valida força da senha
        if (!isStrongPassword(password)) {
            log.warn("⚠️ Senha do admin não atende os requisitos mínimos de segurança!");
        }

        User admin = User.builder()
                .name(adminName)
                .email(adminEmail)
                .password(passwordEncoder.encode(password))
                .role(User.Role.ADMIN)
                .active(true)
                .build();

        userRepository.save(admin);
        log.info("✅ Admin criado: {} / [SENHA CONFIGURADA VIA ENV]", adminEmail);
        log.info("🔐 Lembre-se de definir ADMIN_PASSWORD como variável de ambiente em produção!");
    }

    /**
     * Verifica se a senha é forte o suficiente
     * - Mínimo 8 caracteres
     * - Pelo menos uma letra maiúscula
     * - Pelo menos uma letra minúscula
     * - Pelo menos um número
     * - Pelo menos um caractere especial
     */
    private boolean isStrongPassword(String password) {
        if (password == null || password.length() < 8) {
            return false;
        }
        
        boolean hasUpper = password.chars().anyMatch(Character::isUpperCase);
        boolean hasLower = password.chars().anyMatch(Character::isLowerCase);
        boolean hasDigit = password.chars().anyMatch(Character::isDigit);
        boolean hasSpecial = password.chars().anyMatch(ch -> !Character.isLetterOrDigit(ch));
        
        return hasUpper && hasLower && hasDigit && hasSpecial;
    }
}
