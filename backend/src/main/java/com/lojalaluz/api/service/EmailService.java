package com.lojalaluz.api.service;

import com.lojalaluz.api.model.Order;
import com.lojalaluz.api.model.User;
import com.sendgrid.*;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
@Slf4j
public class EmailService {

    @Value("${app.sendgrid.api-key:}")
    private String sendGridApiKey;

    @Value("${app.sendgrid.from-email:noreply@lojalaluz.com.br}")
    private String fromEmail;

    @Value("${app.sendgrid.from-name:La Luz}")
    private String fromName;

    @Value("${app.frontend-url:http://localhost:4200}")
    private String frontendUrl;

    @Value("${app.email.enabled:false}")
    private boolean emailEnabled;

    /**
     * Envia email de confirmação de pedido
     */
    @Async
    public void sendOrderConfirmation(User user, Order order) {
        String subject = "Pedido #" + order.getOrderNumber() + " confirmado - La Luz";
        String htmlContent = buildOrderConfirmationHtml(user, order, false);
        
        sendEmail(user.getEmail(), subject, htmlContent);
    }

    /**
     * Envia email de confirmação com link de ativação de conta
     */
    @Async
    public void sendOrderConfirmationWithActivation(User user, Order order) {
        String activationUrl = frontendUrl + "/activate-account?token=" + user.getActivationToken();
        String subject = "Pedido #" + order.getOrderNumber() + " confirmado + Ative sua conta - La Luz";
        String htmlContent = buildOrderConfirmationHtml(user, order, true) + 
                buildActivationSection(activationUrl);
        
        sendEmail(user.getEmail(), subject, htmlContent);
    }

    /**
     * Envia email de ativação de conta
     */
    @Async
    public void sendActivationEmail(User user) {
        String activationUrl = frontendUrl + "/activate-account?token=" + user.getActivationToken();
        String subject = "Ative sua conta - La Luz";
        String htmlContent = buildActivationEmailHtml(user, activationUrl);
        
        sendEmail(user.getEmail(), subject, htmlContent);
    }

    /**
     * Envia email de rastreamento
     */
    @Async
    public void sendShippingNotification(User user, Order order) {
        String subject = "Seu pedido #" + order.getOrderNumber() + " foi enviado! - La Luz";
        String htmlContent = buildShippingEmailHtml(user, order);
        
        sendEmail(user.getEmail(), subject, htmlContent);
    }

    /**
     * Envia email de pagamento confirmado
     */
    @Async
    public void sendPaymentConfirmation(User user, Order order) {
        String subject = "Pagamento confirmado - Pedido #" + order.getOrderNumber() + " - La Luz";
        String htmlContent = buildPaymentConfirmationHtml(user, order);
        
        sendEmail(user.getEmail(), subject, htmlContent);
    }

    private void sendEmail(String toEmail, String subject, String htmlContent) {
        if (!emailEnabled || sendGridApiKey == null || sendGridApiKey.isEmpty()) {
            log.info("=== EMAIL (modo simulação) ===");
            log.info("Para: {}", toEmail);
            log.info("Assunto: {}", subject);
            log.info("Conteúdo: {} caracteres", htmlContent.length());
            log.info("==============================");
            log.info("Para habilitar envio de emails, configure:");
            log.info("  SENDGRID_API_KEY=sua-api-key");
            log.info("  EMAIL_ENABLED=true");
            return;
        }

        try {
            Email from = new Email(fromEmail, fromName);
            Email to = new Email(toEmail);
            Content content = new Content("text/html", htmlContent);
            Mail mail = new Mail(from, subject, to, content);

            SendGrid sg = new SendGrid(sendGridApiKey);
            Request request = new Request();
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            
            Response response = sg.api(request);
            
            if (response.getStatusCode() >= 200 && response.getStatusCode() < 300) {
                log.info("Email enviado com sucesso para: {}", toEmail);
            } else {
                log.error("Erro ao enviar email: {} - {}", response.getStatusCode(), response.getBody());
            }
        } catch (IOException e) {
            log.error("Erro ao enviar email para {}: {}", toEmail, e.getMessage());
        }
    }

