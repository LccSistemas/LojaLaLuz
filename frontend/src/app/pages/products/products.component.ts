import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { CartService } from '../../services/cart.service';
import { Product, Category, Page } from '../../models';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ProductCardComponent],
  template: `
    <div class="min-h-screen bg-white">
      <!-- Breadcrumb -->
      <div class="border-b border-gray-100">
        <div class="container mx-auto px-4 py-4">
          <nav
            class="flex items-center text-xs uppercase tracking-wider text-gray-500"
          >
            <a routerLink="/" class="hover:text-black transition-colors"
              >Início</a
            >
            <span class="mx-3">/</span>
            <span class="text-black">{{ pageTitle }}</span>
          </nav>
        </div>
      </div>

      <!-- Category Hero (if category page) -->
      @if (selectedCategoryId) {
      <div class="bg-cream-50 py-16">
        <div class="container mx-auto px-4 text-center">
          <h1
            class="font-cormorant text-4xl md:text-5xl font-light text-black mb-4"
          >
            {{ pageTitle }}
          </h1>
          <p class="text-gray-600 max-w-2xl mx-auto">
            Explore nossa coleção cuidadosamente selecionada
          </p>
        </div>
      </div>
      }

      <div class="container mx-auto px-4 py-8 lg:py-12">
        <div class="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <!-- Mobile Filter Toggle -->
          <button
            (click)="mobileFiltersOpen.set(!mobileFiltersOpen())"
            class="lg:hidden flex items-center justify-center gap-2 py-3 border border-black text-sm uppercase tracking-wider"
          >
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
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            Filtros
          </button>

          <!-- Sidebar Filters -->
          <aside
            class="lg:w-56 flex-shrink-0"
            [class.hidden]="!mobileFiltersOpen()"
            [class.block]="mobileFiltersOpen()"
            [class.lg:block]="true"
          >
            <div class="sticky top-24">
              <div class="flex items-center justify-between mb-6 lg:mb-8">
                <h3 class="text-xs uppercase tracking-wider font-medium">
                  Filtrar Por
                </h3>
                <button
                  (click)="clearFilters()"
                  class="text-xs text-gray-500 hover:text-black underline"
                >
                  Limpar
                </button>
              </div>

              <!-- Categories -->
              <div class="mb-8">
                <h4 class="text-xs uppercase tracking-wider mb-4">
                  Categorias
                </h4>
                <ul class="space-y-3">
                  <li>
                    <button
                      (click)="goToAllProducts()"
                      class="text-sm transition-colors"
                      [class.text-black]="!selectedCategoryId"
                      [class.font-medium]="!selectedCategoryId"
                      [class.text-gray-500]="selectedCategoryId"
                      [class.hover:text-black]="selectedCategoryId"
                    >
                      Todos os Produtos
                    </button>
                  </li>
                  @for (cat of categories; track cat.id) {
                  <li>
                    <button
                      (click)="filterByCategory(cat.id)"
                      class="text-sm transition-colors"
                      [class.text-black]="selectedCategoryId === cat.id"
                      [class.font-medium]="selectedCategoryId === cat.id"
                      [class.text-gray-500]="selectedCategoryId !== cat.id"
                      [class.hover:text-black]="selectedCategoryId !== cat.id"
                    >
                      {{ cat.name }}
                    </button>
                  </li>
                  }
                </ul>
              </div>

              <!-- Price Range -->
              <div class="mb-8">
                <h4 class="text-xs uppercase tracking-wider mb-4">Preço</h4>
                <div class="space-y-3">
                  @for (range of priceRanges; track range.label) {
                  <label class="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      [(ngModel)]="range.selected"
                      class="w-4 h-4 border-gray-300 text-black focus:ring-black rounded-none"
                    />
                    <span
                      class="text-sm text-gray-600 group-hover:text-black transition-colors"
                    >
                      {{ range.label }}
                    </span>
                  </label>
                  }
                </div>
              </div>

              <!-- Sizes -->
              <div class="mb-8">
                <h4 class="text-xs uppercase tracking-wider mb-4">Tamanhos</h4>
                <div class="flex flex-wrap gap-2">
                  @for (size of sizes; track size.value) {
                  <button
                    (click)="size.selected = !size.selected"
                    class="w-10 h-10 text-xs border transition-all"
                    [class.border-black]="size.selected"
                    [class.bg-black]="size.selected"
                    [class.text-white]="size.selected"
                    [class.border-gray-200]="!size.selected"
                    [class.hover:border-gray-400]="!size.selected"
                  >
                    {{ size.value }}
                  </button>
                  }
                </div>
              </div>

              <!-- Colors -->
              <div class="mb-8">
                <h4 class="text-xs uppercase tracking-wider mb-4">Cores</h4>
                <div class="flex flex-wrap gap-2">
                  @for (color of colors; track color.value) {
                  <button
                    (click)="color.selected = !color.selected"
                    class="w-7 h-7 rounded-full border-2 transition-all"
                    [style.background-color]="color.hex"
                    [class.border-black]="color.selected"
                    [class.ring-2]="color.selected"
                    [class.ring-offset-2]="color.selected"
                    [class.ring-black]="color.selected"
                    [class.border-gray-200]="!color.selected"
                    [title]="color.label"
                  ></button>
                  }
                </div>
              </div>
            </div>
          </aside>

          <!-- Products Grid -->
          <main class="flex-1">
            <!-- Header Row -->
            <div
              class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
            >
              @if (!selectedCategoryId) {
              <h1 class="font-cormorant text-3xl md:text-4xl font-light">
                {{ pageTitle }}
              </h1>
              }

              <div class="flex items-center gap-4 sm:ml-auto">
                <span class="text-sm text-gray-500">
                  {{ totalProducts }}
                  {{ totalProducts === 1 ? 'produto' : 'produtos' }}
                </span>
                <select
                  [(ngModel)]="sortBy"
                  (change)="sortProducts()"
                  class="text-sm border-0 border-b border-gray-200 py-2 pr-8 focus:ring-0 focus:border-black bg-transparent cursor-pointer"
                >
                  <option value="newest">Mais Recentes</option>
                  <option value="price-asc">Menor Preço</option>
                  <option value="price-desc">Maior Preço</option>
                  <option value="name">Nome A-Z</option>
                  <option value="bestselling">Mais Vendidos</option>
                </select>
              </div>
            </div>

            <!-- Loading State -->
            @if (loading) {
            <div
              class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6"
            >
              @for (i of [1,2,3,4,5,6,7,8]; track i) {
              <div class="animate-pulse">
                <div class="aspect-[3/4] bg-gray-100 mb-4"></div>
                <div class="h-4 bg-gray-100 w-3/4 mb-2"></div>
                <div class="h-4 bg-gray-100 w-1/2"></div>
              </div>
              }
            </div>
            } @else if (products.length === 0) {
            <!-- Empty State -->
            <div class="text-center py-20">
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
              <h3 class="font-cormorant text-2xl mb-2">
                Nenhum produto encontrado
              </h3>
              <p class="text-gray-500 mb-6">
                Tente ajustar os filtros ou explorar outras categorias
              </p>
              <button (click)="clearFilters()" class="btn-primary">
                Ver Todos os Produtos
              </button>
            </div>
            } @else {
            <!-- Products Grid -->
            <div
              class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6"
            >
              @for (product of products; track product.id) {
              <app-product-card
                [product]="product"
                (addedToCart)="onAddToCart($event)"
              />
              }
            </div>

            <!-- Pagination -->
            @if (totalPages > 1) {
            <div class="flex items-center justify-center mt-16 gap-2">
              <!-- Previous -->
              <button
                (click)="goToPage(currentPage - 1)"
                [disabled]="currentPage === 0"
                class="p-3 border border-gray-200 hover:border-black disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <!-- Page Numbers -->
              @for (page of getPageNumbers(); track page) { @if (page === -1) {
              <span class="px-2 text-gray-400">...</span>
              } @else {
              <button
                (click)="goToPage(page)"
                class="w-10 h-10 text-sm transition-colors"
                [class.bg-black]="page === currentPage"
                [class.text-white]="page === currentPage"
                [class.hover:bg-gray-100]="page !== currentPage"
              >
                {{ page + 1 }}
              </button>
              } }

              <!-- Next -->
              <button
                (click)="goToPage(currentPage + 1)"
                [disabled]="currentPage >= totalPages - 1"
                class="p-3 border border-gray-200 hover:border-black disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
            } }
          </main>
        </div>
      </div>
    </div>
  `,
})
export class ProductsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private cartService = inject(CartService);

  products: Product[] = [];
  categories: Category[] = [];

  loading = true;
  pageTitle = 'Todos os Produtos';
  selectedCategoryId: number | null = null;
  searchQuery = '';

  currentPage = 0;
  totalPages = 0;
  totalProducts = 0;
  pageSize = 12;

  sortBy = 'newest';
  mobileFiltersOpen = signal(false);

  priceRanges = [
    { label: 'Até R$ 100', min: 0, max: 100, selected: false },
    { label: 'R$ 100 - R$ 200', min: 100, max: 200, selected: false },
    { label: 'R$ 200 - R$ 300', min: 200, max: 300, selected: false },
    { label: 'Acima de R$ 300', min: 300, max: null, selected: false },
  ];

  sizes = [
    { value: 'PP', selected: false },
    { value: 'P', selected: false },
    { value: 'M', selected: false },
    { value: 'G', selected: false },
    { value: 'GG', selected: false },
  ];

  colors = [
    { value: 'preto', label: 'Preto', hex: '#000000', selected: false },
    { value: 'branco', label: 'Branco', hex: '#FFFFFF', selected: false },
    { value: 'nude', label: 'Nude', hex: '#D4A574', selected: false },
    { value: 'rosa', label: 'Rosa', hex: '#F8B4C4', selected: false },
    { value: 'azul', label: 'Azul', hex: '#4A90A4', selected: false },
    { value: 'verde', label: 'Verde', hex: '#7CB342', selected: false },
  ];

  ngOnInit(): void {
    this.loadCategories();

    this.route.params.subscribe((params) => {
      if (params['slug']) {
        this.loadByCategory(params['slug']);
      } else {
        this.route.queryParams.subscribe((query) => {
          if (query['q']) {
            this.searchQuery = query['q'];
            this.pageTitle = `Resultados para "${query['q']}"`;
            this.searchProducts();
          } else {
            this.loadProducts();
          }
        });
      }
    });
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (cats) => (this.categories = cats),
      error: () => (this.categories = []),
    });
  }

  loadProducts(): void {
    this.loading = true;
    this.pageTitle = 'Todos os Produtos';
    this.selectedCategoryId = null;
    this.productService.getProducts(this.currentPage, this.pageSize).subscribe({
      next: (page) => this.handleResponse(page),
      error: () => this.handleError(),
    });
  }

  loadByCategory(slug: string): void {
    this.loading = true;
    this.categoryService.getCategoryBySlug(slug).subscribe({
      next: (category) => {
        this.pageTitle = category.name;
        this.selectedCategoryId = category.id;
        this.productService
          .getProductsByCategory(category.id, this.currentPage, this.pageSize)
          .subscribe({
            next: (page) => this.handleResponse(page),
            error: () => this.handleError(),
          });
      },
      error: () => {
        this.pageTitle = 'Categoria não encontrada';
        this.handleError();
      },
    });
  }

  searchProducts(): void {
    this.loading = true;
    this.productService
      .searchProducts(this.searchQuery, this.currentPage, this.pageSize)
      .subscribe({
        next: (page) => this.handleResponse(page),
        error: () => this.handleError(),
      });
  }

  handleResponse(page: Page<Product>): void {
    this.products = page.content;
    this.totalPages = page.totalPages;
    this.totalProducts = page.totalElements;
    this.currentPage = page.number;
    this.loading = false;
  }

  handleError(): void {
    this.products = [];
    this.loading = false;
  }

  filterByCategory(categoryId: number): void {
    const category = this.categories.find((c) => c.id === categoryId);
    if (category) {
      this.router.navigate(['/categoria', category.slug]);
    }
  }

  goToAllProducts(): void {
    this.router.navigate(['/produtos']);
  }

  clearFilters(): void {
    this.selectedCategoryId = null;
    this.priceRanges.forEach((r) => (r.selected = false));
    this.sizes.forEach((s) => (s.selected = false));
    this.colors.forEach((c) => (c.selected = false));
    this.router.navigate(['/produtos']);
  }

  sortProducts(): void {
    // TODO: Implement sorting with backend or local sorting
    console.log('Sort by:', this.sortBy);
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      if (this.selectedCategoryId) {
        this.productService
          .getProductsByCategory(this.selectedCategoryId, page, this.pageSize)
          .subscribe({
            next: (p) => this.handleResponse(p),
          });
      } else if (this.searchQuery) {
        this.searchProducts();
      } else {
        this.loadProducts();
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];

    if (this.totalPages <= 7) {
      for (let i = 0; i < this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(0);

      if (this.currentPage > 3) {
        pages.push(-1); // Ellipsis
      }

      // Pages around current
      for (
        let i = Math.max(1, this.currentPage - 1);
        i <= Math.min(this.totalPages - 2, this.currentPage + 1);
        i++
      ) {
        pages.push(i);
      }

      if (this.currentPage < this.totalPages - 4) {
        pages.push(-1); // Ellipsis
      }

      // Always show last page
      pages.push(this.totalPages - 1);
    }

    return pages;
  }

  onAddToCart(product: Product): void {
    this.cartService.addItem(product.id, 1).subscribe({
      next: () => {
        // Cart drawer will open automatically via CartService
      },
      error: (err) => console.error('Error adding to cart:', err),
    });
  }
}
