package com.lojalaluz.api.service;

import com.lojalaluz.api.dto.AddToCartRequest;
import com.lojalaluz.api.dto.CartDTO;
import com.lojalaluz.api.dto.CartItemDTO;
import com.lojalaluz.api.exception.BadRequestException;
import com.lojalaluz.api.exception.ResourceNotFoundException;
import com.lojalaluz.api.model.*;
import com.lojalaluz.api.repository.CartRepository;
import com.lojalaluz.api.repository.ProductRepository;
import com.lojalaluz.api.repository.ProductVariantRepository;
import com.lojalaluz.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final ProductVariantRepository variantRepository;
    private final UserRepository userRepository;

    public CartDTO getCart(Long userId, String sessionId) {
        Cart cart = findOrCreateCart(userId, sessionId);
        return toDTO(cart);
    }

    @Transactional
    public CartDTO addToCart(Long userId, String sessionId, AddToCartRequest request) {
        Cart cart = findOrCreateCart(userId, sessionId);

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado"));

        ProductVariant variant = null;
        if (request.getVariantId() != null) {
            variant = variantRepository.findById(request.getVariantId())
                    .orElseThrow(() -> new ResourceNotFoundException("Variante não encontrada"));
            
            if (!variant.isAvailable()) {
                throw new BadRequestException("Variante indisponível");
            }
        }

        // Verificar se já existe no carrinho
        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(request.getProductId()) &&
                        (request.getVariantId() == null || 
                         (item.getVariant() != null && item.getVariant().getId().equals(request.getVariantId()))))
                .findFirst();

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + request.getQuantity());
        } else {
            CartItem newItem = CartItem.builder()
                    .product(product)
                    .variant(variant)
                    .quantity(request.getQuantity())
                    .priceAtTime(product.getCurrentPrice())
                    .build();
            cart.addItem(newItem);
        }

        Cart saved = cartRepository.save(cart);
        return toDTO(saved);
    }

    @Transactional
    public CartDTO updateCartItemQuantity(Long userId, String sessionId, Long itemId, Integer quantity) {
        Cart cart = findOrCreateCart(userId, sessionId);

        CartItem item = cart.getItems().stream()
                .filter(i -> i.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Item não encontrado no carrinho"));

        if (quantity <= 0) {
            cart.removeItem(item);
        } else {
            item.setQuantity(quantity);
        }

        Cart saved = cartRepository.save(cart);
        return toDTO(saved);
    }

    @Transactional
    public CartDTO removeFromCart(Long userId, String sessionId, Long itemId) {
        Cart cart = findOrCreateCart(userId, sessionId);

        CartItem item = cart.getItems().stream()
                .filter(i -> i.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Item não encontrado no carrinho"));

        cart.removeItem(item);
        Cart saved = cartRepository.save(cart);
        return toDTO(saved);
    }

    @Transactional
    public void clearCart(Long userId, String sessionId) {
        Cart cart = findOrCreateCart(userId, sessionId);
        cart.clear();
        cartRepository.save(cart);
    }

    @Transactional
    public void mergeCart(String sessionId, Long userId) {
        Optional<Cart> sessionCart = cartRepository.findBySessionIdWithItems(sessionId);
        if (sessionCart.isEmpty()) {
            return;
        }

        Cart userCart = findOrCreateCart(userId, null);

        for (CartItem item : sessionCart.get().getItems()) {
            Optional<CartItem> existingItem = userCart.getItems().stream()
                    .filter(i -> i.getProduct().getId().equals(item.getProduct().getId()) &&
                            (item.getVariant() == null ||
                             (i.getVariant() != null && i.getVariant().getId().equals(item.getVariant().getId()))))
                    .findFirst();

            if (existingItem.isPresent()) {
                existingItem.get().setQuantity(existingItem.get().getQuantity() + item.getQuantity());
            } else {
                CartItem newItem = CartItem.builder()
                        .product(item.getProduct())
                        .variant(item.getVariant())
                        .quantity(item.getQuantity())
                        .priceAtTime(item.getPriceAtTime())
                        .build();
                userCart.addItem(newItem);
            }
        }

        cartRepository.save(userCart);
        cartRepository.delete(sessionCart.get());
    }

    private Cart findOrCreateCart(Long userId, String sessionId) {
        if (userId != null) {
            return cartRepository.findByUserIdWithItems(userId)
                    .orElseGet(() -> {
                        User user = userRepository.findById(userId)
                                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));
                        Cart cart = Cart.builder().user(user).build();
                        return cartRepository.save(cart);
                    });
        } else if (sessionId != null) {
            return cartRepository.findBySessionIdWithItems(sessionId)
                    .orElseGet(() -> {
                        Cart cart = Cart.builder().sessionId(sessionId).build();
                        return cartRepository.save(cart);
                    });
        }
        throw new BadRequestException("UserId ou SessionId é obrigatório");
    }

    private CartDTO toDTO(Cart cart) {
        return CartDTO.builder()
                .id(cart.getId())
                .items(cart.getItems().stream().map(this::toItemDTO).collect(Collectors.toList()))
                .subtotal(cart.getTotal())
                .totalItems(cart.getTotalItems())
                .build();
    }

    private CartItemDTO toItemDTO(CartItem item) {
        String imageUrl = null;
        if (!item.getProduct().getImages().isEmpty()) {
            imageUrl = item.getProduct().getImages().stream()
                    .filter(ProductImage::getIsPrimary)
                    .findFirst()
                    .map(ProductImage::getUrl)
                    .orElse(item.getProduct().getImages().get(0).getUrl());
        }

        return CartItemDTO.builder()
                .id(item.getId())
                .productId(item.getProduct().getId())
                .productName(item.getProduct().getName())
                .productSlug(item.getProduct().getSlug())
                .imageUrl(imageUrl)
                .variantId(item.getVariant() != null ? item.getVariant().getId() : null)
                .size(item.getVariant() != null ? item.getVariant().getSize() : null)
                .color(item.getVariant() != null ? item.getVariant().getColor() : null)
                .quantity(item.getQuantity())
                .unitPrice(item.getUnitPrice())
                .subtotal(item.getSubtotal())
                .maxQuantity(item.getVariant() != null ? 
                        item.getVariant().getStockQuantity() : 
                        item.getProduct().getStockQuantity())
                .build();
    }
}
