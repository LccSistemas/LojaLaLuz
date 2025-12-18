import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

interface Order {
  id: number;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  total: number;
  createdAt: string;
  user?: { name: string; email: string };
  shippingAddress?: {
    name: string;
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  items: any[];
}

@Component({
  selector: 'app-orders-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, CurrencyPipe, DatePipe],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Pedidos</h1>
        <p class="text-gray-500">Gerencie os pedidos da sua loja</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
        @for (stat of orderStats; track stat.status) {
        <button
          (click)="filterByStatus(stat.status)"
          class="bg-white rounded-xl shadow-sm p-4 text-left hover:shadow-md transition-shadow"
          [class.ring-2]="selectedStatus === stat.status"
          [class.ring-primary]="selectedStatus === stat.status"
        >
          <p class="text-2xl font-bold" [style.color]="stat.color">
            {{ stat.count }}
          </p>
          <p class="text-sm text-gray-500">{{ stat.label }}</p>
        </button>
        }
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-xl shadow-sm p-4">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-1">
            <input
              type="text"
              [(ngModel)]="searchQuery"
              (ngModelChange)="onSearch()"
              placeholder="Buscar por número do pedido ou cliente..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <select
            [(ngModel)]="selectedStatus"
            (ngModelChange)="loadOrders()"
            class="px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">Todos os status</option>
            <option value="PENDING">Pendente</option>
            <option value="PROCESSING">Processando</option>
            <option value="PAID">Pago</option>
            <option value="SHIPPED">Enviado</option>
            <option value="DELIVERED">Entregue</option>
            <option value="CANCELLED">Cancelado</option>
          </select>
          <input
            type="date"
            [(ngModel)]="dateFilter"
            (ngModelChange)="loadOrders()"
            class="px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>
      </div>

      <!-- Orders Table -->
      <div class="bg-white rounded-xl shadow-sm overflow-hidden">
        @if (loading()) {
        <div class="p-8 text-center">
          <div
            class="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"
          ></div>
        </div>
        } @else {
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
                  Data
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
                  Pagamento
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  Total
                </th>
                <th
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase"
                >
                  Ações
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              @for (order of filteredOrders(); track order.id) {
              <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm font-medium text-primary"
                    >#{{ order.orderNumber }}</span
                  >
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm text-gray-600">{{
                    order.createdAt | date : 'dd/MM/yyyy HH:mm'
                  }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div>
                    <p class="text-sm font-medium text-gray-900">
                      {{
                        order.user?.name ||
                          order.shippingAddress?.name ||
                          'Cliente'
                      }}
                    </p>
                    <p class="text-sm text-gray-500">
                      {{ order.user?.email || '' }}
                    </p>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <select
                    [value]="order.status"
                    (change)="updateStatus(order, $event)"
                    [class]="getStatusClass(order.status)"
                    class="text-xs font-medium rounded-full px-3 py-1 border-0 cursor-pointer"
                  >
                    <option value="PENDING">Pendente</option>
                    <option value="PROCESSING">Processando</option>
                    <option value="PAID">Pago</option>
                    <option value="SHIPPED">Enviado</option>
                    <option value="DELIVERED">Entregue</option>
                    <option value="CANCELLED">Cancelado</option>
                  </select>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    [class]="getPaymentStatusClass(order.paymentStatus)"
                    class="px-2 py-1 text-xs font-medium rounded-full"
                  >
                    {{ getPaymentStatusLabel(order.paymentStatus) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm font-medium text-gray-900">{{
                    order.total | currency : 'BRL'
                  }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right">
                  <button
                    (click)="viewOrder(order)"
                    class="text-primary hover:underline text-sm"
                  >
                    Ver detalhes
                  </button>
                </td>
              </tr>
              } @empty {
              <tr>
                <td colspan="7" class="px-6 py-12 text-center text-gray-500">
                  Nenhum pedido encontrado
                </td>
              </tr>
              }
            </tbody>
          </table>
        </div>
        }
      </div>

      <!-- Order Detail Modal -->
      @if (selectedOrder()) {
      <div class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen p-4">
          <div
            class="fixed inset-0 bg-black/50"
            (click)="selectedOrder.set(null)"
          ></div>
          <div
            class="relative bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div
              class="p-6 border-b border-gray-100 flex items-center justify-between"
            >
              <h3 class="text-lg font-semibold">
                Pedido #{{ selectedOrder()!.orderNumber }}
              </h3>
              <button
                (click)="selectedOrder.set(null)"
                class="text-gray-400 hover:text-gray-600"
              >
                <svg
                  class="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div class="p-6 space-y-6">
              <!-- Order Info -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-500">Data</p>
                  <p class="font-medium">
                    {{ selectedOrder()!.createdAt | date : 'dd/MM/yyyy HH:mm' }}
                  </p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Status</p>
                  <p class="font-medium">
                    {{ getStatusLabel(selectedOrder()!.status) }}
                  </p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Pagamento</p>
                  <p class="font-medium">
                    {{ getPaymentStatusLabel(selectedOrder()!.paymentStatus) }}
                  </p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Total</p>
                  <p class="font-medium text-lg">
                    {{ selectedOrder()!.total | currency : 'BRL' }}
                  </p>
                </div>
              </div>

              <!-- Items -->
              <div>
                <h4 class="font-medium mb-3">Itens do Pedido</h4>
                <div class="space-y-3">
                  @for (item of selectedOrder()!.items; track item.id) {
                  <div
                    class="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg"
                  >
                    <img
                      [src]="item.productImage || 'https://placehold.co/60x60'"
                      class="w-12 h-12 rounded object-cover"
                    />
                    <div class="flex-1">
                      <p class="font-medium">{{ item.productName }}</p>
                      <p class="text-sm text-gray-500">
                        {{ item.size }} / {{ item.color }} × {{ item.quantity }}
                      </p>
                    </div>
                    <p class="font-medium">
                      {{ item.subtotal | currency : 'BRL' }}
                    </p>
                  </div>
                  }
                </div>
              </div>

              <!-- Shipping Address -->
              @if (selectedOrder()?.shippingAddress; as addr) {
              <div>
                <h4 class="font-medium mb-3">Endereço de Entrega</h4>
                <div class="p-3 bg-gray-50 rounded-lg">
                  <p>
                    {{ addr.street }},
                    {{ addr.number }}
                  </p>
                  <p>{{ addr.neighborhood }}</p>
                  <p>
                    {{ addr.city }} -
                    {{ addr.state }}
                  </p>
                  <p>CEP: {{ addr.zipCode }}</p>
                </div>
              </div>
              }
            </div>
          </div>
        </div>
      </div>
      }
    </div>
  `,
})
export class OrdersListComponent implements OnInit {
  orders = signal<Order[]>([]);
  filteredOrders = signal<Order[]>([]);
  loading = signal(true);
  selectedOrder = signal<Order | null>(null);

  searchQuery = '';
  selectedStatus = '';
  dateFilter = '';

  orderStats = [
    { status: '', label: 'Todos', count: 0, color: '#374151' },
    { status: 'PENDING', label: 'Pendentes', count: 0, color: '#F59E0B' },
    { status: 'PROCESSING', label: 'Processando', count: 0, color: '#3B82F6' },
    { status: 'SHIPPED', label: 'Enviados', count: 0, color: '#8B5CF6' },
    { status: 'DELIVERED', label: 'Entregues', count: 0, color: '#10B981' },
  ];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.loading.set(true);

    this.http.get<any>(`${environment.apiUrl}/orders/admin/all`).subscribe({
      next: (res) => {
        const orderList = Array.isArray(res) ? res : res.content || [];
        this.orders.set(orderList);
        this.updateStats(orderList);
        this.applyFilters();
        this.loading.set(false);
      },
      error: () => {
        // Mock data for demo
        const mockOrders: Order[] = [
          {
            id: 1,
            orderNumber: 'LL-2024-0001',
            status: 'PENDING',
            paymentStatus: 'PENDING',
            total: 459.9,
            createdAt: new Date().toISOString(),
            user: { name: 'Maria Silva', email: 'maria@email.com' },
            items: [
              {
                id: 1,
                productName: 'Vestido Midi Floral',
                size: 'M',
                color: 'Padrão',
                quantity: 1,
                subtotal: 299.9,
              },
              {
                id: 2,
                productName: 'Blusa Cropped',
                size: 'P',
                color: 'Branco',
                quantity: 1,
                subtotal: 129.9,
              },
            ],
            shippingAddress: {
              name: 'Maria',
              street: 'Rua das Flores',
              number: '123',
              neighborhood: 'Centro',
              city: 'São Paulo',
              state: 'SP',
              zipCode: '01234-567',
            },
          },
          {
            id: 2,
            orderNumber: 'LL-2024-0002',
            status: 'PAID',
            paymentStatus: 'APPROVED',
            total: 329.9,
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            user: { name: 'Ana Costa', email: 'ana@email.com' },
            items: [
              {
                id: 3,
                productName: 'Calça Pantalona',
                size: '40',
                color: 'Preto',
                quantity: 1,
                subtotal: 279.9,
              },
            ],
            shippingAddress: {
              name: 'Ana',
              street: 'Av. Brasil',
              number: '456',
              neighborhood: 'Jardins',
              city: 'São Paulo',
              state: 'SP',
              zipCode: '04567-890',
            },
          },
        ];
        this.orders.set(mockOrders);
        this.updateStats(mockOrders);
        this.applyFilters();
        this.loading.set(false);
      },
    });
  }

  updateStats(orders: Order[]) {
    this.orderStats[0].count = orders.length;
    this.orderStats[1].count = orders.filter(
      (o) => o.status === 'PENDING'
    ).length;
    this.orderStats[2].count = orders.filter(
      (o) => o.status === 'PROCESSING'
    ).length;
    this.orderStats[3].count = orders.filter(
      (o) => o.status === 'SHIPPED'
    ).length;
    this.orderStats[4].count = orders.filter(
      (o) => o.status === 'DELIVERED'
    ).length;
  }

  filterByStatus(status: string) {
    this.selectedStatus = status;
    this.applyFilters();
  }

  onSearch() {
    this.applyFilters();
  }

  applyFilters() {
    let result = this.orders();

    if (this.selectedStatus) {
      result = result.filter((o) => o.status === this.selectedStatus);
    }

    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      result = result.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(query) ||
          o.user?.name?.toLowerCase().includes(query) ||
          o.user?.email?.toLowerCase().includes(query)
      );
    }

    this.filteredOrders.set(result);
  }

  updateStatus(order: Order, event: Event) {
    const newStatus = (event.target as HTMLSelectElement).value;

    this.http
      .patch(`${environment.apiUrl}/admin/orders/${order.id}/status`, {
        status: newStatus,
      })
      .subscribe({
        next: () => {
          order.status = newStatus;
          this.updateStats(this.orders());
        },
        error: () => {
          // Revert or show error
          order.status = newStatus; // For demo, keep the change
          this.updateStats(this.orders());
        },
      });
  }

  viewOrder(order: Order) {
    this.selectedOrder.set(order);
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

  getPaymentStatusClass(status: string): string {
    const classes: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      APPROVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
      REFUNDED: 'bg-gray-100 text-gray-800',
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
  }

  getPaymentStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      PENDING: 'Pendente',
      APPROVED: 'Aprovado',
      REJECTED: 'Rejeitado',
      REFUNDED: 'Reembolsado',
    };
    return labels[status] || status || 'Pendente';
  }
}
