import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductCardComponent],
  template: `
    <!-- Hero Section - Full Width -->
    <section class="relative h-[70vh] lg:h-[85vh] overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920"
        alt="Nova Coleção"
        class="w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-black/20"></div>
      <div
        class="absolute inset-0 flex items-center justify-center text-center text-white"
      >
        <div>
          <p class="text-sm tracking-widest uppercase mb-4 animate-slide-in-up">
            Nova Coleção
          </p>
          <h1
            class="font-serif text-4xl md:text-6xl lg:text-7xl mb-6 animate-slide-in-up"
            style="animation-delay: 0.1s"
          >
            Summer Essentials
          </h1>
          <a
            routerLink="/produtos"
            class="inline-block bg-white text-primary-900 px-10 py-4 text-xs tracking-widest uppercase font-medium hover:bg-primary-900 hover:text-white transition-colors animate-slide-in-up"
            style="animation-delay: 0.2s"
          >
            Comprar Agora
          </a>
        </div>
      </div>
    </section>

    <!-- Categories Grid -->
    <section class="py-16 lg:py-24">
      <div class="max-w-8xl mx-auto px-4 lg:px-8">
        <h2 class="font-serif text-3xl lg:text-4xl text-center mb-12">
          Compre por Categoria
        </h2>

        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          @for (category of categories; track category.name) {
          <a
            [routerLink]="['/produtos']"
            [queryParams]="{ category: category.slug }"
            class="group relative aspect-[3/4] overflow-hidden"
          >
            <img
              [src]="category.image"
              [alt]="category.name"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div
              class="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"
            ></div>
            <div class="absolute inset-x-0 bottom-0 p-6 text-white">
              <h3 class="text-lg font-medium">{{ category.name }}</h3>
              <span class="text-sm opacity-80">Explorar</span>
            </div>
          </a>
          }
        </div>
      </div>
    </section>

    <!-- New Arrivals -->
    <section class="py-16 lg:py-24 bg-accent-cream/30">
      <div class="max-w-8xl mx-auto px-4 lg:px-8">
        <div class="flex items-center justify-between mb-10">
          <h2 class="font-serif text-3xl lg:text-4xl">Novidades</h2>
          <a
            routerLink="/produtos"
            [queryParams]="{ new: true }"
            class="btn-link"
          >
            Ver Tudo
          </a>
        </div>

        @if (loading()) {
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          @for (i of [1,2,3,4]; track i) {
          <div class="animate-pulse">
            <div class="aspect-[3/4] bg-primary-100"></div>
            <div class="mt-3 h-4 bg-primary-100 w-3/4"></div>
            <div class="mt-2 h-4 bg-primary-100 w-1/4"></div>
          </div>
          }
        </div>
        } @else {
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          @for (product of newArrivals(); track product.id) {
          <app-product-card [product]="product" />
          }
        </div>
        }
      </div>
    </section>

    <!-- Banner Split -->
    <section class="grid lg:grid-cols-2">
      <a
        routerLink="/produtos"
        [queryParams]="{ category: 'vestidos' }"
        class="relative aspect-[4/5] lg:aspect-auto overflow-hidden group"
      >
        <img
          src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800"
          alt="Vestidos"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div class="absolute inset-0 bg-black/20"></div>
        <div
          class="absolute inset-0 flex items-center justify-center text-white text-center"
        >
          <div>
            <p class="text-sm tracking-widest uppercase mb-2">Coleção</p>
            <h3 class="font-serif text-4xl lg:text-5xl mb-4">Vestidos</h3>
            <span class="text-sm underline underline-offset-4">Comprar</span>
          </div>
        </div>
      </a>
      <a
        routerLink="/produtos"
        [queryParams]="{ category: 'conjuntos' }"
        class="relative aspect-[4/5] lg:aspect-auto overflow-hidden group"
      >
        <img
          src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800"
          alt="Conjuntos"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div class="absolute inset-0 bg-black/20"></div>
        <div
          class="absolute inset-0 flex items-center justify-center text-white text-center"
        >
          <div>
            <p class="text-sm tracking-widest uppercase mb-2">Coleção</p>
            <h3 class="font-serif text-4xl lg:text-5xl mb-4">Conjuntos</h3>
            <span class="text-sm underline underline-offset-4">Comprar</span>
          </div>
        </div>
      </a>
    </section>

    <!-- Best Sellers -->
    <section class="py-16 lg:py-24">
      <div class="max-w-8xl mx-auto px-4 lg:px-8">
        <div class="flex items-center justify-between mb-10">
          <h2 class="font-serif text-3xl lg:text-4xl">Mais Vendidos</h2>
          <a routerLink="/produtos" class="btn-link"> Ver Tudo </a>
        </div>

        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          @for (product of bestSellers(); track product.id) {
          <app-product-card [product]="product" />
          }
        </div>
      </div>
    </section>

    <!-- Sale Banner -->
    <section class="relative h-[50vh] overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920"
        alt="Sale"
        class="w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-sale/80"></div>
      <div
        class="absolute inset-0 flex items-center justify-center text-white text-center"
      >
        <div>
          <p class="text-sm tracking-widest uppercase mb-4">Aproveite</p>
          <h2 class="font-serif text-5xl lg:text-7xl mb-6">Até 50% OFF</h2>
          <a
            routerLink="/produtos"
            [queryParams]="{ sale: true }"
            class="inline-block bg-white text-sale px-10 py-4 text-xs tracking-widest uppercase font-medium hover:bg-primary-900 hover:text-white transition-colors"
          >
            Ver Sale
          </a>
        </div>
      </div>
    </section>

    <!-- Instagram Feed -->
    <section class="py-16 lg:py-24">
      <div class="max-w-8xl mx-auto px-4 lg:px-8 text-center">
        <h2 class="font-serif text-3xl lg:text-4xl mb-2">&#64;lojalaluz</h2>
        <p class="text-sm text-primary-500 mb-10">Siga-nos no Instagram</p>

        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-1">
          @for (i of [1,2,3,4,5,6]; track i) {
          <a href="#" class="aspect-square overflow-hidden group">
            <img
              [src]="'https://picsum.photos/400/400?random=' + i"
              alt="Instagram"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </a>
          }
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="border-t border-primary-100 py-12">
      <div class="max-w-8xl mx-auto px-4 lg:px-8">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <div>
            <svg
              class="w-8 h-8 mx-auto mb-3 text-primary-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1"
                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
              />
            </svg>
            <h4 class="text-xs tracking-wider uppercase font-medium mb-1">
              Frete Grátis
            </h4>
            <p class="text-xs text-primary-500">Em compras acima de R$299</p>
          </div>
          <div>
            <svg
              class="w-8 h-8 mx-auto mb-3 text-primary-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <h4 class="text-xs tracking-wider uppercase font-medium mb-1">
              Troca Grátis
            </h4>
            <p class="text-xs text-primary-500">
              Primeira troca por nossa conta
            </p>
          </div>
          <div>
            <svg
              class="w-8 h-8 mx-auto mb-3 text-primary-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <h4 class="text-xs tracking-wider uppercase font-medium mb-1">
              Compra Segura
            </h4>
            <p class="text-xs text-primary-500">Ambiente 100% protegido</p>
          </div>
          <div>
            <svg
              class="w-8 h-8 mx-auto mb-3 text-primary-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1"
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
            <h4 class="text-xs tracking-wider uppercase font-medium mb-1">
              6x Sem Juros
            </h4>
            <p class="text-xs text-primary-500">Em todas as compras</p>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class HomeComponent implements OnInit {
  private productService = inject(ProductService);

  loading = signal(true);
  newArrivals = signal<Product[]>([]);
  bestSellers = signal<Product[]>([]);

  categories = [
    {
      name: 'Vestidos',
      slug: 'vestidos',
      image:
        'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600',
    },
    {
      name: 'Tops',
      slug: 'tops',
      image: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600',
    },
    {
      name: 'Calças',
      slug: 'calcas',
      image:
        'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600',
    },
    {
      name: 'Acessórios',
      slug: 'acessorios',
      image:
        'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=600',
    },
  ];

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts(0, 4).subscribe({
      next: (response) => {
        this.newArrivals.set(response.content);
        this.bestSellers.set(response.content.slice().reverse());
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        // Mock data for demo
        this.newArrivals.set(this.getMockProducts());
        this.bestSellers.set(this.getMockProducts().reverse());
      },
    });
  }

  private getMockProducts(): Product[] {
    return [
      {
        id: 1,
        name: 'Vestido Midi Floral',
        slug: 'vestido-midi-floral',
        description: 'Vestido midi com estampa floral',
        price: 299.9,
        salePrice: null,
        currentPrice: 299.9,
        onSale: false,
        sku: 'VES-001',
        stockQuantity: 10,
        active: true,
        featured: true,
        brand: 'La Luz',
        material: 'Viscose',
        categoryId: 1,
        categoryName: 'Vestidos',
        images: [
          {
            id: 1,
            url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400',
            altText: '',
            displayOrder: 0,
            isPrimary: true,
          },
          {
            id: 2,
            url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400',
            altText: '',
            displayOrder: 1,
            isPrimary: false,
          },
        ],
        variants: [
          {
            id: 1,
            size: 'M',
            color: 'Floral',
            colorCode: '#E8B4B8',
            sku: 'VES-001-M',
            stockQuantity: 5,
            additionalPrice: null,
            active: true,
            available: true,
          },
        ],
      },
      {
        id: 2,
        name: 'Blusa Cropped Off-White',
        slug: 'blusa-cropped-off-white',
        description: 'Blusa cropped elegante',
        price: 159.9,
        salePrice: 119.9,
        currentPrice: 119.9,
        onSale: true,
        sku: 'TOP-001',
        stockQuantity: 15,
        active: true,
        featured: true,
        brand: 'La Luz',
        material: 'Algodão',
        categoryId: 2,
        categoryName: 'Tops',
        images: [
          {
            id: 3,
            url: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400',
            altText: '',
            displayOrder: 0,
            isPrimary: true,
          },
        ],
        variants: [],
      },
      {
        id: 3,
        name: 'Calça Wide Leg Preta',
        slug: 'calca-wide-leg-preta',
        description: 'Calça wide leg de alfaiataria',
        price: 249.9,
        salePrice: null,
        currentPrice: 249.9,
        onSale: false,
        sku: 'CAL-001',
        stockQuantity: 8,
        active: true,
        featured: true,
        brand: 'La Luz',
        material: 'Poliéster',
        categoryId: 3,
        categoryName: 'Calças',
        images: [
          {
            id: 4,
            url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400',
            altText: '',
            displayOrder: 0,
            isPrimary: true,
          },
        ],
        variants: [],
      },
      {
        id: 4,
        name: 'Conjunto Linho Natural',
        slug: 'conjunto-linho-natural',
        description: 'Conjunto de linho',
        price: 399.9,
        salePrice: 299.9,
        currentPrice: 299.9,
        onSale: true,
        sku: 'CON-001',
        stockQuantity: 5,
        active: true,
        featured: true,
        brand: 'La Luz',
        material: 'Linho',
        categoryId: 4,
        categoryName: 'Conjuntos',
        images: [
          {
            id: 5,
            url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400',
            altText: '',
            displayOrder: 0,
            isPrimary: true,
          },
        ],
        variants: [],
      },
    ];
  }
}
