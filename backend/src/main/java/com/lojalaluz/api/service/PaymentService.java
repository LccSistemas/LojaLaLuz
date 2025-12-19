package com.lojalaluz.api.service;

import com.lojalaluz.api.model.Order;
import com.lojalaluz.api.model.PaymentStatus;
import com.lojalaluz.api.repository.OrderRepository;
import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.payment.PaymentClient;
import com.mercadopago.client.payment.PaymentCreateRequest;
import com.mercadopago.client.payment.PaymentPayerRequest;
import com.mercadopago.client.preference.*;
import com.mercadopago.resources.payment.Payment;
import com.mercadopago.resources.preference.Preference;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class PaymentService {

    private final OrderRepository orderRepository;

    @Value("${app.mercadopago.access-token}")
    private String accessToken;

    @Value("${cors.allowed-origins:http://localhost:4200}")
    private String frontendUrl;

    @Value("${app.backend-url:http://localhost:8080}")
    private String backendUrl;

    @PostConstruct
    public void init() {
        MercadoPagoConfig.setAccessToken(accessToken);
        log.info("Mercado Pago configurado");
    }

    /**
     * Cria pagamento PIX com QR Code
     */
    public Map<String, Object> createPixPayment(Order order) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            PaymentClient client = new PaymentClient();
            
            String payerEmail = order.getUser() != null ? 
                    order.getUser().getEmail() : 
                    order.getGuestEmail();
            
            PaymentPayerRequest payer = PaymentPayerRequest.builder()
                    .email(payerEmail)
                    .firstName(order.getShippingAddress().getRecipientName().split(" ")[0])
                    .build();

            PaymentCreateRequest paymentRequest = PaymentCreateRequest.builder()
                    .transactionAmount(order.getTotal())
                    .description("Pedido #" + order.getOrderNumber() + " - La Luz")
                    .paymentMethodId("pix")
                    .payer(payer)
                    .externalReference(order.getOrderNumber())
                    .dateOfExpiration(OffsetDateTime.now(ZoneOffset.UTC).plusHours(24))
                    .notificationUrl(backendUrl + "/api/payments/webhook")
                    .build();

            Payment payment = client.create(paymentRequest);
            
            String qrCode = payment.getPointOfInteraction().getTransactionData().getQrCode();
            String qrCodeBase64 = payment.getPointOfInteraction().getTransactionData().getQrCodeBase64();
            String ticketUrl = payment.getPointOfInteraction().getTransactionData().getTicketUrl();
            
            order.setPaymentId(payment.getId().toString());
            order.setPixQrCode(qrCode);
            order.setPixQrCodeBase64(qrCodeBase64);
            orderRepository.save(order);
            
            result.put("success", true);
            result.put("paymentId", payment.getId());
            result.put("qrCode", qrCode);
            result.put("qrCodeBase64", qrCodeBase64);
            result.put("ticketUrl", ticketUrl);
            result.put("expirationDate", payment.getDateOfExpiration());
            
            log.info("PIX criado para pedido {}: ID={}", order.getOrderNumber(), payment.getId());
            
        } catch (Exception e) {
            log.error("Erro ao criar PIX: {}", e.getMessage(), e);
            result.put("success", false);
            result.put("error", e.getMessage());
            
            if (accessToken.startsWith("TEST")) {
                log.warn("Usando dados de teste para PIX");
                result.put("success", true);
                result.put("qrCode", "00020126580014br.gov.bcb.pix0136test-pix-key-" + order.getOrderNumber());
                result.put("qrCodeBase64", null);
                result.put("ticketUrl", null);
                result.put("testMode", true);
            }
        }
        
        return result;
    }

    /**
     * Cria link de pagamento para cartão de crédito
     */
    public String createCardPayment(Order order) {
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

            String baseUrl = frontendUrl.split(",")[0];
            PreferenceBackUrlsRequest backUrls = PreferenceBackUrlsRequest.builder()
                    .success(baseUrl + "/pedido-confirmado/" + order.getOrderNumber())
                    .failure(baseUrl + "/checkout?error=payment_failed")
                    .pending(baseUrl + "/pedido-confirmado/" + order.getOrderNumber() + "?status=pending")
                    .build();

            String payerEmail = order.getUser() != null ? 
                    order.getUser().getEmail() : 
                    order.getGuestEmail();
            String payerName = order.getShippingAddress().getRecipientName();

            PreferencePayerRequest payer = PreferencePayerRequest.builder()
                    .name(payerName)
                    .email(payerEmail)
                    .build();

            List<PreferencePaymentMethodRequest> excludedMethods = List.of(
                    PreferencePaymentMethodRequest.builder().id("pix").build(),
                    PreferencePaymentMethodRequest.builder().id("bolbradesco").build()
            );

            PreferencePaymentMethodsRequest paymentMethods = PreferencePaymentMethodsRequest.builder()
                    .excludedPaymentMethods(excludedMethods)
                    .installments(6)
                    .build();

            PreferenceRequest preferenceRequest = PreferenceRequest.builder()
                    .items(items)
                    .payer(payer)
                    .backUrls(backUrls)
                    .autoReturn("approved")
                    .externalReference(order.getOrderNumber())
                    .notificationUrl(backendUrl + "/api/payments/webhook")
                    .paymentMethods(paymentMethods)
                    .build();

            Preference preference = client.create(preferenceRequest);
            
            order.setPaymentId(preference.getId());
            order.setPaymentUrl(preference.getInitPoint());
            orderRepository.save(order);
            
            log.info("Pagamento cartao criado para pedido {}: {}", order.getOrderNumber(), preference.getId());
            
            return preference.getInitPoint();
            
        } catch (Exception e) {
            log.error("Erro ao criar pagamento cartao: {}", e.getMessage(), e);
            String baseUrl = frontendUrl.split(",")[0];
            return baseUrl + "/pedido-confirmado/" + order.getOrderNumber() + "?mock=true";
        }
    }

    @Transactional
    public void processWebhook(Map<String, Object> payload) {
        try {
            String type = (String) payload.get("type");
            
            if ("payment".equals(type)) {
                @SuppressWarnings("unchecked")
                Map<String, Object> data = (Map<String, Object>) payload.get("data");
                String paymentId = String.valueOf(data.get("id"));
                
                PaymentClient client = new PaymentClient();
                Payment payment = client.get(Long.parseLong(paymentId));
                
                String orderNumber = payment.getExternalReference();
                String status = payment.getStatus();
                
                log.info("Webhook: Pedido {} - Status: {}", orderNumber, status);
                
                orderRepository.findByOrderNumber(orderNumber).ifPresent(order -> {
                    switch (status) {
                        case "approved":
                            order.setPaymentStatus(PaymentStatus.APPROVED);
                            log.info("Pagamento aprovado para pedido {}", orderNumber);
                            break;
                        case "pending":
                        case "in_process":
                            order.setPaymentStatus(PaymentStatus.PENDING);
                            break;
                        case "rejected":
                        case "cancelled":
                            order.setPaymentStatus(PaymentStatus.REJECTED);
                            log.warn("Pagamento rejeitado para pedido {}", orderNumber);
                            break;
                        case "refunded":
                            order.setPaymentStatus(PaymentStatus.REFUNDED);
                            break;
                    }
                    orderRepository.save(order);
                });
            }
        } catch (Exception e) {
            log.error("Erro ao processar webhook: {}", e.getMessage(), e);
        }
    }

    public Map<String, Object> getPaymentStatus(String paymentId) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            PaymentClient client = new PaymentClient();
            Payment payment = client.get(Long.parseLong(paymentId));
            
            result.put("success", true);
            result.put("status", payment.getStatus());
            result.put("statusDetail", payment.getStatusDetail());
            result.put("dateApproved", payment.getDateApproved());
            
        } catch (Exception e) {
            log.error("Erro ao consultar pagamento: {}", e.getMessage());
            result.put("success", false);
            result.put("error", e.getMessage());
        }
        
        return result;
    }
}
