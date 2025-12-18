import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalCustomers: number;
  pendingOrders: number;
  recentOrders: any[];
  topProducts: any[];
  salesByDay: { date: string; total: number }[];
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe],
  template: `
    <div class="space-y-6">
      <!-- Page Header -->
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p class="text-gray-500">Visão geral da sua loja</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Total Revenue -->
        <div class="bg-white rounded-xl shadow-sm p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500">Receita Total</p>
              <p class="text-2xl font-bold text-gray-900 mt-1">
                {{ stats().totalRevenue | currency : 'BRL' }}
              </p>
            </div>
            <div
              class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center"
            >
              <svg
                class="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <div class="mt-4 flex items-center text-sm">
            <span class="text-green-500 font-medium">+12.5%</span>
            <span class="text-gray-400 ml-2">vs mês anterior</span>
          </div>
        </div>

        <!-- Total Orders -->
        <div class="bg-white rounded-xl shadow-sm p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500">Total Pedidos</p>
              <p class="text-2xl font-bold text-gray-900 mt-1">
                {{ stats().totalOrders }}
              </p>
            </div>
            <div
              class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center"
            >
              <svg
                class="w-6 h-6 text-blue-600"
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
            </div>
          </div>
          <div class="mt-4 flex items-center text-sm">
            <span class="text-green-500 font-medium">+8.2%</span>
            <span class="text-gray-400 ml-2">vs mês anterior</span>
          </div>
        </div>

        <!-- Total Products -->
        <div class="bg-white rounded-xl shadow-sm p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500">Produtos</p>
              <p class="text-2xl font-bold text-gray-900 mt-1">
                {{ stats().totalProducts }}
              </p>
            </div>
            <div
              class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center"
            >
              <svg
                class="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
          </div>
          <div class="mt-4">
            <a
              routerLink="/admin/products"
              class="text-sm text-primary hover:underline"
            >
              Gerenciar produtos →
            </a>
          </div>
        </div>

        <!-- Pending Orders -->
        <div class="bg-white rounded-xl shadow-sm p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500">Pedidos Pendentes</p>
              <p class="text-2xl font-bold text-gray-900 mt-1">
                {{ stats().pendingOrders }}
              </p>
            </div>
            <div
              class="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center"
            >
              <svg
                class="w-6 h-6 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <div class="mt-4">
            <a
              routerLink="/admin/orders"
              class="text-sm text-primary hover:underline"
            >
              Ver pedidos →
            </a>
          </div>
        </div>
      </div>

      <!-- Charts and Tables Row -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Recent Orders -->
        <div class="lg:col-span-2 bg-white rounded-xl shadow-sm">
          <div class="p-6 border-b border-gray-100">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-semibold text-gray-900">
                Pedidos Recentes
              </h2>
              <a
                routerLink="/admin/orders"
                class="text-sm text-primary hover:underline"
              >
                Ver todos
              </a>
            </div>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    Pedido
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    Cliente
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    Status
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    Total
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                @for (order of stats().recentOrders; track order.id) {
                <tr class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="text-sm font-medium text-gray-900"
                      >#{{ order.orderNumber }}</span
                    >
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="text-sm text-gray-600">{{
                      order.customerName
                    }}</span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      [class]="getStatusClass(order.status)"
                      class="px-2 py-1 text-xs font-medium rounded-full"
                    >
                      {{ getStatusLabel(order.status) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="text-sm font-medium text-gray-900">{{
                      order.total | currency : 'BRL'
                    }}</span>
                  </td>
                </tr>
                } @empty {
                <tr>
                  <td colspan="4" class="px-6 py-8 text-center text-gray-500">
                    Nenhum pedido ainda
                  </td>
                </tr>
                }
              </tbody>
            </table>
          </div>
        </div>

        <!-- Top Products -->
        <div class="bg-white rounded-xl shadow-sm">
          <div class="p-6 border-b border-gray-100">
            <h2 class="text-lg font-semibold text-gray-900">
              Produtos Mais Vendidos
            </h2>
          </div>
          <div class="p-6 space-y-4">
            @for (product of stats().topProducts; track product.id) {
            <div class="flex items-center space-x-4">
              <img
                [src]="
                  product.image || 'https://placehold.co/60x60?text=Produto'
                "
                [alt]="product.name"
                class="w-12 h-12 rounded-lg object-cover"
              />
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">
                  {{ product.name }}
                </p>
                <p class="text-sm text-gray-500">{{ product.sold }} vendidos</p>
              </div>
              <span class="text-sm font-medium text-gray-900">{{
                product.revenue | currency : 'BRL'
              }}</span>
            </div>
            } @empty {
            <p class="text-center text-gray-500 py-4">Nenhuma venda ainda</p>
            }
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white rounded-xl shadow-sm p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a
            routerLink="/admin/products/new"
            class="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg
              class="w-8 h-8 text-primary mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <span class="text-sm font-medium text-gray-700">Novo Produto</span>
          </a>
          <a
            routerLink="/admin/categories/new"
            class="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg
              class="w-8 h-8 text-primary mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            <span class="text-sm font-medium text-gray-700"
              >Nova Categoria</span
            >
          </a>
          <a
            routerLink="/admin/orders"
            class="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg
              class="w-8 h-8 text-primary mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <span class="text-sm font-medium text-gray-700">Ver Pedidos</span>
          </a>
          <a
            routerLink="/admin/banners"
            class="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg
              class="w-8 h-8 text-primary mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span class="text-sm font-medium text-gray-700"
              >Editar Banners</span
            >
          </a>
        </div>
      </div>
    </div>
  `,
})
export class AdminDashboardComponent implements OnInit {
  stats = signal<DashboardStats>({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalCustomers: 0,
    pendingOrders: 0,
    recentOrders: [],
    topProducts: [],
    salesByDay: [],
  });

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    // Load products count
    this.http.get<any>(`${environment.apiUrl}/products?size=1`).subscribe({
      next: (res) => {
        this.stats.update((s) => ({
          ...s,
          totalProducts: res.totalElements || 0,
        }));
      },
    });