    private String buildOrderConfirmationHtml(User user, Order order, boolean isGuest) {
        StringBuilder html = new StringBuilder();
        html.append("<!DOCTYPE html><html><head><meta charset='UTF-8'></head><body style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;'>");
        
        // Header
        html.append("<div style='text-align: center; padding: 20px 0; border-bottom: 2px solid #f0f0f0;'>");
        html.append("<h1 style='color: #333; margin: 0;'>LA LUZ</h1>");
        html.append("</div>");
        
        // Greeting
        html.append("<div style='padding: 20px 0;'>");
        html.append("<p style='font-size: 16px;'>Olá <strong>").append(user.getName()).append("</strong>,</p>");
        html.append("<p>Obrigado por sua compra! ").append(isGuest ? "(Compra como convidado)" : "").append("</p>");
        html.append("</div>");
        
        // Order Details
        html.append("<div style='background: #f9f9f9; padding: 20px; border-radius: 8px;'>");
        html.append("<h2 style='margin-top: 0; color: #333;'>Detalhes do Pedido</h2>");
        html.append("<p><strong>Número:</strong> #").append(order.getOrderNumber()).append("</p>");
        html.append("<p><strong>Data:</strong> ").append(order.getCreatedAt()).append("</p>");
        html.append("<p><strong>Pagamento:</strong> ").append(order.getPaymentMethod()).append("</p>");
        html.append("</div>");
        
        // Items
        html.append("<div style='padding: 20px 0;'>");
        html.append("<h3>Itens do Pedido</h3>");
        html.append("<table style='width: 100%; border-collapse: collapse;'>");
        order.getItems().forEach(item -> {
            html.append("<tr style='border-bottom: 1px solid #eee;'>");
            html.append("<td style='padding: 10px 0;'>").append(item.getProductName());
            if (item.getSize() != null) {
                html.append("<br><small>Tam: ").append(item.getSize()).append("</small>");
            }
            html.append("</td>");
            html.append("<td style='text-align: center;'>").append(item.getQuantity()).append("x</td>");
            html.append("<td style='text-align: right;'>R$ ").append(item.getSubtotal()).append("</td>");
            html.append("</tr>");
        });
        html.append("</table>");
        html.append("</div>");
        
        // Totals
        html.append("<div style='border-top: 2px solid #333; padding-top: 15px;'>");
        html.append("<p><strong>Subtotal:</strong> R$ ").append(order.getSubtotal()).append("</p>");
        html.append("<p><strong>Frete:</strong> R$ ").append(order.getShippingCost()).append("</p>");
        if (order.getDiscount() != null && order.getDiscount().compareTo(java.math.BigDecimal.ZERO) > 0) {
            html.append("<p style='color: green;'><strong>Desconto:</strong> -R$ ").append(order.getDiscount()).append("</p>");
        }
        html.append("<p style='font-size: 18px;'><strong>TOTAL: R$ ").append(order.getTotal()).append("</strong></p>");
        html.append("</div>");
        
        // Shipping Address
        html.append("<div style='background: #f9f9f9; padding: 20px; border-radius: 8px; margin-top: 20px;'>");
        html.append("<h3 style='margin-top: 0;'>Endereço de Entrega</h3>");
        html.append("<p>").append(order.getShippingAddress().getRecipientName()).append("<br>");
        html.append(order.getShippingAddress().getStreet()).append(", ").append(order.getShippingAddress().getNumber()).append("<br>");
        if (order.getShippingAddress().getComplement() != null && !order.getShippingAddress().getComplement().isEmpty()) {
            html.append(order.getShippingAddress().getComplement()).append("<br>");
        }
        html.append(order.getShippingAddress().getNeighborhood()).append("<br>");
        html.append(order.getShippingAddress().getCity()).append(" - ").append(order.getShippingAddress().getState()).append("<br>");
        html.append("CEP: ").append(order.getShippingAddress().getZipCode()).append("</p>");
        html.append("</div>");
        
        // Track Order Button
        html.append("<div style='text-align: center; padding: 30px 0;'>");
        html.append("<a href='").append(frontendUrl).append("/minha-conta/pedidos/").append(order.getOrderNumber()).append("' ");
        html.append("style='background: #333; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;'>");
        html.append("Acompanhar Pedido</a>");
        html.append("</div>");
        
        // Footer
        html.append("<div style='text-align: center; padding: 20px 0; border-top: 1px solid #eee; color: #888; font-size: 12px;'>");
        html.append("<p>La Luz - Moda Feminina</p>");
        html.append("<p>Dúvidas? Entre em contato: contato@lojalaluz.com.br</p>");
        html.append("</div>");
        
        html.append("</body></html>");
        return html.toString();
    }

