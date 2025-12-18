package com.lojalaluz.api.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class CartItemDTO {
    private Long id;
    private Long productId;
    private String productName;
    private String productSlug;
    private String imageUrl;
    private Long variantId;
    private String size;
    private String color;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal subtotal;
    private Integer maxQuantity;
}