    // Load orders
    this.http.get<any>(`${environment.apiUrl}/orders`).subscribe({
      next: (orders) => {
        const orderList = Array.isArray(orders) ? orders : orders.content || [];
        const pendingOrders = orderList.filter(
          (o: any) => o.status === 'PENDING' || o.status === 'PROCESSING'
        ).length;
        const totalRevenue = orderList.reduce(
          (sum: number, o: any) => sum + (o.total || 0),
          0
        );

        this.stats.update((s) => ({
          ...s,
          totalOrders: orderList.length,
          pendingOrders,
          totalRevenue,
          recentOrders: orderList.slice(0, 5).map((o: any) => ({
            id: o.id,
            orderNumber: o.orderNumber || o.id,
            customerName: o.user?.name || o.shippingAddress?.name || 'Cliente',
            status: o.status,
            total: o.total,
          })),
        }));
      },
      error: () => {
        // API might require auth, use mock data for now
        this.stats.update((s) => ({
          ...s,
          recentOrders: [],
        }));
      },
    });

    // For demo, add some mock top products
    this.stats.update((s) => ({
      ...s,
      topProducts: [
        {
          id: 1,
          name: 'Vestido Midi Floral',
          image:
            'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=100',
          sold: 24,
          revenue: 7197.6,
        },
        {
          id: 2,
          name: 'Vestido Longo Cetim',
          image:
            'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=100',
          sold: 18,
          revenue: 7198.2,
        },
        {
          id: 3,
          name: 'Blusa Cropped Ribana',
          image:
            'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=100',
          sold: 32,
          revenue: 4156.8,
        },
      ],
    }));
  }

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      PROCESSING: 'bg-blue-100 text-blue-800',
      PAID: 'bg-green-100 text-green-800',
      SHIPPED: 'bg-purple-100 text-purple-800',
      DELIVERED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      PENDING: 'Pendente',
      PROCESSING: 'Processando',
      PAID: 'Pago',
      SHIPPED: 'Enviado',
      DELIVERED: 'Entregue',
      CANCELLED: 'Cancelado',
    };
    return labels[status] || status;
  }
}
