package com.lojalaluz.api.dto;

import com.lojalaluz.api.model.Order;
import com.lojalaluz.api.model.PaymentStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class OrderDTO {
    private Long id;
    private String orderNumber;
    private Order.OrderStatus status;
    private PaymentStatus paymentStatus;
    private Order.PaymentMethod paymentMethod;
    private List<OrderItemDTO> items;
    private BigDecimal subtotal;
    private BigDecimal shippingCost;
    private BigDecimal discount;
    private BigDecimal total;
    private AddressDTO shippingAddress;
    private String trackingCode;
    private String notes;
    private String paymentUrl;
    private LocalDateTime createdAt;
    private LocalDateTime paidAt;
    private LocalDateTime shippedAt;
    private LocalDateTime deliveredAt;
}
