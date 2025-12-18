package com.lojalaluz.api.controller;

import com.lojalaluz.api.dto.CreateOrderRequest;
import com.lojalaluz.api.dto.GuestOrderRequest;
import com.lojalaluz.api.dto.OrderDTO;
import com.lojalaluz.api.model.Order;
import com.lojalaluz.api.security.SecurityUtils;
import com.lojalaluz.api.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final SecurityUtils securityUtils;

    @GetMapping
    public ResponseEntity<Page<OrderDTO>> getMyOrders(
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Long userId = securityUtils.getCurrentUserId();
        return ResponseEntity.ok(orderService.getUserOrders(userId, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDTO> getOrderById(@PathVariable Long id) {
        Long userId = securityUtils.getCurrentUserId();
        return ResponseEntity.ok(orderService.getOrderById(id, userId));
    }

    @GetMapping("/number/{orderNumber}")
    public ResponseEntity<OrderDTO> getOrderByNumber(@PathVariable String orderNumber) {
        return ResponseEntity.ok(orderService.getOrderByNumber(orderNumber));
    }

    @PostMapping
    public ResponseEntity<OrderDTO> createOrder(@Valid @RequestBody CreateOrderRequest request) {
        Long userId = securityUtils.getCurrentUserId();
        return ResponseEntity.ok(orderService.createOrder(userId, request));
    }

    /**
     * Endpoint para compra como convidado (guest checkout)
     * Não requer autenticação
     */
    @PostMapping("/guest")
    public ResponseEntity<OrderDTO> createGuestOrder(@Valid @RequestBody GuestOrderRequest request) {
        return ResponseEntity.ok(orderService.createGuestOrder(request));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OrderDTO> updateOrderStatus(
            @PathVariable Long id,
            @RequestParam Order.OrderStatus status) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, status));
    }
}
