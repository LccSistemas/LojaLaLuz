package com.lojalaluz.api.service;

import com.lojalaluz.api.dto.*;
import com.lojalaluz.api.exception.BadRequestException;
import com.lojalaluz.api.exception.ResourceNotFoundException;
import com.lojalaluz.api.model.*;
import com.lojalaluz.api.repository.CartRepository;
import com.lojalaluz.api.repository.OrderRepository;
import com.lojalaluz.api.repository.ProductRepository;
import com.lojalaluz.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final PaymentService paymentService;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    public Page<OrderDTO> getUserOrders(Long userId, Pageable pageable) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable)
                .map(this::toDTO);
    }

    public OrderDTO getOrderById(Long orderId, Long userId) {
        Order order = orderRepository.findByIdWithItems(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido não encontrado"));
        
        // Verificar se o pedido pertence ao usuário
        if (!order.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Pedido não encontrado");
        }
        
        return toDTO(order);
    }

    public OrderDTO getOrderByNumber(String orderNumber) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido não encontrado"));
        return toDTO(order);
    }

    @Transactional
    public OrderDTO createOrder(Long userId, CreateOrderRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));

        Cart cart = cartRepository.findByUserIdWithItems(userId)
                .orElseThrow(() -> new BadRequestException("Carrinho vazio"));

        if (cart.getItems().isEmpty()) {
            throw new BadRequestException("Carrinho vazio");
        }

        // Criar endereço de entrega
        ShippingAddress shippingAddress = ShippingAddress.builder()
                .recipientName(request.getShippingAddress().getRecipientName())
                .zipCode(request.getShippingAddress().getZipCode())
                .street(request.getShippingAddress().getStreet())
                .number(request.getShippingAddress().getNumber())
                .complement(request.getShippingAddress().getComplement())
                .neighborhood(request.getShippingAddress().getNeighborhood())
                .city(request.getShippingAddress().getCity())
                .state(request.getShippingAddress().getState())
                .phone(request.getShippingAddress().getPhone())
                .build();

        // Criar pedido
        Order order = Order.builder()
                .user(user)
                .shippingAddress(shippingAddress)
                .paymentMethod(request.getPaymentMethod())
                .notes(request.getNotes())
                .shippingCost(calculateShipping(request.getShippingAddress().getZipCode()))
                .build();

        // Adicionar itens
        for (CartItem cartItem : cart.getItems()) {
            String imageUrl = null;
            if (!cartItem.getProduct().getImages().isEmpty()) {
                imageUrl = cartItem.getProduct().getImages().get(0).getUrl();
            }

            OrderItem orderItem = OrderItem.builder()
                    .product(cartItem.getProduct())
                    .productName(cartItem.getProduct().getName())
                    .productSku(cartItem.getProduct().getSku())
                    .size(cartItem.getVariant() != null ? cartItem.getVariant().getSize() : null)
                    .color(cartItem.getVariant() != null ? cartItem.getVariant().getColor() : null)
                    .unitPrice(cartItem.getUnitPrice())
                    .quantity(cartItem.getQuantity())
                    .build();
            order.addItem(orderItem);
        }

        order.calculateTotals();

        Order savedOrder = orderRepository.save(order);

        // Processar pagamento
        String paymentUrl = paymentService.createPayment(savedOrder);
        savedOrder.setPaymentUrl(paymentUrl);
        savedOrder = orderRepository.save(savedOrder);

        // Limpar carrinho
        cart.clear();
        cartRepository.save(cart);

        return toDTO(savedOrder);
    }

    @Transactional
    public OrderDTO createGuestOrder(GuestOrderRequest request) {
        // Verificar se já existe usuário com este email
        User user = userRepository.findByEmail(request.getGuestEmail())
                .orElseGet(() -> createGuestUser(request));
        
        // Criar endereço de entrega
        ShippingAddress shippingAddress = ShippingAddress.builder()
                .recipientName(request.getShippingAddress().getRecipientName())
                .zipCode(request.getShippingAddress().getZipCode())
                .street(request.getShippingAddress().getStreet())
                .number(request.getShippingAddress().getNumber())
                .complement(request.getShippingAddress().getComplement())
                .neighborhood(request.getShippingAddress().getNeighborhood())
                .city(request.getShippingAddress().getCity())
                .state(request.getShippingAddress().getState())
                .phone(request.getShippingAddress().getPhone())
                .build();

        // Criar pedido
        Order order = Order.builder()
                .user(user)
                .shippingAddress(shippingAddress)
                .paymentMethod(request.getPaymentMethod())
                .notes(request.getNotes())
                .shippingCost(calculateShipping(request.getShippingAddress().getZipCode()))
                .build();

        // Adicionar itens do request
        for (GuestOrderRequest.GuestOrderItem item : request.getItems()) {
            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado: " + item.getProductId()));
            
            BigDecimal unitPrice = product.getSalePrice() != null ? product.getSalePrice() : product.getPrice();
            
            String size = null;
            String color = null;
            
            if (item.getVariantId() != null) {
                ProductVariant variant = product.getVariants().stream()
                        .filter(v -> v.getId().equals(item.getVariantId()))
                        .findFirst()
                        .orElse(null);
                if (variant != null) {
                    size = variant.getSize();
                    color = variant.getColor();
                }
            }

            OrderItem orderItem = OrderItem.builder()
                    .product(product)
                    .productName(product.getName())
                    .productSku(product.getSku())
                    .size(size)
                    .color(color)
                    .unitPrice(unitPrice)
                    .quantity(item.getQuantity())
                    .build();
            order.addItem(orderItem);
        }

        order.calculateTotals();

        Order savedOrder = orderRepository.save(order);

        // Processar pagamento
        String paymentUrl = paymentService.createPayment(savedOrder);
        savedOrder.setPaymentUrl(paymentUrl);
        savedOrder = orderRepository.save(savedOrder);

        // Enviar email de confirmação com magic link
        if (!user.getAccountActivated()) {
            emailService.sendOrderConfirmationWithActivation(user, savedOrder);
        } else {
            emailService.sendOrderConfirmation(user, savedOrder);
        }

        return toDTO(savedOrder);
    }

    private User createGuestUser(GuestOrderRequest request) {
        // Gerar senha aleatória (usuário não pode fazer login sem ativar conta)
        String randomPassword = UUID.randomUUID().toString();
        
        // Gerar token de ativação
        String activationToken = UUID.randomUUID().toString();
        
        User guestUser = User.builder()
                .name(request.getGuestName())
                .email(request.getGuestEmail())
                .phone(request.getGuestPhone())
                .password(passwordEncoder.encode(randomPassword))
                .role(User.Role.CUSTOMER)
                .active(true)
                .accountActivated(false) // Conta não ativada
                .activationToken(activationToken)
                .activationTokenExpiresAt(LocalDateTime.now().plusDays(7)) // Token válido por 7 dias
                .build();
        
        return userRepository.save(guestUser);
    }

    @Transactional
    public void activateAccountWithPassword(String token, String password) {
        User user = userRepository.findByActivationToken(token)
                .orElseThrow(() -> new BadRequestException("Token de ativação inválido"));
        
        if (user.getActivationTokenExpiresAt().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Token de ativação expirado");
        }
        
        user.setPassword(passwordEncoder.encode(password));
        user.setAccountActivated(true);
        user.setActivationToken(null);
        user.setActivationTokenExpiresAt(null);
        
        userRepository.save(user);
    }

    @Transactional
    public OrderDTO updateOrderStatus(Long orderId, Order.OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido não encontrado"));

        order.setStatus(status);

        switch (status) {
            case PAID:
                order.setPaidAt(LocalDateTime.now());
                order.setPaymentStatus(Order.PaymentStatus.APPROVED);
                break;
            case SHIPPED:
                order.setShippedAt(LocalDateTime.now());
                break;
            case DELIVERED:
                order.setDeliveredAt(LocalDateTime.now());
                break;
            case CANCELLED:
                order.setPaymentStatus(Order.PaymentStatus.CANCELLED);
                break;
            default:
                break;
        }

        Order saved = orderRepository.save(order);
        return toDTO(saved);
    }

    @Transactional
    public void updatePaymentStatus(String paymentId, Order.PaymentStatus status) {
        Order order = orderRepository.findByPaymentId(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido não encontrado"));

        order.setPaymentStatus(status);

        if (status == Order.PaymentStatus.APPROVED) {
            order.setStatus(Order.OrderStatus.PAID);
            order.setPaidAt(LocalDateTime.now());
        } else if (status == Order.PaymentStatus.REJECTED || status == Order.PaymentStatus.CANCELLED) {
            order.setStatus(Order.OrderStatus.CANCELLED);
        }

        orderRepository.save(order);
    }

    private BigDecimal calculateShipping(String zipCode) {
        // Lógica simplificada de frete
        // Em produção, integrar com Correios ou transportadora
        return new BigDecimal("15.00");
    }

    private OrderDTO toDTO(Order order) {
        return OrderDTO.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .status(order.getStatus())
                .paymentStatus(order.getPaymentStatus())
                .paymentMethod(order.getPaymentMethod())
                .items(order.getItems().stream().map(this::toItemDTO).collect(Collectors.toList()))
                .subtotal(order.getSubtotal())
                .shippingCost(order.getShippingCost())
                .discount(order.getDiscount())
                .total(order.getTotal())
                .shippingAddress(toAddressDTO(order.getShippingAddress()))
                .trackingCode(order.getTrackingCode())
                .notes(order.getNotes())
                .paymentUrl(order.getPaymentUrl())
                .createdAt(order.getCreatedAt())
                .paidAt(order.getPaidAt())
                .shippedAt(order.getShippedAt())
                .deliveredAt(order.getDeliveredAt())
                .build();
    }

    private OrderItemDTO toItemDTO(OrderItem item) {
        return OrderItemDTO.builder()
                .id(item.getId())
                .productId(item.getProduct().getId())
                .productName(item.getProductName())
                .productSku(item.getProductSku())
                .size(item.getSize())
                .color(item.getColor())
                .unitPrice(item.getUnitPrice())
                .quantity(item.getQuantity())
                .subtotal(item.getSubtotal())
                .build();
    }

    private AddressDTO toAddressDTO(ShippingAddress address) {
        if (address == null) return null;
        return AddressDTO.builder()
                .recipientName(address.getRecipientName())
                .zipCode(address.getZipCode())
                .street(address.getStreet())
                .number(address.getNumber())
                .complement(address.getComplement())
                .neighborhood(address.getNeighborhood())
                .city(address.getCity())
                .state(address.getState())
                .phone(address.getPhone())
                .build();
    }
}
