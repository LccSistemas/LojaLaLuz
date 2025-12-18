package com.lojalaluz.api.controller;

import com.lojalaluz.api.dto.AddToCartRequest;
import com.lojalaluz.api.dto.CartDTO;
import com.lojalaluz.api.security.SecurityUtils;
import com.lojalaluz.api.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;
    private final SecurityUtils securityUtils;

    @GetMapping
    public ResponseEntity<CartDTO> getCart(
            @RequestHeader(value = "X-Session-Id", required = false) String sessionId) {
        Long userId = securityUtils.getCurrentUserId();
        return ResponseEntity.ok(cartService.getCart(userId, sessionId));
    }

    @PostMapping("/items")
    public ResponseEntity<CartDTO> addToCart(
            @RequestHeader(value = "X-Session-Id", required = false) String sessionId,
            @Valid @RequestBody AddToCartRequest request) {
        Long userId = securityUtils.getCurrentUserId();
        return ResponseEntity.ok(cartService.addToCart(userId, sessionId, request));
    }

    @PatchMapping("/items/{itemId}")
    public ResponseEntity<CartDTO> updateCartItemQuantity(
            @RequestHeader(value = "X-Session-Id", required = false) String sessionId,
            @PathVariable Long itemId,
            @RequestParam Integer quantity) {
        Long userId = securityUtils.getCurrentUserId();
        return ResponseEntity.ok(cartService.updateCartItemQuantity(userId, sessionId, itemId, quantity));
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<CartDTO> removeFromCart(
            @RequestHeader(value = "X-Session-Id", required = false) String sessionId,
            @PathVariable Long itemId) {
        Long userId = securityUtils.getCurrentUserId();
        return ResponseEntity.ok(cartService.removeFromCart(userId, sessionId, itemId));
    }

    @DeleteMapping
    public ResponseEntity<Void> clearCart(
            @RequestHeader(value = "X-Session-Id", required = false) String sessionId) {
        Long userId = securityUtils.getCurrentUserId();
        cartService.clearCart(userId, sessionId);
        return ResponseEntity.noContent().build();
    }
}
