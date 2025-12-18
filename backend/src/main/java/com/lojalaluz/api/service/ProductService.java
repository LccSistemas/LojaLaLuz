package com.lojalaluz.api.service;

import com.lojalaluz.api.dto.*;
import com.lojalaluz.api.exception.ResourceNotFoundException;
import com.lojalaluz.api.model.Category;
import com.lojalaluz.api.model.Product;
import com.lojalaluz.api.model.ProductImage;
import com.lojalaluz.api.model.ProductVariant;
import com.lojalaluz.api.repository.CategoryRepository;
import com.lojalaluz.api.repository.ProductRepository;
import com.lojalaluz.api.repository.ProductVariantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductVariantRepository variantRepository;

    public Page<ProductDTO> getAllProducts(Pageable pageable) {
        return productRepository.findByActiveTrue(pageable)
                .map(this::toDTO);
    }

    public ProductDTO getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado"));
        return toDTO(product);
    }

    public ProductDTO getProductBySlug(String slug) {
        Product product = productRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado"));
        return toDTO(product);
    }

    public Page<ProductDTO> getProductsByCategory(Long categoryId, Pageable pageable) {
        return productRepository.findByCategoryIdAndActiveTrue(categoryId, pageable)
                .map(this::toDTO);
    }

    public Page<ProductDTO> searchProducts(String query, Pageable pageable) {
        return productRepository.searchProducts(query, pageable)
                .map(this::toDTO);
    }

    public List<ProductDTO> getFeaturedProducts() {
        return productRepository.findFeaturedProducts().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public Page<ProductDTO> getProductsOnSale(Pageable pageable) {
        return productRepository.findProductsOnSale(pageable)
                .map(this::toDTO);
    }

    public List<String> getAllBrands() {
        return productRepository.findAllBrands();
    }

    @Transactional
    public ProductDTO createProduct(ProductCreateRequest request) {
        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .salePrice(request.getSalePrice())
                .sku(request.getSku())
                .stockQuantity(request.getStockQuantity())
                .featured(request.getFeatured())
                .brand(request.getBrand())
                .material(request.getMaterial())
                .active(true)
                .build();

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada"));
            product.setCategory(category);
        }

        // Adicionar imagens
        if (request.getImageUrls() != null) {
            for (int i = 0; i < request.getImageUrls().size(); i++) {
                ProductImage image = ProductImage.builder()
                        .url(request.getImageUrls().get(i))
                        .displayOrder(i)
                        .isPrimary(i == 0)
                        .build();
                product.addImage(image);
            }
        }

        // Adicionar variantes
        if (request.getVariants() != null) {
            for (ProductVariantDTO variantDTO : request.getVariants()) {
                ProductVariant variant = ProductVariant.builder()
                        .size(variantDTO.getSize())
                        .color(variantDTO.getColor())
                        .colorCode(variantDTO.getColorCode())
                        .sku(variantDTO.getSku())
                        .stockQuantity(variantDTO.getStockQuantity())
                        .additionalPrice(variantDTO.getAdditionalPrice())
                        .active(true)
                        .build();
                product.addVariant(variant);
            }
        }

        Product saved = productRepository.save(product);
        return toDTO(saved);
    }

    @Transactional
    public ProductDTO updateProduct(Long id, ProductCreateRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado"));

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setSalePrice(request.getSalePrice());
        product.setSku(request.getSku());
        product.setStockQuantity(request.getStockQuantity());
        product.setFeatured(request.getFeatured());
        product.setBrand(request.getBrand());
        product.setMaterial(request.getMaterial());

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada"));
            product.setCategory(category);
        }

        Product saved = productRepository.save(product);
        return toDTO(saved);
    }

    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado"));
        product.setActive(false);
        productRepository.save(product);
    }

    public List<ProductVariantDTO> getProductVariants(Long productId) {
        return variantRepository.findByProductId(productId).stream()
                .map(this::toVariantDTO)
                .collect(Collectors.toList());
    }

    private ProductDTO toDTO(Product product) {
        return ProductDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .slug(product.getSlug())
                .price(product.getPrice())
                .salePrice(product.getSalePrice())
                .currentPrice(product.getCurrentPrice())
                .onSale(product.isOnSale())
                .sku(product.getSku())
                .stockQuantity(product.getStockQuantity())
                .active(product.getActive())
                .featured(product.getFeatured())
                .brand(product.getBrand())
                .material(product.getMaterial())
                .categoryId(product.getCategory() != null ? product.getCategory().getId() : null)
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : null)
                .images(product.getImages().stream().map(this::toImageDTO).collect(Collectors.toList()))
                .variants(product.getVariants().stream().map(this::toVariantDTO).collect(Collectors.toList()))
                .build();
    }

    private ProductImageDTO toImageDTO(ProductImage image) {
        return ProductImageDTO.builder()
                .id(image.getId())
                .url(image.getUrl())
                .altText(image.getAltText())
                .displayOrder(image.getDisplayOrder())
                .isPrimary(image.getIsPrimary())
                .build();
    }

    private ProductVariantDTO toVariantDTO(ProductVariant variant) {
        return ProductVariantDTO.builder()
                .id(variant.getId())
                .size(variant.getSize())
                .color(variant.getColor())
                .colorCode(variant.getColorCode())
                .sku(variant.getSku())
                .stockQuantity(variant.getStockQuantity())
                .additionalPrice(variant.getAdditionalPrice())
                .active(variant.getActive())
                .available(variant.isAvailable())
                .build();
    }
}
