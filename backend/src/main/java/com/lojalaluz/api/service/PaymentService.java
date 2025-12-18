package com.lojalaluz.api.service;

import com.lojalaluz.api.model.Order;
import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.preference.*;
import com.mercadopago.resources.preference.Preference;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
public class PaymentService {

    @Value("${app.mercadopago.access-token}")
    private String accessToken;

    @Value("${cors.allowed-origins:http://localhost:4200}")
    private String frontendUrl;

    @PostConstruct
    public void init() {
        MercadoPagoConfig.setAccessToken(accessToken);
    }

    public String createPayment(Order order) {
        try {
            PreferenceClient client = new PreferenceClient();

            List<PreferenceItemRequest> items = new ArrayList<>();

            order.getItems().forEach(item -> {
                PreferenceItemRequest itemRequest = PreferenceItemRequest.builder()
                        .id(item.getId().toString())
                        .title(item.getProductName())
                        .description(item.getSize() != null ? 
                                "Tamanho: " + item.getSize() + " | Cor: " + item.getColor() : "")
                        .quantity(item.getQuantity())
                        .currencyId("BRL")
                        .unitPrice(item.getUnitPrice())
                        .build();
                items.add(itemRequest);
            });

            // Adicionar frete como item
            if (order.getShippingCost() != null && order.getShippingCost().compareTo(BigDecimal.ZERO) > 0) {
                PreferenceItemRequest shippingItem = PreferenceItemRequest.builder()
                        .id("shipping")
                        .title("Frete")
                        .quantity(1)
                        .currencyId("BRL")
                        .unitPrice(order.getShippingCost())
                        .build();
                items.add(shippingItem);
            }

            // URLs de retorno
            String baseUrl = frontendUrl.split(",")[0];
            PreferenceBackUrlsRequest backUrls = PreferenceBackUrlsRequest.builder()
                    .success(baseUrl + "/checkout/success?order=" + order.getOrderNumber())
                    .failure(baseUrl + "/checkout/failure?order=" + order.getOrderNumber())
                    .pending(baseUrl + "/checkout/pending?order=" + order.getOrderNumber())
                    .build();

            // Dados do comprador
            PreferencePayerRequest payer = PreferencePayerRequest.builder()
                    .name(order.getUser().getName())
                    .email(order.getUser().getEmail())
                    .build();

            PreferenceRequest preferenceRequest = PreferenceRequest.builder()
                    .items(items)
                    .payer(payer)
                    .backUrls(backUrls)
                    .autoReturn("approved")
                    .externalReference(order.getOrderNumber())
                    .notificationUrl(baseUrl + "/api/payments/webhook")
                    .build();

            Preference preference = client.create(preferenceRequest);
            
            order.setPaymentId(preference.getId());
            
            log.info("Pagamento criado para pedido {}: {}", order.getOrderNumber(), preference.getId());
            
            return preference.getInitPoint();
            
        } catch (Exception e) {
            log.error("Erro ao criar pagamento: {}", e.getMessage());
            // Em desenvolvimento, retornar URL mock
            return frontendUrl.split(",")[0] + "/checkout/mock-payment?order=" + order.getOrderNumber();
        }
    }

    public void processWebhook(String paymentId, String status) {
        log.info("Webhook recebido: paymentId={}, status={}", paymentId, status);
        // Processar webhook do Mercado Pago
        // Atualizar status do pedido conforme o pagamento
    }
}
