package com.lojalaluz.api.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProductImageDTO {
    private Long id;
    private String url;
    private String altText;
    private Integer displayOrder;
    private Boolean isPrimary;
}
