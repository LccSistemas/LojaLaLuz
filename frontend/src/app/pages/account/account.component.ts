import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe, DatePipe],
  template: `
    <div class="bg-gray-50 min-h-screen py-8">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <!-- Sidebar -->
          <div class="lg:col-span-1">
            <div class="bg-white rounded-xl p-6">
              <!-- User Info -->
              <div class="text-center mb-6">
                <div
                  class="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <span class="text-2xl font-bold text-primary-600">
                    {{ user()?.name?.charAt(0)?.toUpperCase() }}
                  </span>
                </div>
                <h2 class="font-bold text-gray-900">{{ user()?.name }}</h2>
                <p class="text-sm text-gray-500">{{ user()?.email }}</p>
              </div>

              <!-- Menu -->
              <nav class="space-y-1">
                <button
                  (click)="activeTab.set('orders')"
                  [class.bg-primary-50]="activeTab() === 'orders'"
                  [class.text-primary-600]="activeTab() === 'orders'"
                  class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left hover:bg-gray-50 transition-colors"
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
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  Meus Pedidos
                </button>
                <button
                  (click)="activeTab.set('profile')"
                  [class.bg-primary-50]="activeTab() === 'profile'"
                  [class.text-primary-600]="activeTab() === 'profile'"
                  class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left hover:bg-gray-50 transition-colors"
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Meus Dados
                </button>
                <button
                  (click)="activeTab.set('addresses')"
                  [class.bg-primary-50]="activeTab() === 'addresses'"
                  [class.text-primary-600]="activeTab() === 'addresses'"
                  class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left hover:bg-gray-50 transition-colors"
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
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Endereços
                </button>
                <button
                  (click)="logout()"
                  class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-red-600 hover:bg-red-50 transition-colors"
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
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Sair
                </button>
              </nav>
            </div>
          </div>

          <!-- Content -->
          <div class="lg:col-span-3">
            <!-- Orders Tab -->
            @if (activeTab() === 'orders') {
            <div class="bg-white rounded-xl p-6">
              <h2 class="text-xl font-bold mb-6">Meus Pedidos</h2>

              @if (loading()) {
              <div class="text-center py-12">
                <svg
                  class="animate-spin h-8 w-8 mx-auto text-primary-600"
                  viewBox="0 0 24 24"
                >
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
              </div>
              } @else if (orders().length === 0) {
              <div class="text-center py-12">
                <svg
                  class="w-16 h-16 text-gray-300 mx-auto mb-4"
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
                <h3 class="text-lg font-medium text-gray-900 mb-2">
                  Nenhum pedido
                </h3>
                <p class="text-gray-500 mb-4">
                  Você ainda não fez nenhum pedido
                </p>
                <a routerLink="/produtos" class="btn-primary"
                  >Começar a Comprar</a
                >
              </div>
              } @else {
              <div class="space-y-4">
                @for (order of orders(); track order.id) {
                <div class="border rounded-xl p-4">
                  <div
                    class="flex flex-wrap gap-4 justify-between items-start mb-4"
                  >
                    <div>
                      <p class="font-medium text-gray-900">
                        Pedido #{{ order.orderNumber }}
                      </p>
                      <p class="text-sm text-gray-500">
                        {{ order.createdAt | date : 'dd/MM/yyyy HH:mm' }}
                      </p>
                    </div>
                    <div class="text-right">
                      <span
                        [class]="getStatusClass(order.status)"
                        class="px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {{ getStatusLabel(order.status) }}
                      </span>
                      <p class="font-bold mt-2">
                        {{
                          order.total | currency : 'BRL' : 'symbol' : '1.2-2'
                        }}
                      </p>
                    </div>
                  </div>

                  <div class="flex flex-wrap gap-2">
                    @for (item of order.items.slice(0, 3); track item.id) {
                    <img
                      [src]="item.imageUrl || 'https://via.placeholder.com/60'"
                      class="w-14 h-14 rounded-lg object-cover"
                    />
                    } @if (order.items.length > 3) {
                    <div
                      class="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center text-sm text-gray-500"
                    >
                      +{{ order.items.length - 3 }}
                    </div>
                    }
                  </div>

                  <div class="mt-4 pt-4 border-t flex gap-4">
                    <button class="text-sm text-primary-600 hover:underline">
                      Ver detalhes
                    </button>
                    @if (order.trackingCode) {
                    <button class="text-sm text-primary-600 hover:underline">
                      Rastrear pedido
                    </button>
                    }
                  </div>
                </div>
                }
              </div>
              }
            </div>
            }

            <!-- Profile Tab -->
            @if (activeTab() === 'profile') {
            <div class="bg-white rounded-xl p-6">
              <h2 class="text-xl font-bold mb-6">Meus Dados</h2>

              <form class="space-y-4 max-w-lg">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2"
                    >Nome completo</label
                  >
                  <input
                    type="text"
                    [value]="user()?.name"
                    class="input-field"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2"
                    >E-mail</label
                  >
                  <input
                    type="email"
                    [value]="user()?.email"
                    class="input-field"
                    disabled
                  />
                  <p class="text-xs text-gray-500 mt-1">
                    O e-mail não pode ser alterado
                  </p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2"
                    >Telefone</label
                  >
                  <input
                    type="tel"
                    [value]="user()?.phone"
                    class="input-field"
                    placeholder="(11) 99999-9999"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2"
                    >CPF</label
                  >
                  <input
                    type="text"
                    [value]="user()?.cpf"
                    class="input-field"
                    placeholder="000.000.000-00"
                  />
                </div>

                <button type="button" class="btn-primary">
                  Salvar Alterações
                </button>
              </form>

              <hr class="my-8" />

              <h3 class="font-bold mb-4">Alterar Senha</h3>
              <form class="space-y-4 max-w-lg">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2"
                    >Senha atual</label
                  >
                  <input type="password" class="input-field" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2"
                    >Nova senha</label
                  >
                  <input type="password" class="input-field" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2"
                    >Confirmar nova senha</label
                  >
                  <input type="password" class="input-field" />
                </div>
                <button type="button" class="btn-secondary">
                  Alterar Senha
                </button>
              </form>
            </div>
            }

            <!-- Addresses Tab -->
            @if (activeTab() === 'addresses') {
            <div class="bg-white rounded-xl p-6">
              <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-bold">Meus Endereços</h2>
                <button class="btn-primary">+ Novo Endereço</button>
              </div>

              @if (user()?.addresses?.length === 0) {
              <div class="text-center py-12">
                <svg
                  class="w-16 h-16 text-gray-300 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                </svg>
                <h3 class="text-lg font-medium text-gray-900 mb-2">
                  Nenhum endereço cadastrado
                </h3>
                <p class="text-gray-500">
                  Adicione um endereço para suas entregas
                </p>
              </div>
              } @else {
              <div class="grid gap-4">
                @for (address of user()?.addresses; track address.id) {
                <div class="border rounded-lg p-4 flex justify-between">
                  <div>
                    <p class="font-medium">
                      {{ address.street }}, {{ address.number }}
                    </p>
                    <p class="text-sm text-gray-600">
                      {{ address.neighborhood }} - {{ address.city }}/{{
                        address.state
                      }}
                    </p>
                    <p class="text-sm text-gray-500">
                      CEP: {{ address.zipCode }}
                    </p>
                  </div>
                  <div class="flex gap-2">
                    <button class="text-primary-600 hover:underline text-sm">
                      Editar
                    </button>
                    <button class="text-red-600 hover:underline text-sm">
                      Excluir
                    </button>
                  </div>
                </div>
                }
              </div>
              }
            </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AccountComponent implements OnInit {
  private authService = inject(AuthService);
  private orderService = inject(OrderService);

  user = this.authService.currentUser;
  activeTab = signal<'orders' | 'profile' | 'addresses'>('orders');
  orders = signal<Order[]>([]);
  loading = signal(false);

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading.set(true);
    this.orderService.getMyOrders().subscribe({
      next: (response) => {
        this.orders.set(response.content);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      PENDING: 'Pendente',
      PAID: 'Pago',
      PROCESSING: 'Em preparação',
      SHIPPED: 'Enviado',
      DELIVERED: 'Entregue',
      CANCELLED: 'Cancelado',
    };
    return labels[status] || status;
  }

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      PAID: 'bg-blue-100 text-blue-800',
      PROCESSING: 'bg-purple-100 text-purple-800',
      SHIPPED: 'bg-indigo-100 text-indigo-800',
      DELIVERED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
  }

  logout(): void {
    this.authService.logout();
  }
}
