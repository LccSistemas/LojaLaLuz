package com.lojalaluz.api.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "cart_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_id", nullable = false)
    private Cart cart;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "variant_id")
    private ProductVariant variant;

    @Min(value = 1, message = "Quantidade mínima é 1")
    @Builder.Default
    private Integer quantity = 1;

    @Column(precision = 10, scale = 2)
    private BigDecimal priceAtTime; // Preço no momento da adição

    public BigDecimal getUnitPrice() {
        BigDecimal basePrice = priceAtTime != null ? priceAtTime : product.getCurrentPrice();
        if (variant != null && variant.getAdditionalPrice() != null) {
            return basePrice.add(variant.getAdditionalPrice());
        }
        return basePrice;
    }

    public BigDecimal getSubtotal() {
        return getUnitPrice().multiply(BigDecimal.valueOf(quantity));
    }
}