    private String buildActivationSection(String activationUrl) {
        StringBuilder html = new StringBuilder();
        html.append("<div style='background: #e8f5e9; padding: 20px; border-radius: 8px; margin-top: 20px; text-align: center;'>");
        html.append("<h3 style='color: #2e7d32; margin-top: 0;'>🎉 Ative sua conta e ganhe benefícios!</h3>");
        html.append("<p>Uma conta foi criada automaticamente para você. Ative-a para:</p>");
        html.append("<ul style='text-align: left; display: inline-block;'>");
        html.append("<li>Acompanhar seus pedidos</li>");
        html.append("<li>Salvar endereços para compras futuras</li>");
        html.append("<li>Acessar ofertas exclusivas</li>");
        html.append("</ul>");
        html.append("<p><a href='").append(activationUrl).append("' ");
        html.append("style='background: #2e7d32; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block;'>");
        html.append("Ativar Minha Conta</a></p>");
        html.append("<p style='font-size: 12px; color: #666;'>Este link é válido por 7 dias.</p>");
        html.append("</div>");
        return html.toString();
    }

    private String buildActivationEmailHtml(User user, String activationUrl) {
        StringBuilder html = new StringBuilder();
        html.append("<!DOCTYPE html><html><head><meta charset='UTF-8'></head><body style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;'>");
        
        html.append("<div style='text-align: center; padding: 20px 0;'>");
        html.append("<h1 style='color: #333;'>LA LUZ</h1>");
        html.append("</div>");
        
        html.append("<div style='padding: 20px;'>");
        html.append("<p>Olá <strong>").append(user.getName()).append("</strong>,</p>");
        html.append("<p>Clique no botão abaixo para criar sua senha e ativar sua conta La Luz:</p>");
        html.append("</div>");
        
        html.append("<div style='text-align: center; padding: 30px 0;'>");
        html.append("<a href='").append(activationUrl).append("' ");
        html.append("style='background: #333; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;'>");
        html.append("Ativar Minha Conta</a>");
        html.append("</div>");
        
        html.append("<p style='font-size: 12px; color: #888; text-align: center;'>Este link é válido por 7 dias.</p>");
        
        html.append("</body></html>");
        return html.toString();
    }

    private String buildShippingEmailHtml(User user, Order order) {
        String trackingUrl = "https://rastreamento.correios.com.br/app/index.php?objeto=" + order.getTrackingCode();
        
        StringBuilder html = new StringBuilder();
        html.append("<!DOCTYPE html><html><head><meta charset='UTF-8'></head><body style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;'>");
        
        html.append("<div style='text-align: center; padding: 20px 0;'>");
        html.append("<h1 style='color: #333;'>LA LUZ</h1>");
        html.append("</div>");
        
        html.append("<div style='padding: 20px; text-align: center;'>");
        html.append("<h2>📦 Seu pedido foi enviado!</h2>");
        html.append("<p>Olá <strong>").append(user.getName()).append("</strong>,</p>");
        html.append("<p>Ótimas notícias! Seu pedido #").append(order.getOrderNumber()).append(" está a caminho!</p>");
        html.append("</div>");
        
        html.append("<div style='background: #f9f9f9; padding: 20px; border-radius: 8px; text-align: center;'>");
        html.append("<p><strong>Código de Rastreamento:</strong></p>");
        html.append("<p style='font-size: 24px; font-family: monospace; background: #fff; padding: 10px; border-radius: 5px;'>").append(order.getTrackingCode()).append("</p>");
        html.append("<a href='").append(trackingUrl).append("' ");
        html.append("style='background: #333; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 15px;'>");
        html.append("Rastrear Pedido</a>");
        html.append("</div>");
        
        html.append("</body></html>");
        return html.toString();
    }

