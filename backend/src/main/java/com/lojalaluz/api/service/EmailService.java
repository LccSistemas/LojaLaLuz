package com.lojalaluz.api.service;

import com.lojalaluz.api.model.Order;
import com.lojalaluz.api.model.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    @Value("${app.frontend-url:http://localhost:4200}")
    private String frontendUrl;

    /**
     * Envia email de confirmação de pedido para usuário já cadastrado
     */
    public void sendOrderConfirmation(User user, Order order) {
        String subject = "Pedido #" + order.getOrderNumber() + " confirmado - La Luz";
        String body = buildOrderConfirmationEmail(user, order, false);
        
        // Em produção, integrar com serviço de email (SendGrid, Amazon SES, etc)
        log.info("=== EMAIL DE CONFIRMAÇÃO DE PEDIDO ===");
        log.info("Para: {}", user.getEmail());
        log.info("Assunto: {}", subject);
        log.info("Corpo: {}", body);
        log.info("=====================================");
        
        // TODO: Implementar envio real de email
        // sendEmail(user.getEmail(), subject, body);
    }

    /**
     * Envia email de confirmação com magic link para ativação de conta
     */
    public void sendOrderConfirmationWithActivation(User user, Order order) {
        String activationUrl = frontendUrl + "/activate-account?token=" + user.getActivationToken();
        String subject = "Pedido #" + order.getOrderNumber() + " confirmado + Ative sua conta - La Luz";
        String body = buildOrderConfirmationEmail(user, order, true) + 
                "\n\n" +
                "🎉 ATIVE SUA CONTA E GANHE BENEFÍCIOS!\n\n" +
                "Uma conta foi criada automaticamente para você. Ative-a para:\n" +
                "• Acompanhar seus pedidos\n" +
                "• Salvar endereços para compras futuras\n" +
                "• Acessar ofertas exclusivas\n\n" +
                "Clique no link abaixo para criar sua senha e ativar sua conta:\n" +
                activationUrl + "\n\n" +
                "Este link é válido por 7 dias.";
        
        log.info("=== EMAIL DE CONFIRMAÇÃO COM ATIVAÇÃO ===");
        log.info("Para: {}", user.getEmail());
        log.info("Assunto: {}", subject);
        log.info("Corpo: {}", body);
        log.info("Link de ativação: {}", activationUrl);
        log.info("==========================================");
        
        // TODO: Implementar envio real de email
        // sendEmail(user.getEmail(), subject, body);
    }

    /**
     * Envia email de novo magic link para ativação
     */
    public void sendActivationEmail(User user) {
        String activationUrl = frontendUrl + "/activate-account?token=" + user.getActivationToken();
        String subject = "Ative sua conta - La Luz";
        String body = "Olá " + user.getName() + ",\n\n" +
                "Clique no link abaixo para criar sua senha e ativar sua conta La Luz:\n\n" +
                activationUrl + "\n\n" +
                "Este link é válido por 7 dias.\n\n" +
                "Se você não solicitou este email, por favor ignore-o.\n\n" +
                "Atenciosamente,\n" +
                "Equipe La Luz";
        
        log.info("=== EMAIL DE ATIVAÇÃO ===");
        log.info("Para: {}", user.getEmail());
        log.info("Assunto: {}", subject);
        log.info("Link de ativação: {}", activationUrl);
        log.info("=========================");
        
        // TODO: Implementar envio real de email
    }

    /**
     * Envia email de rastreamento
     */
    public void sendShippingNotification(User user, Order order) {
        String trackingUrl = "https://www.correios.com.br/rastreamento/" + order.getTrackingCode();
        String subject = "Seu pedido #" + order.getOrderNumber() + " foi enviado! - La Luz";
        String body = "Olá " + user.getName() + ",\n\n" +
                "Ótimas notícias! Seu pedido foi enviado!\n\n" +
                "Código de rastreamento: " + order.getTrackingCode() + "\n" +
                "Rastrear pedido: " + trackingUrl + "\n\n" +
                "Atenciosamente,\n" +
                "Equipe La Luz";
        
        log.info("=== EMAIL DE ENVIO ===");
        log.info("Para: {}", user.getEmail());
        log.info("Assunto: {}", subject);
        log.info("======================");
    }

    private String buildOrderConfirmationEmail(User user, Order order, boolean isGuest) {
        StringBuilder sb = new StringBuilder();
        sb.append("Olá ").append(user.getName()).append(",\n\n");
        sb.append("Obrigado por sua compra na La Luz! ").append(isGuest ? "(Compra como convidado)\n\n" : "\n\n");
        sb.append("DETALHES DO PEDIDO\n");
        sb.append("==================\n");
        sb.append("Número do pedido: #").append(order.getOrderNumber()).append("\n");
        sb.append("Data: ").append(order.getCreatedAt()).append("\n");
        sb.append("Forma de pagamento: ").append(order.getPaymentMethod()).append("\n\n");
        
        sb.append("ITENS:\n");
        order.getItems().forEach(item -> {
            sb.append("• ").append(item.getProductName())
              .append(" (").append(item.getQuantity()).append("x)")
              .append(" - R$ ").append(item.getSubtotal()).append("\n");
        });
        
        sb.append("\nSubtotal: R$ ").append(order.getSubtotal());
        sb.append("\nFrete: R$ ").append(order.getShippingCost());
        if (order.getDiscount() != null && order.getDiscount().compareTo(java.math.BigDecimal.ZERO) > 0) {
            sb.append("\nDesconto: -R$ ").append(order.getDiscount());
        }
        sb.append("\nTOTAL: R$ ").append(order.getTotal()).append("\n\n");
        
        sb.append("ENDEREÇO DE ENTREGA:\n");
        sb.append(order.getShippingAddress().getRecipientName()).append("\n");
        sb.append(order.getShippingAddress().getStreet()).append(", ")
          .append(order.getShippingAddress().getNumber()).append("\n");
        if (order.getShippingAddress().getComplement() != null) {
            sb.append(order.getShippingAddress().getComplement()).append("\n");
        }
        sb.append(order.getShippingAddress().getNeighborhood()).append("\n");
        sb.append(order.getShippingAddress().getCity()).append(" - ")
          .append(order.getShippingAddress().getState()).append("\n");
        sb.append("CEP: ").append(order.getShippingAddress().getZipCode()).append("\n\n");
        
        if (order.getPaymentUrl() != null) {
            sb.append("FINALIZAR PAGAMENTO:\n");
            sb.append(order.getPaymentUrl()).append("\n\n");
        }
        
        sb.append("Acompanhe seu pedido em: ").append(frontendUrl).append("/orders/").append(order.getOrderNumber()).append("\n\n");
        sb.append("Atenciosamente,\nEquipe La Luz");
        
        return sb.toString();
    }
}
