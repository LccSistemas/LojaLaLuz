package com.lojalaluz.api.repository;

import com.lojalaluz.api.model.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long> {
    
    List<ProductVariant> findByProductId(Long productId);
    
    Optional<ProductVariant> findBySku(String sku);
    
    @Query("SELECT DISTINCT pv.size FROM ProductVariant pv WHERE pv.product.id = :productId AND pv.active = true")
    List<String> findAvailableSizesByProductId(@Param("productId") Long productId);
    
    @Query("SELECT DISTINCT pv.color FROM ProductVariant pv WHERE pv.product.id = :productId AND pv.active = true")
    List<String> findAvailableColorsByProductId(@Param("productId") Long productId);
    
    @Query("SELECT pv FROM ProductVariant pv WHERE pv.product.id = :productId AND pv.size = :size AND pv.color = :color")
    Optional<ProductVariant> findByProductIdAndSizeAndColor(
            @Param("productId") Long productId,
            @Param("size") String size,
            @Param("color") String color);
}
