package com.lojalaluz.api.dto;

import com.lojalaluz.api.model.Order;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class GuestOrderRequest {
    
    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Email inválido")
    private String guestEmail;
    
    @NotBlank(message = "Nome é obrigatório")
    private String guestName;
    
    private String guestPhone;
    
    @NotNull(message = "Endereço de entrega é obrigatório")
    @Valid
    private AddressDTO shippingAddress;
    
    @NotNull(message = "Método de pagamento é obrigatório")
    private Order.PaymentMethod paymentMethod;
    
    @NotNull(message = "Itens do pedido são obrigatórios")
    private List<GuestOrderItem> items;
    
    private String notes;
    
    @Data
    public static class GuestOrderItem {
        @NotNull(message = "ID do produto é obrigatório")
        private Long productId;
        
        private Long variantId;
        
        @NotNull(message = "Quantidade é obrigatória")
        private Integer quantity;
    }
}
