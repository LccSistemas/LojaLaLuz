package com.lojalaluz.api.config;

import com.lojalaluz.api.model.*;
import com.lojalaluz.api.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@Profile("dev")
@RequiredArgsConstructor
@Slf4j
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            loadUsers();
        }
        if (categoryRepository.count() == 0) {
            loadCategories();
        }
        if (productRepository.count() == 0) {
            loadProducts();
        }
        log.info("✅ Dados de desenvolvimento carregados!");
    }

    private void loadUsers() {
        User admin = User.builder()
                .name("Administrador")
                .email("admin@lojalaluz.com")
                .password(passwordEncoder.encode("admin123"))
                .role(User.Role.ADMIN)
                .active(true)
                .build();

        User customer = User.builder()
                .name("Cliente Teste")
                .email("cliente@teste.com")
                .password(passwordEncoder.encode("cliente123"))
                .role(User.Role.CUSTOMER)
                .active(true)
                .build();

        userRepository.saveAll(List.of(admin, customer));
        log.info("👤 Usuários criados: admin@lojalaluz.com / admin123");
    }

    private void loadCategories() {
        Category feminino = Category.builder()
                .name("Feminino")
                .description("Moda feminina")
                .imageUrl("https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400")
                .build();

        Category masculino = Category.builder()
                .name("Masculino")
                .description("Moda masculina")
                .imageUrl("https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400")
                .build();

        Category acessorios = Category.builder()
                .name("Acessórios")
                .description("Bolsas, cintos, bijuterias")
                .imageUrl("https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=400")
                .build();

        categoryRepository.saveAll(List.of(feminino, masculino, acessorios));

        // Subcategorias
        Category vestidos = Category.builder()
                .name("Vestidos")
                .description("Vestidos femininos")
                .parent(feminino)
                .build();

        Category blusas = Category.builder()
                .name("Blusas")
                .description("Blusas e tops")
                .parent(feminino)
                .build();

        Category calcas = Category.builder()
                .name("Calças")
                .description("Calças femininas")
                .parent(feminino)
                .build();

        Category camisetas = Category.builder()
                .name("Camisetas")
                .description("Camisetas masculinas")
                .parent(masculino)
                .build();

        Category calcasMasc = Category.builder()
                .name("Calças")
                .description("Calças masculinas")
                .parent(masculino)
                .build();

        categoryRepository.saveAll(List.of(vestidos, blusas, calcas, camisetas, calcasMasc));
        log.info("📁 Categorias criadas");
    }

    private void loadProducts() {
        Category vestidos = categoryRepository.findBySlug("vestidos").orElse(null);
        Category blusas = categoryRepository.findBySlug("blusas").orElse(null);
        Category camisetas = categoryRepository.findBySlug("camisetas").orElse(null);

        // Produto 1 - Vestido
        Product vestido1 = Product.builder()
                .name("Vestido Floral Primavera")
                .description("Vestido leve e elegante com estampa floral, perfeito para dias ensolarados. Tecido confortável e fluido.")
                .price(new BigDecimal("189.90"))
                .salePrice(new BigDecimal("149.90"))
                .sku("VF001")
                .stockQuantity(50)
                .featured(true)
                .brand("La Luz")
                .material("Viscose")
                .category(vestidos)
                .build();

        ProductImage img1 = ProductImage.builder()
                .url("https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600")
                .isPrimary(true)
                .displayOrder(0)
                .build();
        vestido1.addImage(img1);

        ProductVariant v1 = ProductVariant.builder().size("P").color("Azul").colorCode("#3B82F6").stockQuantity(15).build();
        ProductVariant v2 = ProductVariant.builder().size("M").color("Azul").colorCode("#3B82F6").stockQuantity(20).build();
        ProductVariant v3 = ProductVariant.builder().size("G").color("Azul").colorCode("#3B82F6").stockQuantity(15).build();
        ProductVariant v4 = ProductVariant.builder().size("P").color("Rosa").colorCode("#EC4899").stockQuantity(10).build();
        ProductVariant v5 = ProductVariant.builder().size("M").color("Rosa").colorCode("#EC4899").stockQuantity(10).build();
        vestido1.addVariant(v1);
        vestido1.addVariant(v2);
        vestido1.addVariant(v3);
        vestido1.addVariant(v4);
        vestido1.addVariant(v5);

        // Produto 2 - Blusa
        Product blusa1 = Product.builder()
                .name("Blusa Cropped Básica")
                .description("Blusa cropped versátil, ideal para compor looks casuais ou para academia.")
                .price(new BigDecimal("79.90"))
                .sku("BC001")
                .stockQuantity(80)
                .featured(true)
                .brand("La Luz")
                .material("Algodão")
                .category(blusas)
                .build();

        ProductImage img2 = ProductImage.builder()
                .url("https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600")
                .isPrimary(true)
                .displayOrder(0)
                .build();
        blusa1.addImage(img2);

        ProductVariant bv1 = ProductVariant.builder().size("PP").color("Branco").colorCode("#FFFFFF").stockQuantity(20).build();
        ProductVariant bv2 = ProductVariant.builder().size("P").color("Branco").colorCode("#FFFFFF").stockQuantity(20).build();
        ProductVariant bv3 = ProductVariant.builder().size("M").color("Branco").colorCode("#FFFFFF").stockQuantity(20).build();
        ProductVariant bv4 = ProductVariant.builder().size("PP").color("Preto").colorCode("#000000").stockQuantity(20).build();
        blusa1.addVariant(bv1);
        blusa1.addVariant(bv2);
        blusa1.addVariant(bv3);
        blusa1.addVariant(bv4);

        // Produto 3 - Camiseta
        Product camiseta1 = Product.builder()
                .name("Camiseta Oversized Premium")
                .description("Camiseta oversized de algodão premium. Corte moderno e confortável.")
                .price(new BigDecimal("119.90"))
                .salePrice(new BigDecimal("89.90"))
                .sku("CO001")
                .stockQuantity(60)
                .featured(true)
                .brand("La Luz")
                .material("Algodão Premium")
                .category(camisetas)
                .build();

        ProductImage img3 = ProductImage.builder()
                .url("https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600")
                .isPrimary(true)
                .displayOrder(0)
                .build();
        camiseta1.addImage(img3);

        ProductVariant cv1 = ProductVariant.builder().size("M").color("Cinza").colorCode("#6B7280").stockQuantity(20).build();
        ProductVariant cv2 = ProductVariant.builder().size("G").color("Cinza").colorCode("#6B7280").stockQuantity(20).build();
        ProductVariant cv3 = ProductVariant.builder().size("GG").color("Cinza").colorCode("#6B7280").stockQuantity(20).build();
        camiseta1.addVariant(cv1);
        camiseta1.addVariant(cv2);
        camiseta1.addVariant(cv3);

        // Produto 4
        Product vestido2 = Product.builder()
                .name("Vestido Midi Elegante")
                .description("Vestido midi sofisticado para ocasiões especiais. Caimento perfeito.")
                .price(new BigDecimal("259.90"))
                .sku("VM001")
                .stockQuantity(30)
                .featured(false)
                .brand("La Luz Collection")
                .material("Crepe")
                .category(vestidos)
                .build();

        ProductImage img4 = ProductImage.builder()
                .url("https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600")
                .isPrimary(true)
                .displayOrder(0)
                .build();
        vestido2.addImage(img4);

        ProductVariant vv1 = ProductVariant.builder().size("P").color("Vinho").colorCode("#7C3AED").stockQuantity(10).build();
        ProductVariant vv2 = ProductVariant.builder().size("M").color("Vinho").colorCode("#7C3AED").stockQuantity(10).build();
        ProductVariant vv3 = ProductVariant.builder().size("G").color("Vinho").colorCode("#7C3AED").stockQuantity(10).build();
        vestido2.addVariant(vv1);
        vestido2.addVariant(vv2);
        vestido2.addVariant(vv3);

        // Produto 5
        Product blusa2 = Product.builder()
                .name("Blusa Manga Longa Clássica")
                .description("Blusa de manga longa em tecido leve, perfeita para meia estação.")
                .price(new BigDecimal("129.90"))
                .sku("BML001")
                .stockQuantity(45)
                .featured(false)
                .brand("La Luz")
                .material("Viscose")
                .category(blusas)
                .build();

        ProductImage img5 = ProductImage.builder()
                .url("https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=600")
                .isPrimary(true)
                .displayOrder(0)
                .build();
        blusa2.addImage(img5);

        // Produto 6
        Product camiseta2 = Product.builder()
                .name("Camiseta Estampada Urban")
                .description("Camiseta com estampa exclusiva, estilo urbano e moderno.")
                .price(new BigDecimal("99.90"))
                .sku("CEU001")
                .stockQuantity(70)
                .featured(true)
                .brand("La Luz Street")
                .material("Algodão")
                .category(camisetas)
                .build();

        ProductImage img6 = ProductImage.builder()
                .url("https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600")
                .isPrimary(true)
                .displayOrder(0)
                .build();
        camiseta2.addImage(img6);

        productRepository.saveAll(List.of(vestido1, blusa1, camiseta1, vestido2, blusa2, camiseta2));
        log.info("👗 Produtos criados");
    }
}
