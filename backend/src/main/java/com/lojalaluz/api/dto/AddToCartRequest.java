package com.lojalaluz.api.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AddToCartRequest {
    
    @NotNull(message = "ID do produto é obrigatório")
    private Long productId;
    
    private Long variantId;
    
    @Min(value = 1, message = "Quantidade mínima é 1")
    private Integer quantity = 1;
}
