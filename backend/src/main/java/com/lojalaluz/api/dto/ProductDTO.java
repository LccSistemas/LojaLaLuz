package com.lojalaluz.api.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class ProductDTO {
    private Long id;
    private String name;
    private String description;
    private String slug;
    private BigDecimal price;
    private BigDecimal salePrice;
    private String sku;
    private Integer stockQuantity;
    private Boolean active;
    private Boolean featured;
    private String brand;
    private String material;
    private Long categoryId;
    private String categoryName;
    private List<ProductImageDTO> images;
    private List<ProductVariantDTO> variants;
    private Boolean onSale;
    private BigDecimal currentPrice;
}
