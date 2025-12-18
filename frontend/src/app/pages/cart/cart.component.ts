import { Component, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe],
  template: `
    <div class="bg-gray-50 min-h-screen py-8">
      <div class="container mx-auto px-4">
        <h1 class="text-3xl font-display font-bold mb-8">
          Carrinho de Compras
        </h1>

        @if (cart.isEmpty()) {
        <div class="bg-white rounded-xl p-12 text-center">
          <svg
            class="w-24 h-24 text-gray-300 mx-auto mb-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          <h2 class="text-2xl font-bold text-gray-900 mb-4">
            Seu carrinho está vazio
          </h2>
          <p class="text-gray-600 mb-8">
            Explore nossa coleção e adicione produtos incríveis!
          </p>
          <a routerLink="/produtos" class="btn-primary">Ver Produtos</a>
        </div>
        } @else {
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Cart Items -->
          <div class="lg:col-span-2 space-y-4">
            @for (item of cart.cartItems(); track item.id) {
            <div class="bg-white rounded-xl p-4 flex gap-4">
              <!-- Product Image -->
              <a
                [routerLink]="['/produto', item.productSlug]"
                class="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden"
              >
                <img
                  [src]="item.imageUrl || 'https://via.placeholder.com/100'"
                  [alt]="item.productName"
                  class="w-full h-full object-cover"
                />
              </a>

              <!-- Product Info -->
              <div class="flex-1">
                <div class="flex justify-between">
                  <div>
                    <a
                      [routerLink]="['/produto', item.productSlug]"
                      class="font-medium text-gray-900 hover:text-primary-600"
                    >
                      {{ item.productName }}
                    </a>
                    @if (item.size || item.color) {
                    <p class="text-sm text-gray-500 mt-1">
                      @if (item.color) { <span>{{ item.color }}</span> } @if
                      (item.size) {
                      <span class="ml-2">Tam: {{ item.size }}</span> }
                    </p>
                    }
                  </div>
                  <button
                    (click)="removeItem(item.id)"
                    class="text-gray-400 hover:text-red-500"
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
                        stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>

                <div class="flex items-center justify-between mt-4">
                  <!-- Quantity -->
                  <div class="flex items-center border rounded-lg">
                    <button
                      (click)="updateQuantity(item.id, item.quantity - 1)"
                      class="px-3 py-1 text-gray-600 hover:bg-gray-100"
                      [disabled]="item.quantity <= 1"
                    >
                      -
                    </button>
                    <span class="px-4 py-1 font-medium">{{
                      item.quantity
                    }}</span>
                    <button
                      (click)="updateQuantity(item.id, item.quantity + 1)"
                      class="px-3 py-1 text-gray-600 hover:bg-gray-100"
                      [disabled]="item.quantity >= item.maxQuantity"
                    >
                      +
                    </button>
                  </div>

                  <!-- Price -->
                  <div class="text-right">
                    <p class="font-bold text-gray-900">
                      {{
                        item.subtotal | currency : 'BRL' : 'symbol' : '1.2-2'
                      }}
                    </p>
                    <p class="text-sm text-gray-500">
                      {{
                        item.unitPrice | currency : 'BRL' : 'symbol' : '1.2-2'
                      }}
                      cada
                    </p>
                  </div>
                </div>
              </div>
            </div>
            }

            <!-- Clear Cart -->
            <div class="flex justify-end">
              <button
                (click)="clearCart()"
                class="text-sm text-gray-500 hover:text-red-500"
              >
                Limpar carrinho
              </button>
            </div>
          </div>

          <!-- Order Summary -->
          <div class="lg:col-span-1">
            <div class="bg-white rounded-xl p-6 sticky top-24">
              <h2 class="text-xl font-bold mb-6">Resumo do Pedido</h2>

              <div class="space-y-4 mb-6">
                <div class="flex justify-between text-gray-600">
                  <span>Subtotal ({{ cart.cartCount() }} itens)</span>
                  <span>{{
                    cart.cartTotal() | currency : 'BRL' : 'symbol' : '1.2-2'
                  }}</span>
                </div>
                <div class="flex justify-between text-gray-600">
                  <span>Frete</span>
                  <span class="text-green-600">Calcular no checkout</span>
                </div>
              </div>

              <div class="border-t pt-4 mb-6">
                <div class="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{{
                    cart.cartTotal() | currency : 'BRL' : 'symbol' : '1.2-2'
                  }}</span>
                </div>
                <p class="text-sm text-gray-500 mt-1">
                  ou 6x de
                  {{
                    cart.cartTotal() / 6 | currency : 'BRL' : 'symbol' : '1.2-2'
                  }}
                </p>
              </div>

              <!-- Coupon -->
              <div class="mb-6">
                <label class="text-sm font-medium text-gray-700 mb-2 block"
                  >Cupom de desconto</label
                >
                <div class="flex gap-2">
                  <input
                    type="text"
                    placeholder="Digite o código"
                    class="flex-1 input-field"
                  />
                  <button class="btn-secondary px-4">Aplicar</button>
                </div>
              </div>

              <!-- Checkout Button -->
              @if (auth.isAuthenticated()) {
              <a
                routerLink="/checkout"
                class="block w-full btn-primary text-center"
              >
                Finalizar Compra
              </a>
              } @else {
              <a
                routerLink="/login"
                [queryParams]="{ redirect: '/checkout' }"
                class="block w-full btn-primary text-center"
              >
                Fazer Login para Comprar
              </a>
              <p class="text-sm text-gray-500 text-center mt-3">
                Não tem conta?
                <a
                  routerLink="/cadastro"
                  class="text-primary-600 hover:underline"
                  >Cadastre-se</a
                >
              </p>
              }

              <!-- Keep Shopping -->
              <a
                routerLink="/produtos"
                class="block w-full text-center mt-4 text-gray-600 hover:text-primary-600"
              >
                ← Continuar Comprando
              </a>
            </div>
          </div>
        </div>
        }
      </div>
    </div>
  `,
})
export class CartComponent {
  cart = inject(CartService);
  auth = inject(AuthService);

  updateQuantity(itemId: number, quantity: number): void {
    if (quantity < 1) return;
    this.cart.updateQuantity(itemId, quantity).subscribe();
  }

  removeItem(itemId: number): void {
    this.cart.removeItem(itemId).subscribe();
  }

  clearCart(): void {
    if (confirm('Tem certeza que deseja limpar o carrinho?')) {
      this.cart.clearCart().subscribe();
    }
  }
}
