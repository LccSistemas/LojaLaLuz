package com.lojalaluz.api.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String orderNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<OrderItem> items = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private OrderStatus status = OrderStatus.PENDING;

    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal subtotal;

    @Column(precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal shippingCost = BigDecimal.ZERO;

    @Column(precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal discount = BigDecimal.ZERO;

    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal total;

    // Dados de entrega
    @Embedded
    private ShippingAddress shippingAddress;

    // Dados de pagamento
    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    private String paymentId; // ID do Mercado Pago

    private String paymentUrl; // URL para pagamento

    private String trackingCode; // Código de rastreio

    private String notes; // Observações do cliente

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    private LocalDateTime paidAt;

    private LocalDateTime shippedAt;

    private LocalDateTime deliveredAt;

    public void addItem(OrderItem item) {
        items.add(item);
        item.setOrder(this);
    }

    public void calculateTotals() {
        this.subtotal = items.stream()
                .map(OrderItem::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        this.total = this.subtotal
                .add(this.shippingCost != null ? this.shippingCost : BigDecimal.ZERO)
                .subtract(this.discount != null ? this.discount : BigDecimal.ZERO);
    }

    @PrePersist
    public void generateOrderNumber() {
        if (this.orderNumber == null) {
            this.orderNumber = "LL" + System.currentTimeMillis();
        }
    }

    public enum OrderStatus {
        PENDING,           // Aguardando pagamento
        PAID,              // Pago
        PROCESSING,        // Em processamento
        SHIPPED,           // Enviado
        DELIVERED,         // Entregue
        CANCELLED,         // Cancelado
        REFUNDED           // Reembolsado
    }

    public enum PaymentMethod {
        PIX,
        CREDIT_CARD,
        DEBIT_CARD,
        BOLETO
    }

    public enum PaymentStatus {
        PENDING,
        APPROVED,
        REJECTED,
        REFUNDED,
        CANCELLED
    }
}
