package com.lojalaluz.api.security;

import com.lojalaluz.api.model.User;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class SecurityUtils {

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof User) {
            return (User) authentication.getPrincipal();
        }
        return null;
    }

    public Long getCurrentUserId() {
        User user = getCurrentUser();
        return user != null ? user.getId() : null;
    }

    public boolean isAuthenticated() {
        return getCurrentUser() != null;
    }

    public boolean isAdmin() {
        User user = getCurrentUser();
        return user != null && user.getRole() == User.Role.ADMIN;
    }
}
