import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  salePrice?: number;
  active: boolean;
  featured: boolean;
  categoryName?: string;
  images: { url: string }[];
  variants: { stockQuantity: number }[];
}

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, CurrencyPipe],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div
        class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Produtos</h1>
          <p class="text-gray-500">Gerencie os produtos da sua loja</p>
        </div>
        <a
          routerLink="/admin/products/new"
          class="inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <svg
            class="w-5 h-5 mr-2"
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
          Novo Produto
        </a>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-xl shadow-sm p-4">
        <div class="flex flex-col md:flex-row gap-4">
          <!-- Search -->
          <div class="flex-1">
            <div class="relative">
              <input
                type="text"
                [(ngModel)]="searchQuery"
                (ngModelChange)="onSearch()"
                placeholder="Buscar produtos..."
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <svg
                class="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          <!-- Category Filter -->
          <select
            [(ngModel)]="selectedCategory"
            (ngModelChange)="loadProducts()"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Todas as categorias</option>
            @for (cat of categories(); track cat.id) {
            <option [value]="cat.id">{{ cat.name }}</option>
            }
          </select>

          <!-- Status Filter -->
          <select
            [(ngModel)]="selectedStatus"
            (ngModelChange)="loadProducts()"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Todos os status</option>
            <option value="active">Ativos</option>
            <option value="inactive">Inativos</option>
            <option value="featured">Destaques</option>
          </select>
        </div>
      </div>

      <!-- Products Table -->
      <div class="bg-white rounded-xl shadow-sm overflow-hidden">
        @if (loading()) {
        <div class="p-8 text-center">
          <div
            class="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"
          ></div>
          <p class="mt-2 text-gray-500">Carregando...</p>
        </div>
        } @else {
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  Produto
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  Categoria
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  Preço
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  Estoque
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  Status
                </th>
                <th
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase"
                >
                  Ações
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              @for (product of products(); track product.id) {
              <tr class="hover:bg-gray-50">
                <td class="px-6 py-4">
                  <div class="flex items-center space-x-4">
                    <img
                      [src]="
                        product.images[0]?.url ||
                        'https://placehold.co/60x60?text=Produto'
                      "
                      [alt]="product.name"
                      class="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <p class="text-sm font-medium text-gray-900">
                        {{ product.name }}
                      </p>
                      <p class="text-sm text-gray-500">{{ product.slug }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm text-gray-600">{{
                    product.categoryName || '-'
                  }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div>
                    @if (product.salePrice) {
                    <span class="text-sm text-gray-400 line-through">{{
                      product.price | currency : 'BRL'
                    }}</span>
                    <span class="text-sm font-medium text-red-600 ml-1">{{
                      product.salePrice | currency : 'BRL'
                    }}</span>
                    } @else {
                    <span class="text-sm font-medium text-gray-900">{{
                      product.price | currency : 'BRL'
                    }}</span>
                    }
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="text-sm"
                    [class.text-red-600]="getTotalStock(product) === 0"
                    [class.text-yellow-600]="
                      getTotalStock(product) > 0 && getTotalStock(product) < 5
                    "
                    [class.text-green-600]="getTotalStock(product) >= 5"
                  >
                    {{ getTotalStock(product) }} un
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center space-x-2">
                    <span
                      class="px-2 py-1 text-xs font-medium rounded-full"
                      [class.bg-green-100]="product.active"
                      [class.text-green-800]="product.active"
                      [class.bg-gray-100]="!product.active"
                      [class.text-gray-800]="!product.active"
                    >
                      {{ product.active ? 'Ativo' : 'Inativo' }}
                    </span>
                    @if (product.featured) {
                    <span
                      class="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800"
                    >
                      Destaque
                    </span>
                    }
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right">
                  <div class="flex items-center justify-end space-x-2">
                    <a
                      [routerLink]="['/admin/products', product.id]"
                      class="p-2 text-gray-400 hover:text-primary transition-colors"
                      title="Editar"
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
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </a>
                    <button
                      (click)="toggleActive(product)"
                      class="p-2 text-gray-400 hover:text-yellow-600 transition-colors"
                      [title]="product.active ? 'Desativar' : 'Ativar'"
                    >
                      <svg
                        class="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        @if (product.active) {
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                        } @else {
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                        }
                      </svg>
                    </button>
                    <button
                      (click)="deleteProduct(product)"
                      class="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Excluir"
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
                </td>
              </tr>
              } @empty {
              <tr>
                <td colspan="6" class="px-6 py-12 text-center">
                  <svg
                    class="w-12 h-12 text-gray-300 mx-auto mb-4"
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
                  <p class="text-gray-500">Nenhum produto encontrado</p>
                  <a
                    routerLink="/admin/products/new"
                    class="text-primary hover:underline mt-2 inline-block"
                  >
                    Criar primeiro produto
                  </a>
                </td>
              </tr>
              }
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        @if (totalPages() > 1) {
        <div
          class="px-6 py-4 border-t border-gray-100 flex items-center justify-between"
        >
          <p class="text-sm text-gray-500">
            Mostrando {{ (currentPage() - 1) * pageSize + 1 }} -
            {{ Math.min(currentPage() * pageSize, totalElements()) }} de
            {{ totalElements() }} produtos
          </p>
          <div class="flex items-center space-x-2">
            <button
              (click)="goToPage(currentPage() - 1)"
              [disabled]="currentPage() === 1"
              class="px-3 py-1 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Anterior
            </button>
            <button
              (click)="goToPage(currentPage() + 1)"
              [disabled]="currentPage() === totalPages()"
              class="px-3 py-1 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Próxima
            </button>
          </div>
        </div>
        } }
      </div>
    </div>
  `,
})
export class ProductsListComponent implements OnInit {
  products = signal<Product[]>([]);
  categories = signal<{ id: number; name: string }[]>([]);
  loading = signal(true);

  searchQuery = '';
  selectedCategory = '';
  selectedStatus = '';

  currentPage = signal(1);
  totalPages = signal(1);
  totalElements = signal(0);
  pageSize = 10;

  Math = Math;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories() {
    this.http.get<any[]>(`${environment.apiUrl}/categories`).subscribe({
      next: (cats) => this.categories.set(cats),
      error: () => this.categories.set([]),
    });
  }

  loadProducts() {
    this.loading.set(true);

    let url = `${environment.apiUrl}/products?page=${
      this.currentPage() - 1
    }&size=${this.pageSize}`;

    if (this.selectedCategory) {
      url += `&categoryId=${this.selectedCategory}`;
    }

    this.http.get<any>(url).subscribe({
      next: (res) => {
        let productList = res.content || [];

        // Apply client-side filters
        if (this.selectedStatus === 'active') {
          productList = productList.filter((p: Product) => p.active);
        } else if (this.selectedStatus === 'inactive') {
          productList = productList.filter((p: Product) => !p.active);
        } else if (this.selectedStatus === 'featured') {
          productList = productList.filter((p: Product) => p.featured);
        }

        if (this.searchQuery) {
          const query = this.searchQuery.toLowerCase();
          productList = productList.filter(
            (p: Product) =>
              p.name.toLowerCase().includes(query) ||
              p.slug.toLowerCase().includes(query)
          );
        }

        this.products.set(productList);
        this.totalPages.set(res.totalPages || 1);
        this.totalElements.set(res.totalElements || productList.length);
        this.loading.set(false);
      },
      error: () => {
        this.products.set([]);
        this.loading.set(false);
      },
    });
  }

  onSearch() {
    // Debounce search
    this.loadProducts();
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.loadProducts();
    }
  }

  getTotalStock(product: Product): number {
    return (
      product.variants?.reduce((sum, v) => sum + (v.stockQuantity || 0), 0) || 0
    );
  }

  toggleActive(product: Product) {
    // TODO: Implement API call
    product.active = !product.active;
  }

  deleteProduct(product: Product) {
    if (confirm(`Tem certeza que deseja excluir "${product.name}"?`)) {
      this.http
        .delete(`${environment.apiUrl}/products/${product.id}`)
        .subscribe({
          next: () => {
            this.products.update((products) =>
              products.filter((p) => p.id !== product.id)
            );
          },
          error: (err) => {
            alert('Erro ao excluir produto');
            console.error(err);
          },
        });
    }
  }
}
