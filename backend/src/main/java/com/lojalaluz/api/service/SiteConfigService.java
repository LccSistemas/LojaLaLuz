package com.lojalaluz.api.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lojalaluz.api.model.SiteConfig;
import com.lojalaluz.api.repository.SiteConfigRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class SiteConfigService {

    private final SiteConfigRepository siteConfigRepository;
    private final ObjectMapper objectMapper;

    private static final String CONFIG_KEY = "site_settings";

    public Map<String, Object> getConfig() {
        return siteConfigRepository.findByKey(CONFIG_KEY)
                .map(SiteConfig::getValue)
                .orElse(getDefaultConfig());
    }

    @Transactional
    public Map<String, Object> saveConfig(Map<String, Object> config) {
        SiteConfig siteConfig = siteConfigRepository.findByKey(CONFIG_KEY)
                .orElse(SiteConfig.builder().key(CONFIG_KEY).build());
        
        siteConfig.setValue(config);
        siteConfigRepository.save(siteConfig);
        
        return config;
    }

    @Transactional
    public Map<String, Object> updateConfig(Map<String, Object> partialConfig) {
        Map<String, Object> currentConfig = getConfig();
        currentConfig.putAll(partialConfig);
        return saveConfig(currentConfig);
    }

    private Map<String, Object> getDefaultConfig() {
        Map<String, Object> config = new HashMap<>();
        
        // Store Info
        config.put("storeName", "La Luz");
        config.put("storeLogo", "");
        config.put("storeEmail", "contato@lojalaluz.com.br");
        config.put("storePhone", "(11) 99999-9999");
        config.put("storeWhatsapp", "5511999999999");
        config.put("storeAddress", "São Paulo, SP");
        config.put("storeCnpj", "");

        // Promo Bar
        config.put("promoBarText", "FRETE GRÁTIS PARA COMPRAS ACIMA DE R$ 299 | PARCELE EM ATÉ 6X SEM JUROS");
        config.put("promoBarActive", true);

        // Hero Section
        Map<String, Object> hero = new HashMap<>();
        hero.put("imageUrl", "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920");
        hero.put("title", "Summer Essentials");
        hero.put("subtitle", "Nova Coleção");
        hero.put("buttonText", "Comprar Agora");
        hero.put("buttonLink", "/produtos");
        hero.put("active", true);
        config.put("hero", hero);

        // Banner Split
        config.put("bannerSplit", java.util.List.of(
            Map.of(
                "imageUrl", "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800",
                "title", "Vestidos",
                "subtitle", "Coleção",
                "link", "/produtos?category=vestidos",
                "active", true
            ),
            Map.of(
                "imageUrl", "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800",
                "title", "Conjuntos",
                "subtitle", "Coleção",
                "link", "/produtos?category=conjuntos",
                "active", true
            )
        ));

        // Sale Banner
        Map<String, Object> saleBanner = new HashMap<>();
        saleBanner.put("imageUrl", "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920");
        saleBanner.put("title", "Até 50% OFF");
        saleBanner.put("subtitle", "Aproveite");
        saleBanner.put("buttonText", "Ver Sale");
        saleBanner.put("link", "/produtos?sale=true");
        saleBanner.put("active", true);
        config.put("saleBanner", saleBanner);

        // Features
        config.put("features", java.util.List.of(
            Map.of("icon", "shipping", "title", "Frete Grátis", "description", "Em compras acima de R$299", "active", true),
            Map.of("icon", "exchange", "title", "Troca Grátis", "description", "Primeira troca por nossa conta", "active", true),
            Map.of("icon", "secure", "title", "Compra Segura", "description", "Ambiente 100% protegido", "active", true),
            Map.of("icon", "installment", "title", "6x Sem Juros", "description", "Em todas as compras", "active", true)
        ));

        // Social Links
        config.put("socialLinks", java.util.List.of(
            Map.of("platform", "instagram", "url", "https://instagram.com/lojalaluz", "active", true),
            Map.of("platform", "facebook", "url", "https://facebook.com/lojalaluz", "active", false),
            Map.of("platform", "tiktok", "url", "https://tiktok.com/@lojalaluz", "active", false),
            Map.of("platform", "whatsapp", "url", "", "active", false)
        ));

        // Instagram Feed
        config.put("instagramUsername", "lojalaluz");
        config.put("instagramImages", java.util.List.of(
            "https://picsum.photos/400/400?random=1",
            "https://picsum.photos/400/400?random=2",
            "https://picsum.photos/400/400?random=3",
            "https://picsum.photos/400/400?random=4",
            "https://picsum.photos/400/400?random=5",
            "https://picsum.photos/400/400?random=6"
        ));

        // Shipping
        config.put("freeShippingMinimum", 299);
        config.put("defaultShippingCost", 19.9);

        // SEO
        config.put("metaTitle", "La Luz - Moda Feminina");
        config.put("metaDescription", "Descubra as últimas tendências em moda feminina. Vestidos, blusas, calças e muito mais.");

        // Payment
        config.put("pixEnabled", true);
        config.put("creditCardEnabled", true);
        config.put("boletoEnabled", false);

        return config;
    }
}
