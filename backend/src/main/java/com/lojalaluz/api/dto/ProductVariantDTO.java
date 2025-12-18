package com.lojalaluz.api.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class ProductVariantDTO {
    private Long id;
    private String size;
    private String color;
    private String colorCode;
    private String sku;
    private Integer stockQuantity;
    private BigDecimal additionalPrice;
    private Boolean active;
    private Boolean available;
}
