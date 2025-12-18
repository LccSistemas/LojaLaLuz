package com.lojalaluz.api.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class CartDTO {
    private Long id;
    private List<CartItemDTO> items;
    private BigDecimal subtotal;
    private Integer totalItems;
}
