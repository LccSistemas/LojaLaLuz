package com.lojalaluz.api.controller;

import com.lojalaluz.api.model.Order;
import com.lojalaluz.api.service.OrderService;
import com.lojalaluz.api.service.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@Slf4j
public class PaymentController {

    private final PaymentService paymentService;
    private final OrderService orderService;

    @PostMapping("/webhook")
    public ResponseEntity<Void> handleWebhook(@RequestBody Map<String, Object> payload) {
        log.info("Webhook recebido: {}", payload);
        
        try {
            String type = (String) payload.get("type");
            
            if ("payment".equals(type)) {
                Map<String, Object> data = (Map<String, Object>) payload.get("data");
                String paymentId = String.valueOf(data.get("id"));
                
                // Verificar status do pagamento
                // Em produção, buscar status via API do Mercado Pago
                String status = (String) payload.getOrDefault("status", "approved");
                
                Order.PaymentStatus paymentStatus = switch (status) {
                    case "approved" -> Order.PaymentStatus.APPROVED;
                    case "rejected" -> Order.PaymentStatus.REJECTED;
                    case "cancelled" -> Order.PaymentStatus.CANCELLED;
                    default -> Order.PaymentStatus.PENDING;
                };
                
                orderService.updatePaymentStatus(paymentId, paymentStatus);
            }
        } catch (Exception e) {
            log.error("Erro ao processar webhook: {}", e.getMessage());
        }
        
        return ResponseEntity.ok().build();
    }
}