    private String buildPaymentConfirmationHtml(User user, Order order) {
        StringBuilder html = new StringBuilder();
        html.append("<!DOCTYPE html><html><head><meta charset='UTF-8'></head><body style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;'>");
        
        html.append("<div style='text-align: center; padding: 20px 0;'>");
        html.append("<h1 style='color: #333;'>LA LUZ</h1>");
        html.append("</div>");
        
        html.append("<div style='padding: 20px; text-align: center;'>");
        html.append("<h2 style='color: #2e7d32;'>✅ Pagamento Confirmado!</h2>");
        html.append("<p>Olá <strong>").append(user.getName()).append("</strong>,</p>");
        html.append("<p>O pagamento do seu pedido #").append(order.getOrderNumber()).append(" foi confirmado!</p>");
        html.append("<p>Agora estamos preparando seus produtos para envio.</p>");
        html.append("</div>");
        
        html.append("<div style='text-align: center; padding: 20px;'>");
        html.append("<a href='").append(frontendUrl).append("/minha-conta/pedidos/").append(order.getOrderNumber()).append("' ");
        html.append("style='background: #333; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block;'>");
        html.append("Ver Detalhes do Pedido</a>");
        html.append("</div>");
        
        html.append("</body></html>");
        return html.toString();
    }

    /**
     * Envia email de pagamento rejeitado
     */
    @Async
    public void sendPaymentRejected(User user, Order order, String reason) {
        String subject = "⚠️ Pagamento não aprovado - Pedido #" + order.getOrderNumber() + " - La Luz";
        String htmlContent = buildPaymentRejectedHtml(user, order, reason);
        
        sendEmail(user.getEmail(), subject, htmlContent);
    }

    private String buildPaymentRejectedHtml(User user, Order order, String reason) {
        StringBuilder html = new StringBuilder();
        html.append("<!DOCTYPE html><html><head><meta charset='UTF-8'></head><body style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;'>");
        
        html.append("<div style='text-align: center; padding: 20px 0;'>");
        html.append("<h1 style='color: #333;'>LA LUZ</h1>");
        html.append("</div>");
        
        html.append("<div style='padding: 20px; text-align: center;'>");
        html.append("<h2 style='color: #d32f2f;'>❌ Pagamento Não Aprovado</h2>");
        html.append("<p>Olá <strong>").append(user.getName()).append("</strong>,</p>");
        html.append("<p>Infelizmente o pagamento do seu pedido #").append(order.getOrderNumber()).append(" não foi aprovado.</p>");
        html.append("</div>");
        
        html.append("<div style='background: #ffebee; padding: 20px; border-radius: 8px; margin: 20px 0;'>");
        html.append("<p><strong>Motivo:</strong> ").append(translateRejectionReason(reason)).append("</p>");
        html.append("</div>");
        
        html.append("<div style='padding: 20px;'>");
        html.append("<p><strong>O que você pode fazer:</strong></p>");
        html.append("<ul>");
        html.append("<li>Verificar os dados do cartão</li>");
        html.append("<li>Verificar o limite disponível</li>");
        html.append("<li>Tentar outro método de pagamento (PIX tem 5% de desconto!)</li>");
        html.append("<li>Entrar em contato com seu banco</li>");
        html.append("</ul>");
        html.append("</div>");
        
        html.append("<div style='text-align: center; padding: 20px;'>");
        html.append("<a href='").append(frontendUrl).append("/checkout/retry/").append(order.getOrderNumber()).append("' ");
        html.append("style='background: #333; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;'>");
        html.append("Tentar Novamente</a>");
        html.append("</div>");
        
        html.append("<div style='background: #e3f2fd; padding: 15px; border-radius: 8px; text-align: center; margin-top: 20px;'>");
        html.append("<p style='margin: 0;'>💡 <strong>Dica:</strong> Pagando com PIX você tem 5% de desconto!</p>");
        html.append("</div>");
        
        html.append("<div style='text-align: center; padding: 20px 0; border-top: 1px solid #eee; color: #888; font-size: 12px; margin-top: 20px;'>");
        html.append("<p>Seu pedido ficará reservado por 24 horas.</p>");
        html.append("<p>Dúvidas? contato@lojalaluz.com.br</p>");
        html.append("</div>");
        
        html.append("</body></html>");
        return html.toString();
    }

