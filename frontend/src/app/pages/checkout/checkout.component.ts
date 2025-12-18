import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { OrderService, GuestOrderRequest } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="min-h-screen bg-white">
      <!-- Header -->
      <header class="border-b border-gray-100 py-6">
        <div class="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <a routerLink="/" class="font-cormorant text-2xl">LA LUZ</a>
          <div class="flex items-center gap-2 text-sm text-gray-500">
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            Checkout Seguro
          </div>
        </div>
      </header>

      @if (cart.isEmpty()) {
      <!-- Empty Cart -->
      <div class="max-w-md mx-auto px-4 py-20 text-center">
        <svg
          class="w-16 h-16 text-gray-200 mx-auto mb-6"
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
        <h1 class="font-cormorant text-2xl mb-4">Seu carrinho está vazio</h1>
        <a routerLink="/produtos" class="btn-primary">Continuar Comprando</a>
      </div>
      } @else {
      <div class="max-w-6xl mx-auto px-4 py-8 lg:py-12">
        <div class="grid lg:grid-cols-2 gap-12 lg:gap-16">
          <!-- Left Column: Form -->
          <div class="order-2 lg:order-1">
            <!-- Divider -->
            <div class="flex items-center gap-4 mb-8">
              <span class="text-xs tracking-wider uppercase text-gray-500"
                >Finalizar Pedido</span
              >
              <div class="flex-1 border-t border-gray-100"></div>
            </div>

            <!-- Contact Section -->
            <section class="mb-8">
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-xs tracking-wider uppercase font-medium">
                  Contato
                </h2>
                @if (!auth.isAuthenticated()) {
                <a
                  routerLink="/login"
                  class="text-xs underline underline-offset-2"
                >
                  Já tem conta? Entre aqui
                </a>
                }
              </div>

              <div class="space-y-3">
                <input
                  type="email"
                  [(ngModel)]="email"
                  placeholder="Email *"
                  class="w-full border border-gray-200 px-4 py-3 focus:border-black focus:ring-0"
                />
                <input
                  type="text"
                  [(ngModel)]="name"
                  placeholder="Nome completo *"
                  class="w-full border border-gray-200 px-4 py-3 focus:border-black focus:ring-0"
                />
                <input
                  type="tel"
                  [(ngModel)]="phone"
                  placeholder="Telefone/WhatsApp *"
                  class="w-full border border-gray-200 px-4 py-3 focus:border-black focus:ring-0"
                />
              </div>
            </section>

            <!-- Shipping Section -->
            <section class="mb-8">
              <h2 class="text-xs tracking-wider uppercase font-medium mb-4">
                Endereço de Entrega
              </h2>

              <div class="space-y-3">
                <input
                  type="text"
                  [(ngModel)]="address.recipientName"
                  placeholder="Nome do destinatário *"
                  class="w-full border border-gray-200 px-4 py-3 focus:border-black focus:ring-0"
                />
                <div class="grid grid-cols-3 gap-3">
                  <input
                    type="text"
                    [(ngModel)]="address.zipCode"
                    placeholder="CEP *"
                    class="border border-gray-200 px-4 py-3 focus:border-black focus:ring-0"
                    (blur)="lookupCep()"
                  />
                  <input
                    type="text"
                    [(ngModel)]="address.street"
                    placeholder="Rua/Avenida *"
                    class="border border-gray-200 px-4 py-3 focus:border-black focus:ring-0 col-span-2"
                  />
                </div>

                <div class="grid grid-cols-3 gap-3">
                  <input
                    type="text"
                    [(ngModel)]="address.number"
                    placeholder="Número *"
                    class="border border-gray-200 px-4 py-3 focus:border-black focus:ring-0"
                  />
                  <input
                    type="text"
                    [(ngModel)]="address.complement"
                    placeholder="Complemento"
                    class="border border-gray-200 px-4 py-3 focus:border-black focus:ring-0 col-span-2"
                  />
                </div>

                <div class="grid grid-cols-3 gap-3">
                  <input
                    type="text"
                    [(ngModel)]="address.neighborhood"
                    placeholder="Bairro *"
                    class="border border-gray-200 px-4 py-3 focus:border-black focus:ring-0"
                  />
                  <input
                    type="text"
                    [(ngModel)]="address.city"
                    placeholder="Cidade *"
                    class="border border-gray-200 px-4 py-3 focus:border-black focus:ring-0"
                  />
                  <select
                    [(ngModel)]="address.state"
                    class="border border-gray-200 px-4 py-3 focus:border-black focus:ring-0"
                  >
                    <option value="">Estado *</option>
                    @for (state of states; track state.uf) {
                    <option [value]="state.uf">{{ state.uf }}</option>
                    }
                  </select>
                </div>

                <input
                  type="tel"
                  [(ngModel)]="address.phone"
                  placeholder="Telefone para contato *"
                  class="w-full border border-gray-200 px-4 py-3 focus:border-black focus:ring-0"
                />
              </div>
            </section>

            <!-- Shipping Method -->
            <section class="mb-8">
              <h2 class="text-xs tracking-wider uppercase font-medium mb-4">
                Método de Envio
              </h2>

              <div class="space-y-3">
                <div
                  class="flex items-center justify-between p-4 border cursor-pointer transition-colors"
                  [class.border-black]="shippingMethod === 'standard'"
                  [class.border-gray-200]="shippingMethod !== 'standard'"
                  (click)="shippingMethod = 'standard'"
                >
                  <div class="flex items-center gap-3">
                    <div
                      class="w-4 h-4 rounded-full border-2 flex items-center justify-center"
                      [class.border-black]="shippingMethod === 'standard'"
                      [class.border-gray-300]="shippingMethod !== 'standard'"
                    >
                      @if (shippingMethod === 'standard') {
                      <div class="w-2 h-2 rounded-full bg-black"></div>
                      }
                    </div>
                    <div>
                      <span class="text-sm font-medium">Entrega Padrão</span>
                      <p class="text-xs text-gray-500">5-8 dias úteis</p>
                    </div>
                  </div>
                  <span class="text-sm font-medium">
                    {{
                      shippingCost > 0
                        ? (shippingCost | currency : 'BRL' : 'symbol' : '1.2-2')
                        : 'Grátis'
                    }}
                  </span>
                </div>

                <div
                  class="flex items-center justify-between p-4 border cursor-pointer transition-colors"
                  [class.border-black]="shippingMethod === 'express'"
                  [class.border-gray-200]="shippingMethod !== 'express'"
                  (click)="shippingMethod = 'express'"
                >
                  <div class="flex items-center gap-3">
                    <div
                      class="w-4 h-4 rounded-full border-2 flex items-center justify-center"
                      [class.border-black]="shippingMethod === 'express'"
                      [class.border-gray-300]="shippingMethod !== 'express'"
                    >
                      @if (shippingMethod === 'express') {
                      <div class="w-2 h-2 rounded-full bg-black"></div>
                      }
                    </div>
                    <div>
                      <span class="text-sm font-medium">Entrega Expressa</span>
                      <p class="text-xs text-gray-500">2-3 dias úteis</p>
                    </div>
                  </div>
                  <span class="text-sm font-medium">
                    {{ 29.9 | currency : 'BRL' : 'symbol' : '1.2-2' }}
                  </span>
                </div>
              </div>
            </section>

            <!-- Payment Method -->
            <section class="mb-8">
              <h2 class="text-xs tracking-wider uppercase font-medium mb-4">
                Pagamento
              </h2>

              <div class="border border-gray-200 divide-y divide-gray-100">
                <!-- PIX -->
                <div
                  class="flex items-center gap-4 p-4 cursor-pointer transition-colors"
                  [class.bg-cream-50]="paymentMethod === 'PIX'"
                  (click)="paymentMethod = 'PIX'"
                >
                  <div
                    class="w-4 h-4 rounded-full border-2 flex items-center justify-center"
                    [class.border-black]="paymentMethod === 'PIX'"
                    [class.border-gray-300]="paymentMethod !== 'PIX'"
                  >
                    @if (paymentMethod === 'PIX') {
                    <div class="w-2 h-2 rounded-full bg-black"></div>
                    }
                  </div>
                  <div class="flex-1">
                    <div class="flex items-center gap-2">
                      <span class="text-sm font-medium">PIX</span>
                      <span
                        class="text-xs bg-green-100 text-green-700 px-2 py-0.5"
                        >5% OFF</span
                      >
                    </div>
                    <p class="text-xs text-gray-500">Aprovação instantânea</p>
                  </div>
                  <span class="font-medium text-green-600">
                    {{ pixTotal | currency : 'BRL' : 'symbol' : '1.2-2' }}
                  </span>
                </div>

                <!-- Credit Card -->
                <div
                  class="flex items-center gap-4 p-4 cursor-pointer transition-colors"
                  [class.bg-cream-50]="paymentMethod === 'CREDIT_CARD'"
                  (click)="paymentMethod = 'CREDIT_CARD'"
                >
                  <div
                    class="w-4 h-4 rounded-full border-2 flex items-center justify-center"
                    [class.border-black]="paymentMethod === 'CREDIT_CARD'"
                    [class.border-gray-300]="paymentMethod !== 'CREDIT_CARD'"
                  >
                    @if (paymentMethod === 'CREDIT_CARD') {
                    <div class="w-2 h-2 rounded-full bg-black"></div>
                    }
                  </div>
                  <div class="flex-1">
                    <span class="text-sm font-medium">Cartão de Crédito</span>
                    <p class="text-xs text-gray-500">Em até 6x sem juros</p>
                  </div>
                </div>

                @if (paymentMethod === 'CREDIT_CARD') {
                <div class="p-4 space-y-3">
                  <input
                    type="text"
                    placeholder="Número do cartão"
                    class="w-full border border-gray-200 px-4 py-3 focus:border-black focus:ring-0"
                  />
                  <div class="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="MM/AA"
                      class="border border-gray-200 px-4 py-3 focus:border-black focus:ring-0"
                    />
                    <input
                      type="text"
                      placeholder="CVV"
                      class="border border-gray-200 px-4 py-3 focus:border-black focus:ring-0"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Nome no cartão"
                    class="w-full border border-gray-200 px-4 py-3 focus:border-black focus:ring-0"
                  />
                  <select
                    class="w-full border border-gray-200 px-4 py-3 focus:border-black focus:ring-0"
                  >
                    <option>
                      1x de {{ total | currency : 'BRL' : 'symbol' : '1.2-2' }}
                    </option>
                    <option>
                      2x de
                      {{ total / 2 | currency : 'BRL' : 'symbol' : '1.2-2' }}
                    </option>
                    <option>
                      3x de
                      {{ total / 3 | currency : 'BRL' : 'symbol' : '1.2-2' }}
                    </option>
                    <option>
                      4x de
                      {{ total / 4 | currency : 'BRL' : 'symbol' : '1.2-2' }}
                    </option>
                    <option>
                      5x de
                      {{ total / 5 | currency : 'BRL' : 'symbol' : '1.2-2' }}
                    </option>
                    <option>
                      6x de
                      {{ total / 6 | currency : 'BRL' : 'symbol' : '1.2-2' }}
                    </option>
                  </select>
                </div>
                }

                <!-- Boleto -->
                <div
                  class="flex items-center gap-4 p-4 cursor-pointer transition-colors"
                  [class.bg-cream-50]="paymentMethod === 'BOLETO'"
                  (click)="paymentMethod = 'BOLETO'"
                >
                  <div
                    class="w-4 h-4 rounded-full border-2 flex items-center justify-center"
                    [class.border-black]="paymentMethod === 'BOLETO'"
                    [class.border-gray-300]="paymentMethod !== 'BOLETO'"
                  >
                    @if (paymentMethod === 'BOLETO') {
                    <div class="w-2 h-2 rounded-full bg-black"></div>
                    }
                  </div>
                  <div class="flex-1">
                    <span class="text-sm font-medium">Boleto Bancário</span>
                    <p class="text-xs text-gray-500">
                      Vencimento em 3 dias úteis
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <!-- Submit Button -->
            <button
              (click)="placeOrder()"
              [disabled]="processing() || !isFormValid()"
              class="w-full btn-primary py-4 disabled:opacity-50"
            >
              @if (processing()) {
              <span class="flex items-center justify-center gap-2">
                <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                    fill="none"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  ></path>
                </svg>
                Processando...
              </span>
              } @else { Finalizar Pedido •
              {{ finalTotal | currency : 'BRL' : 'symbol' : '1.2-2' }}
              }
            </button>

            <p class="text-xs text-gray-500 text-center mt-4">
              Ao finalizar, você concorda com nossos
              <a href="#" class="underline">Termos</a> e
              <a href="#" class="underline">Política de Privacidade</a>
            </p>
          </div>

          <!-- Right Column: Order Summary -->
          <div class="order-1 lg:order-2">
            <div class="lg:sticky lg:top-8">
              <h2 class="text-xs tracking-wider uppercase font-medium mb-6">
                Resumo do Pedido
              </h2>

              <!-- Cart Items -->
              <div class="space-y-4 mb-6">
                @for (item of cart.cartItems(); track item.id) {
                <div class="flex gap-4">
                  <div class="relative w-20 h-24 bg-cream-50 flex-shrink-0">
                    <img
                      [src]="
                        item.imageUrl ||
                        'https://placehold.co/80x96/f5f5f5/999?text=Sem+Imagem'
                      "
                      [alt]="item.productName"
                      class="w-full h-full object-cover"
                    />
                    <span
                      class="absolute -top-2 -right-2 w-5 h-5 bg-gray-500 text-white text-xs rounded-full flex items-center justify-center"
                    >
                      {{ item.quantity }}
                    </span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <h3 class="text-sm font-medium truncate">
                      {{ item.productName }}
                    </h3>
                    @if (item.size || item.color) {
                    <p class="text-xs text-gray-500">
                      {{ item.size }} {{ item.color ? '/ ' + item.color : '' }}
                    </p>
                    }
                    <p class="text-sm mt-1">
                      {{
                        item.subtotal | currency : 'BRL' : 'symbol' : '1.2-2'
                      }}
                    </p>
                  </div>
                </div>
                }
              </div>

              <!-- Coupon -->
              <div class="flex gap-2 mb-6">
                <input
                  type="text"
                  [(ngModel)]="couponCode"
                  placeholder="Cupom de desconto"
                  class="flex-1 border border-gray-200 px-4 py-3 text-sm focus:border-black focus:ring-0"
                />
                <button class="btn-secondary px-6">Aplicar</button>
              </div>

              <!-- Totals -->
              <div class="border-t border-gray-100 pt-4 space-y-2">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-500">Subtotal</span>
                  <span>{{
                    cart.cartTotal() | currency : 'BRL' : 'symbol' : '1.2-2'
                  }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-500">Frete</span>
                  <span>{{
                    shippingCost > 0
                      ? (shippingCost | currency : 'BRL' : 'symbol' : '1.2-2')
                      : 'Grátis'
                  }}</span>
                </div>
                @if (paymentMethod === 'PIX') {
                <div class="flex justify-between text-sm text-green-600">
                  <span>Desconto PIX (5%)</span>
                  <span
                    >-{{
                      pixDiscount | currency : 'BRL' : 'symbol' : '1.2-2'
                    }}</span
                  >
                </div>
                }
                <div
                  class="flex justify-between text-lg font-medium pt-2 border-t border-gray-100"
                >
                  <span>Total</span>
                  <span>{{
                    finalTotal | currency : 'BRL' : 'symbol' : '1.2-2'
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      }
    </div>
  `,
})
export class CheckoutComponent implements OnInit {
  private router = inject(Router);
  cart = inject(CartService);
  private orderService = inject(OrderService);
  auth = inject(AuthService);

  // Contact info
  email = '';
  name = '';
  phone = '';

  // Address
  address = {
    recipientName: '',
    zipCode: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    phone: '',
  };

  // Shipping & Payment
  shippingMethod: 'standard' | 'express' = 'standard';
  paymentMethod: 'PIX' | 'CREDIT_CARD' | 'BOLETO' = 'PIX';
  couponCode = '';

  processing = signal(false);

  states = [
    { uf: 'AC', name: 'Acre' },
    { uf: 'AL', name: 'Alagoas' },
    { uf: 'AP', name: 'Amapá' },
    { uf: 'AM', name: 'Amazonas' },
    { uf: 'BA', name: 'Bahia' },
    { uf: 'CE', name: 'Ceará' },
    { uf: 'DF', name: 'Distrito Federal' },
    { uf: 'ES', name: 'Espírito Santo' },
    { uf: 'GO', name: 'Goiás' },
    { uf: 'MA', name: 'Maranhão' },
    { uf: 'MT', name: 'Mato Grosso' },
    { uf: 'MS', name: 'Mato Grosso do Sul' },
    { uf: 'MG', name: 'Minas Gerais' },
    { uf: 'PA', name: 'Pará' },
    { uf: 'PB', name: 'Paraíba' },
    { uf: 'PR', name: 'Paraná' },
    { uf: 'PE', name: 'Pernambuco' },
    { uf: 'PI', name: 'Piauí' },
    { uf: 'RJ', name: 'Rio de Janeiro' },
    { uf: 'RN', name: 'Rio Grande do Norte' },
    { uf: 'RS', name: 'Rio Grande do Sul' },
    { uf: 'RO', name: 'Rondônia' },
    { uf: 'RR', name: 'Roraima' },
    { uf: 'SC', name: 'Santa Catarina' },
    { uf: 'SP', name: 'São Paulo' },
    { uf: 'SE', name: 'Sergipe' },
    { uf: 'TO', name: 'Tocantins' },
  ];

  ngOnInit(): void {
    // Preenche dados do usuário logado
    if (this.auth.isAuthenticated()) {
      const user = this.auth.currentUser();
      if (user) {
        this.email = user.email || '';
        this.name = user.name || '';
        this.phone = (user as any).phone || '';
        this.address.recipientName = user.name || '';
      }
    }
  }

  get shippingCost(): number {
    if (this.shippingMethod === 'express') return 29.9;
    return this.cart.cartTotal() >= 299 ? 0 : 15;
  }

  get total(): number {
    return this.cart.cartTotal() + this.shippingCost;
  }

  get pixDiscount(): number {
    return this.total * 0.05;
  }

  get pixTotal(): number {
    return this.total - this.pixDiscount;
  }

  get finalTotal(): number {
    return this.paymentMethod === 'PIX' ? this.pixTotal : this.total;
  }

  lookupCep(): void {
    const cep = this.address.zipCode.replace(/\D/g, '');
    if (cep.length === 8) {
      fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then((res) => res.json())
        .then((data) => {
          if (!data.erro) {
            this.address.street = data.logradouro || '';
            this.address.neighborhood = data.bairro || '';
            this.address.city = data.localidade || '';
            this.address.state = data.uf || '';
          }
        })
        .catch(() => {});
    }
  }

  isFormValid(): boolean {
    return !!(
      this.email &&
      this.name &&
      this.address.recipientName &&
      this.address.zipCode &&
      this.address.street &&
      this.address.number &&
      this.address.neighborhood &&
      this.address.city &&
      this.address.state
    );
  }

  placeOrder(): void {
    if (!this.isFormValid()) return;

    this.processing.set(true);

    const shippingAddress = {
      recipientName: this.address.recipientName,
      zipCode: this.address.zipCode,
      street: this.address.street,
      number: this.address.number,
      complement: this.address.complement || undefined,
      neighborhood: this.address.neighborhood,
      city: this.address.city,
      state: this.address.state,
      phone: this.address.phone,
    };

    // Se usuário está logado, usa endpoint autenticado
    if (this.auth.isAuthenticated()) {
      const authenticatedRequest = {
        shippingAddress,
        paymentMethod: this.paymentMethod as 'PIX' | 'CREDIT_CARD' | 'BOLETO',
      };

      this.orderService.createOrder(authenticatedRequest).subscribe({
        next: (order) => {
          this.cart.clearCart().subscribe();
          this.router.navigate(['/checkout/success'], {
            queryParams: { order: order.orderNumber },
          });
        },
        error: (err) => {
          console.error('Error creating order:', err);
          this.processing.set(false);
          alert('Erro ao processar pedido. Tente novamente.');
        },
      });
    } else {
      // Guest checkout
      const request: GuestOrderRequest = {
        guestEmail: this.email,
        guestName: this.name,
        guestPhone: this.phone,
        shippingAddress,
        paymentMethod: this.paymentMethod as 'PIX' | 'CREDIT_CARD' | 'BOLETO',
        items: this.cart.cartItems().map((item) => ({
          productId: item.productId,
          variantId: item.variantId ?? undefined,
          quantity: item.quantity,
        })),
      };

      this.orderService.createGuestOrder(request).subscribe({
        next: (order) => {
          this.cart.clearCart().subscribe();
          this.router.navigate(['/checkout/success'], {
            queryParams: { order: order.orderNumber },
          });
        },
        error: (err) => {
          console.error('Error creating order:', err);
          this.processing.set(false);
          alert('Erro ao processar pedido. Tente novamente.');
        },
      });
    }
  }
}
