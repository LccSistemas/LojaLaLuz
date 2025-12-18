package com.lojalaluz.api.config;

import com.lojalaluz.api.model.*;
import com.lojalaluz.api.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final ProductVariantRepository variantRepository;

    public DataSeeder(CategoryRepository categoryRepository,
                     ProductRepository productRepository,
                     ProductVariantRepository variantRepository) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.variantRepository = variantRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        // Only seed if database is empty
        if (categoryRepository.count() > 0) {
            return;
        }

        System.out.println("🌱 Seeding database with initial data...");

        // Create categories
        Category vestidos = createCategory("Vestidos", "vestidos", "Vestidos elegantes para todas as ocasiões");
        Category blusas = createCategory("Blusas", "blusas", "Blusas e tops modernos");
        Category calcas = createCategory("Calças", "calcas", "Calças e jeans de alta qualidade");
        Category saias = createCategory("Saias", "saias", "Saias para todos os estilos");
        Category acessorios = createCategory("Acessórios", "acessorios", "Acessórios para complementar seu look");
        Category novidades = createCategory("Novidades", "novidades", "Lançamentos da estação");

        // Create products
        createProduct(
            "Vestido Midi Floral",
            "vestido-midi-floral",
            "Um lindo vestido midi com estampa floral delicada, perfeito para dias de verão. Tecido leve e confortável.",
            new BigDecimal("299.90"),
            null,
            vestidos,
            Arrays.asList(
                "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800",
                "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800"
            ),
            Arrays.asList("P", "M", "G", "GG"),
            true,
            false
        );

        createProduct(
            "Vestido Longo Cetim",
            "vestido-longo-cetim",
            "Vestido longo em cetim premium com decote elegante. Ideal para eventos especiais e festas.",
            new BigDecimal("459.90"),
            new BigDecimal("399.90"),
            vestidos,
            Arrays.asList(
                "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800",
                "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800"
            ),
            Arrays.asList("P", "M", "G"),
            true,
            true
        );

        createProduct(
            "Blusa Cropped Ribana",
            "blusa-cropped-ribana",
            "Blusa cropped em ribana canelada, super versátil para looks casuais ou arrumados.",
            new BigDecimal("129.90"),
            null,
            blusas,
            Arrays.asList(
                "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=800"
            ),
            Arrays.asList("P", "M", "G", "GG"),
            true,
            false
        );

        createProduct(
            "Blusa Manga Bufante",
            "blusa-manga-bufante",
            "Blusa romântica com manga bufante e detalhes em renda. Perfeita para ocasiões especiais.",
            new BigDecimal("189.90"),
            new BigDecimal("159.90"),
            blusas,
            Arrays.asList(
                "https://images.unsplash.com/photo-1551048632-c5b2deff2e2c?w=800"
            ),
            Arrays.asList("P", "M", "G"),
            true,
            true
        );

        createProduct(
            "Calça Pantalona Alfaiataria",
            "calca-pantalona-alfaiataria",
            "Calça pantalona de alfaiataria premium. Caimento impecável e tecido de alta qualidade.",
            new BigDecimal("279.90"),
            null,
            calcas,
            Arrays.asList(
                "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800"
            ),
            Arrays.asList("36", "38", "40", "42", "44"),
            true,
            false
        );

        createProduct(
            "Jeans Wide Leg",
            "jeans-wide-leg",
            "Jeans wide leg de cintura alta em denim premium. Lavagem média atemporal.",
            new BigDecimal("249.90"),
            null,
            calcas,
            Arrays.asList(
                "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800"
            ),
            Arrays.asList("36", "38", "40", "42", "44"),
            true,
            false
        );

        createProduct(
            "Saia Midi Plissada",
            "saia-midi-plissada",
            "Saia midi plissada elegante, perfeita para compor looks sofisticados.",
            new BigDecimal("199.90"),
            new BigDecimal("169.90"),
            saias,
            Arrays.asList(
                "https://images.unsplash.com/photo-1583496661160-fb5886a0aeae?w=800"
            ),
            Arrays.asList("P", "M", "G"),
            true,
            true
        );

        createProduct(
            "Mini Saia Jeans",
            "mini-saia-jeans",
            "Mini saia em jeans com barra desfiada. Peça versátil e atemporal.",
            new BigDecimal("159.90"),
            null,
            saias,
            Arrays.asList(
                "https://images.unsplash.com/photo-1577900232427-18219b9166a0?w=800"
            ),
            Arrays.asList("36", "38", "40", "42"),
            true,
            false
        );

        createProduct(
            "Bolsa Estruturada Couro",
            "bolsa-estruturada-couro",
            "Bolsa estruturada em couro ecológico com alça removível. Design moderno e elegante.",
            new BigDecimal("349.90"),
            null,
            acessorios,
            Arrays.asList(
                "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800"
            ),
            Arrays.asList("Único"),
            true,
            false
        );

        createProduct(
            "Colar Dourado Minimalista",
            "colar-dourado-minimalista",
            "Colar dourado em aço inoxidável com pingente delicado. Banho de ouro 18k.",
            new BigDecimal("89.90"),
            null,
            acessorios,
            Arrays.asList(
                "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800"
            ),
            Arrays.asList("Único"),
            true,
            false
        );

        createProduct(
            "Conjunto Linho Premium",
            "conjunto-linho-premium",
            "Conjunto de blazer e calça em linho premium. Peça atemporal para ocasiões especiais.",
            new BigDecimal("599.90"),
            null,
            novidades,
            Arrays.asList(
                "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800"
            ),
            Arrays.asList("P", "M", "G", "GG"),
            true,
            true
        );

        createProduct(
            "Vestido Tricot Inverno",
            "vestido-tricot-inverno",
            "Vestido em tricot macio, perfeito para os dias mais frios. Conforto e elegância.",
            new BigDecimal("329.90"),
            new BigDecimal("279.90"),
            novidades,
            Arrays.asList(
                "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=800"
            ),
            Arrays.asList("P", "M", "G"),
            true,
            true
        );

        System.out.println("✅ Database seeded successfully with " + productRepository.count() + " products!");
    }

    private Category createCategory(String name, String slug, String description) {
        Category category = new Category();
        category.setName(name);
        category.setSlug(slug);
        category.setDescription(description);
        category.setActive(true);
        return categoryRepository.save(category);
    }

    private void createProduct(String name, String slug, String description,
                               BigDecimal price, BigDecimal salePrice,
                               Category category, List<String> imageUrls,
                               List<String> sizes, boolean active, boolean featured) {
        Product product = new Product();
        product.setName(name);
        product.setSlug(slug);
        product.setDescription(description);
        product.setPrice(price);
        product.setSalePrice(salePrice);
        product.setCategory(category);
        product.setActive(active);
        product.setFeatured(featured);
        
        // Create ProductImage entities
        List<ProductImage> images = new ArrayList<>();
        for (int i = 0; i < imageUrls.size(); i++) {
            ProductImage image = new ProductImage();
            image.setUrl(imageUrls.get(i));
            image.setAltText(name);
            image.setDisplayOrder(i);
            image.setIsPrimary(i == 0);
            image.setProduct(product);
            images.add(image);
        }
        product.setImages(images);
        
        Product savedProduct = productRepository.save(product);

        // Create variants for each size
        for (String size : sizes) {
            ProductVariant variant = new ProductVariant();
            variant.setProduct(savedProduct);
            variant.setSize(size);
            variant.setColor("Padrão");
            variant.setStockQuantity(10);
            variant.setSku(slug.toUpperCase().replace("-", "") + "-" + size);
            variantRepository.save(variant);
        }
    }
}
