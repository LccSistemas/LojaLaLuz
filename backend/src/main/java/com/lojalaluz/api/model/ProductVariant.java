package com.lojalaluz.api.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "product_variants")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductVariant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String size; // PP, P, M, G, GG, XG

    @Column(nullable = false)
    private String color;

    private String colorCode; // Código hexadecimal da cor

    @Column(unique = true)
    private String sku;

    @Builder.Default
    private Integer stockQuantity = 0;

    private BigDecimal additionalPrice; // Preço adicional para esta variante

    @Builder.Default
    private Boolean active = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    public boolean isAvailable() {
        return active && stockQuantity > 0;
    }
}
