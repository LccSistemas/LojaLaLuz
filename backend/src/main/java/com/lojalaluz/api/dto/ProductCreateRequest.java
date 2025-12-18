package com.lojalaluz.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class ProductCreateRequest {
    
    @NotBlank(message = "Nome é obrigatório")
    private String name;
    
    private String description;
    
    @NotNull(message = "Preço é obrigatório")
    @Positive(message = "Preço deve ser positivo")
    private BigDecimal price;
    
    private BigDecimal salePrice;
    
    private String sku;
    
    private Integer stockQuantity = 0;
    
    private Boolean featured = false;
    
    private String brand;
    
    private String material;
    
    private Long categoryId;
    
    private List<String> imageUrls;
    
    private List<ProductVariantDTO> variants;
}
