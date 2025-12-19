package com.lojalaluz.api.controller;

import com.lojalaluz.api.model.Order;
import com.lojalaluz.api.repository.OrderRepository;
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
    private final OrderRepository orderRepository;

    /**
     * Cria pagamento PIX para um pedido
     */
    @PostMapping("/pix/{orderNumber}")
    public ResponseEntity<Map<String, Object>> createPixPayment(@PathVariable String orderNumber) {
        log.info("Criando PIX para pedido: {}", orderNumber);
        
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado: " + orderNumber));
        
        Map<String, Object> result = paymentService.createPixPayment(order);
        
        if ((Boolean) result.get("success")) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.badRequest().body(result);
        }
    }

    /**
     * Consulta status de um pagamento
     */
    @GetMapping("/status/{paymentId}")
    public ResponseEntity<Map<String, Object>> getPaymentStatus(@PathVariable String paymentId) {
        Map<String, Object> result = paymentService.getPaymentStatus(paymentId);
        return ResponseEntity.ok(result);
    }

    /**
     * Webhook do Mercado Pago
     */
    @PostMapping("/webhook")
    public ResponseEntity<Void> handleWebhook(@RequestBody Map<String, Object> payload) {
        log.info("Webhook recebido: {}", payload);
        paymentService.processWebhook(payload);
        return ResponseEntity.ok().build();
    }
}