    private String translateRejectionReason(String reason) {
        if (reason == null) return "Pagamento não autorizado";
        
        return switch (reason) {
            case "cc_rejected_insufficient_amount" -> "Saldo insuficiente no cartão";
            case "cc_rejected_bad_filled_card_number" -> "Número do cartão incorreto";
            case "cc_rejected_bad_filled_date" -> "Data de validade incorreta";
            case "cc_rejected_bad_filled_security_code" -> "Código de segurança incorreto";
            case "cc_rejected_bad_filled_other" -> "Dados do cartão incorretos";
            case "cc_rejected_call_for_authorize" -> "Você precisa autorizar a operação com seu banco";
            case "cc_rejected_card_disabled" -> "Cartão desabilitado - entre em contato com seu banco";
            case "cc_rejected_duplicated_payment" -> "Pagamento duplicado - você já fez esse pagamento";
            case "cc_rejected_high_risk" -> "Pagamento recusado por segurança";
            case "cc_rejected_max_attempts" -> "Limite de tentativas excedido";
            case "cc_rejected_other_reason" -> "Pagamento não autorizado pelo banco";
            default -> "Pagamento não autorizado - entre em contato com seu banco";
        };
    }

    /**
     * Envia email de PIX expirado
     */
    @Async
    public void sendPixExpired(User user, Order order) {
        String subject = "⏰ PIX expirado - Pedido #" + order.getOrderNumber() + " - La Luz";
        String htmlContent = buildPixExpiredHtml(user, order);
        
        sendEmail(user.getEmail(), subject, htmlContent);
    }

    private String buildPixExpiredHtml(User user, Order order) {
        StringBuilder html = new StringBuilder();
        html.append("<!DOCTYPE html><html><head><meta charset='UTF-8'></head><body style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;'>");
        
        html.append("<div style='text-align: center; padding: 20px 0;'>");
        html.append("<h1 style='color: #333;'>LA LUZ</h1>");
        html.append("</div>");
        
        html.append("<div style='padding: 20px; text-align: center;'>");
        html.append("<h2 style='color: #ff9800;'>⏰ PIX Expirado</h2>");
        html.append("<p>Olá <strong>").append(user.getName()).append("</strong>,</p>");
        html.append("<p>O código PIX do seu pedido #").append(order.getOrderNumber()).append(" expirou.</p>");
        html.append("<p>Mas não se preocupe! Você pode gerar um novo código.</p>");
        html.append("</div>");
        
        html.append("<div style='text-align: center; padding: 20px;'>");
        html.append("<a href='").append(frontendUrl).append("/checkout/retry/").append(order.getOrderNumber()).append("' ");
        html.append("style='background: #333; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;'>");
        html.append("Gerar Novo PIX</a>");
        html.append("</div>");
        
        html.append("<div style='background: #e8f5e9; padding: 15px; border-radius: 8px; text-align: center;'>");
        html.append("<p style='margin: 0;'>✨ Pagando com PIX você continua tendo 5% de desconto!</p>");
        html.append("</div>");
        
        html.append("</body></html>");
        return html.toString();
    }
}

