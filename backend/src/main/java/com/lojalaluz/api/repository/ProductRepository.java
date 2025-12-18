package com.lojalaluz.api.repository;

import com.lojalaluz.api.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    
    Optional<Product> findBySlug(String slug);
    
    Optional<Product> findBySku(String sku);
    
    Page<Product> findByActiveTrue(Pageable pageable);
    
    Page<Product> findByCategoryIdAndActiveTrue(Long categoryId, Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE p.featured = true AND p.active = true")
    List<Product> findFeaturedProducts();
    
    @Query("SELECT p FROM Product p WHERE p.salePrice IS NOT NULL AND p.active = true")
    Page<Product> findProductsOnSale(Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE p.active = true AND " +
           "(LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Product> searchProducts(@Param("query") String query, Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE p.category.id = :categoryId AND p.active = true AND " +
           "p.price BETWEEN :minPrice AND :maxPrice")
    Page<Product> findByCategoryAndPriceRange(
            @Param("categoryId") Long categoryId,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            Pageable pageable);
    
    @Query("SELECT DISTINCT p.brand FROM Product p WHERE p.brand IS NOT NULL AND p.active = true")
    List<String> findAllBrands();
    
    @Query("SELECT p FROM Product p WHERE p.stockQuantity <= :threshold AND p.active = true")
    List<Product> findLowStockProducts(@Param("threshold") int threshold);
    
    @Query("SELECT p FROM Product p ORDER BY p.createdAt DESC")
    List<Product> findLatestProducts(Pageable pageable);
}
