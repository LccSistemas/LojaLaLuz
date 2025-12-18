package com.lojalaluz.api.dto;

import com.lojalaluz.api.model.Order;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateOrderRequest {
    
    @NotNull(message = "Endereço de entrega é obrigatório")
    private AddressDTO shippingAddress;
    
    @NotNull(message = "Método de pagamento é obrigatório")
    private Order.PaymentMethod paymentMethod;
    
    private String couponCode;
    
    private String notes;
}
