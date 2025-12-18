package com.lojalaluz.api.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class CategoryDTO {
    private Long id;
    private String name;
    private String description;
    private String slug;
    private String imageUrl;
    private Boolean active;
    private Integer displayOrder;
    private Long parentId;
    private String parentName;
    private List<CategoryDTO> subcategories;
    private Integer productCount;
}
