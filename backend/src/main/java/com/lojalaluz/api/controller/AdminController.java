package com.lojalaluz.api.controller;

import com.lojalaluz.api.dto.*;
import com.lojalaluz.api.model.Order;
import com.lojalaluz.api.model.User;
import com.lojalaluz.api.repository.OrderRepository;
import com.lojalaluz.api.repository.ProductRepository;
import com.lojalaluz.api.repository.UserRepository;
import com.lojalaluz.api.service.AuditService;
import com.lojalaluz.api.service.CategoryService;
import com.lojalaluz.api.service.OrderService;
import com.lojalaluz.api.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final ProductService productService;
    private final CategoryService categoryService;
    private final OrderService orderService;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final AuditService auditService;

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardDTO> getDashboard() {
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().atTime(LocalTime.MAX);
        LocalDateTime startOfMonth = LocalDate.now().withDayOfMonth(1).atStartOfDay();
        LocalDateTime startOfYear = LocalDate.now().withDayOfYear(1).atStartOfDay();

        DashboardDTO dashboard = DashboardDTO.builder()
                .totalOrders(orderRepository.count())
                .pendingOrders(orderRepository.countByStatus(Order.OrderStatus.PENDING))
                .totalProducts(productRepository.count())
                .totalCustomers(userRepository.count())
                .todayRevenue(orderRepository.getTotalRevenue(startOfDay, endOfDay))
                .monthRevenue(orderRepository.getTotalRevenue(startOfMonth, endOfDay))
                .yearRevenue(orderRepository.getTotalRevenue(startOfYear, endOfDay))
                .build();

        // Tratar valores nulos
        if (dashboard.getTodayRevenue() == null) dashboard.setTodayRevenue(BigDecimal.ZERO);
        if (dashboard.getMonthRevenue() == null) dashboard.setMonthRevenue(BigDecimal.ZERO);
        if (dashboard.getYearRevenue() == null) dashboard.setYearRevenue(BigDecimal.ZERO);

        return ResponseEntity.ok(dashboard);
    }

    @GetMapping("/products")
    public ResponseEntity<Page<ProductDTO>> getAllProducts(
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(productService.getAllProducts(pageable));
    }

    @GetMapping("/orders")
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderRepository.findAll());
    }

    @GetMapping("/orders/status/{status}")
    public ResponseEntity<List<Order>> getOrdersByStatus(@PathVariable Order.OrderStatus status) {
        return ResponseEntity.ok(orderRepository.findByStatus(status));
    }

    @PatchMapping("/orders/{id}/status")
    public ResponseEntity<OrderDTO> updateOrderStatus(
            @PathVariable Long id,
            @RequestBody java.util.Map<String, String> body) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));
        String oldStatus = order.getStatus().name();
        Order.OrderStatus newStatus = Order.OrderStatus.valueOf(body.get("status"));
        
        OrderDTO result = orderService.updateOrderStatus(id, newStatus);
        
        // Log de auditoria
        auditService.logOrderStatusChange(id, oldStatus, newStatus.name());
        
        return ResponseEntity.ok(result);
    }

    @PatchMapping("/orders/{id}/tracking")
    public ResponseEntity<Void> updateTrackingCode(
            @PathVariable Long id,
            @RequestParam String trackingCode) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));
        order.setTrackingCode(trackingCode);
        order.setStatus(Order.OrderStatus.SHIPPED);
        order.setShippedAt(LocalDateTime.now());
        orderRepository.save(order);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @GetMapping("/products/low-stock")
    public ResponseEntity<List<ProductDTO>> getLowStockProducts(@RequestParam(defaultValue = "10") int threshold) {
        return ResponseEntity.ok(
                productRepository.findLowStockProducts(threshold).stream()
                        .map(p -> ProductDTO.builder()
                                .id(p.getId())
                                .name(p.getName())
                                .sku(p.getSku())
                                .stockQuantity(p.getStockQuantity())
                                .build())
                        .toList()
        );
    }
}
