import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  ordersCount: number;
  totalSpent: number;
  lastOrderAt: string;
}

@Component({
  selector: 'app-customers-list',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, CurrencyPipe],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Clientes</h1>
        <p class="text-gray-500">Visualize todos os clientes da sua loja</p>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white rounded-xl shadow-sm p-6">
          <p class="text-sm text-gray-500">Total de Clientes</p>
          <p class="text-2xl font-bold text-gray-900 mt-1">
            {{ customers().length }}
          </p>
        </div>
        <div class="bg-white rounded-xl shadow-sm p-6">
          <p class="text-sm text-gray-500">Clientes Ativos (30 dias)</p>
          <p class="text-2xl font-bold text-green-600 mt-1">
            {{ getActiveCustomers() }}
          </p>
        </div>
        <div class="bg-white rounded-xl shadow-sm p-6">
          <p class="text-sm text-gray-500">Ticket Médio</p>
          <p class="text-2xl font-bold text-gray-900 mt-1">
            {{ getAverageTicket() | currency : 'BRL' }}
          </p>
        </div>
      </div>

      <!-- Search -->
      <div class="bg-white rounded-xl shadow-sm p-4">
        <input
          type="text"
          [(ngModel)]="searchQuery"
          (ngModelChange)="filterCustomers()"
          placeholder="Buscar por nome ou email..."
          class="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
      </div>

      <!-- Customers Table -->
      <div class="bg-white rounded-xl shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  Cliente
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  Cadastro
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  Pedidos
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  Total Gasto
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  Último Pedido
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              @for (customer of filteredCustomers(); track customer.id) {
              <tr class="hover:bg-gray-50">
                <td class="px-6 py-4">
                  <div class="flex items-center space-x-3">
                    <div
                      class="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center"
                    >
                      <span class="text-primary font-medium">{{
                        getInitials(customer.name)
                      }}</span>
                    </div>
                    <div>
                      <p class="font-medium text-gray-900">
                        {{ customer.name }}
                      </p>
                      <p class="text-sm text-gray-500">{{ customer.email }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 text-sm text-gray-600">
                  {{ customer.createdAt | date : 'dd/MM/yyyy' }}
                </td>
                <td class="px-6 py-4">
                  <span class="text-sm font-medium text-gray-900">{{
                    customer.ordersCount
                  }}</span>
                </td>
                <td class="px-6 py-4">
                  <span class="text-sm font-medium text-gray-900">{{
                    customer.totalSpent | currency : 'BRL'
                  }}</span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-600">
                  {{
                    customer.lastOrderAt
                      ? (customer.lastOrderAt | date : 'dd/MM/yyyy')
                      : '-'
                  }}
                </td>
              </tr>
              } @empty {
              <tr>
                <td colspan="5" class="px-6 py-12 text-center text-gray-500">
                  Nenhum cliente encontrado
                </td>
              </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
})
export class CustomersListComponent implements OnInit {
  customers = signal<Customer[]>([]);
  filteredCustomers = signal<Customer[]>([]);
  searchQuery = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadCustomers();
  }

  loadCustomers() {
    this.http.get<any>(`${environment.apiUrl}/users`).subscribe({
      next: (res) => {
        const users = Array.isArray(res) ? res : res.content || [];
        this.customers.set(users);
        this.filteredCustomers.set(users);
      },
      error: () => {
        // Mock data
        const mockCustomers: Customer[] = [
          {
            id: 1,
            name: 'Maria Silva',
            email: 'maria@email.com',
            phone: '11999999999',
            createdAt: '2024-01-15',
            ordersCount: 5,
            totalSpent: 1549.5,
            lastOrderAt: '2024-12-10',
          },
          {
            id: 2,
            name: 'Ana Costa',
            email: 'ana@email.com',
            phone: '11988888888',
            createdAt: '2024-03-20',
            ordersCount: 3,
            totalSpent: 899.7,
            lastOrderAt: '2024-12-05',
          },
          {
            id: 3,
            name: 'Julia Santos',
            email: 'julia@email.com',
            phone: '11977777777',
            createdAt: '2024-06-10',
            ordersCount: 1,
            totalSpent: 329.9,
            lastOrderAt: '2024-11-28',
          },
        ];
        this.customers.set(mockCustomers);
        this.filteredCustomers.set(mockCustomers);
      },
    });
  }

  filterCustomers() {
    if (!this.searchQuery) {
      this.filteredCustomers.set(this.customers());
      return;
    }
    const query = this.searchQuery.toLowerCase();
    this.filteredCustomers.set(
      this.customers().filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.email.toLowerCase().includes(query)
      )
    );
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  getActiveCustomers(): number {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return this.customers().filter(
      (c) => c.lastOrderAt && new Date(c.lastOrderAt) >= thirtyDaysAgo
    ).length;
  }

  getAverageTicket(): number {
    const customers = this.customers();
    if (customers.length === 0) return 0;
    const totalSpent = customers.reduce((sum, c) => sum + c.totalSpent, 0);
    const totalOrders = customers.reduce((sum, c) => sum + c.ordersCount, 0);
    return totalOrders > 0 ? totalSpent / totalOrders : 0;
  }
}
