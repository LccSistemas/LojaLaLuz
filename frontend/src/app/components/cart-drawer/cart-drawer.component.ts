import { Component, inject, output } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart-drawer',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe],
  template: `
    <!-- Overlay -->
    <div
      class="overlay"
      [class.opacity-100]="true"
      (click)="close.emit()"
    ></div>

    <!-- Drawer -->
    <div class="drawer drawer-open w-full max-w-md flex flex-col">
      <!-- Header -->
      <div
        class="flex items-center justify-between p-5 border-b border-primary-100"
      >
        <h2 class="text-xs tracking-widest uppercase font-medium">
          Seu Carrinho ({{ cart.cartCount() }})
        </h2>
        <button
          (click)="close.emit()"
          class="p-1 hover:opacity-60 transition-opacity"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Free Shipping Banner -->
      @if (cart.cartTotal() < 299) {
      <div class="bg-accent-cream px-5 py-3 text-center">
        <p class="text-xs">
          Faltam
          <span class="font-semibold">{{
            299 - cart.cartTotal() | currency : 'BRL' : 'symbol' : '1.0-0'
          }}</span>
          para FRETE GRÁTIS
        </p>
        <div class="mt-2 h-1 bg-primary-200 rounded-full overflow-hidden">
          <div
            class="h-full bg-primary-900 transition-all duration-500"
            [style.width.%]="(cart.cartTotal() / 299) * 100"
          ></div>
        </div>
      </div>
      } @else {
      <div class="bg-accent-sage/30 px-5 py-3 text-center">
        <p class="text-xs font-medium">✓ Você ganhou FRETE GRÁTIS!</p>
      </div>
      }

      <!-- Cart Items -->
      <div class="flex-1 overflow-y-auto hide-scrollbar p-5 space-y-5">
        @if (cart.isEmpty()) {
        <div class="text-center py-12">
          <svg
            class="w-16 h-16 mx-auto text-primary-200 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1"
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          <p class="text-sm text-primary-500 mb-6">Seu carrinho está vazio</p>
          <button (click)="close.emit()" class="btn-secondary">
            Continuar Comprando
          </button>
        </div>
        } @else { @for (item of cart.cartItems(); track item.id) {
        <div class="flex gap-4 animate-fade-in">
          <!-- Image -->
          <a
            [routerLink]="['/produto', item.productSlug]"
            (click)="close.emit()"
            class="flex-shrink-0 w-24 h-32 bg-primary-50 overflow-hidden"
          >
            <img
              [src]="item.imageUrl || 'https://via.placeholder.com/100x130'"
              [alt]="item.productName"
              class="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </a>

          <!-- Details -->
          <div class="flex-1 flex flex-col">
            <a
              [routerLink]="['/produto', item.productSlug]"
              (click)="close.emit()"
              class="text-sm font-medium hover:underline line-clamp-2"
            >
              {{ item.productName }}
            </a>

            @if (item.size || item.color) {
            <p class="text-xs text-primary-500 mt-1">
              @if (item.color) { {{ item.color }} } @if (item.size) { /
              {{ item.size }} }
            </p>
            }

            <p class="text-sm font-medium mt-auto">
              {{ item.unitPrice | currency : 'BRL' : 'symbol' : '1.2-2' }}
            </p>

            <!-- Quantity & Remove -->
            <div class="flex items-center justify-between mt-2">
              <div class="flex items-center border border-primary-200">
                <button
                  (click)="updateQuantity(item.id, item.quantity - 1)"
                  class="w-8 h-8 flex items-center justify-center hover:bg-primary-50 transition-colors"
                  [disabled]="item.quantity <= 1"
                >
                  <span class="text-lg">−</span>
                </button>
                <span class="w-8 text-center text-sm">{{ item.quantity }}</span>
                <button
                  (click)="updateQuantity(item.id, item.quantity + 1)"
                  class="w-8 h-8 flex items-center justify-center hover:bg-primary-50 transition-colors"
                  [disabled]="item.quantity >= item.maxQuantity"
                >
                  <span class="text-lg">+</span>
                </button>
              </div>

              <button
                (click)="removeItem(item.id)"
                class="text-xs text-primary-400 hover:text-primary-900 underline underline-offset-2"
              >
                Remover
              </button>
            </div>
          </div>
        </div>
        } }
      </div>

      <!-- Footer -->
      @if (!cart.isEmpty()) {
      <div class="border-t border-primary-100 p-5 space-y-4 bg-white">
        <!-- Subtotal -->
        <div class="flex justify-between text-sm">
          <span class="text-primary-600">Subtotal</span>
          <span class="font-medium">{{
            cart.cartTotal() | currency : 'BRL' : 'symbol' : '1.2-2'
          }}</span>
        </div>

        <p class="text-xs text-primary-500 text-center">
          Frete calculado no checkout
        </p>

        <!-- Buttons -->
        <a
          routerLink="/checkout"
          (click)="close.emit()"
          class="block w-full btn-primary text-center"
        >
          Finalizar Compra
        </a>

        <button
          (click)="close.emit()"
          class="block w-full text-center text-xs tracking-wider uppercase underline underline-offset-4 hover:text-primary-600"
        >
          Continuar Comprando
        </button>
      </div>
      }
    </div>
  `,
})
export class CartDrawerComponent {
  cart = inject(CartService);
  close = output<void>();

  updateQuantity(itemId: number, quantity: number): void {
    if (quantity < 1) return;
    this.cart.updateQuantity(itemId, quantity).subscribe();
  }

  removeItem(itemId: number): void {
    this.cart.removeItem(itemId).subscribe();
  }
}
