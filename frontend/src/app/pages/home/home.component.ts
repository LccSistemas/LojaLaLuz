import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ProductService } from '../../services/product.service';
import { SiteConfigService } from '../../services/site-config.service';
import { CategoryService } from '../../services/category.service';
import { Product, Category } from '../../models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductCardComponent],
  template: `
    <!-- Hero Section - Full Width -->
    @if (siteConfig.hero().active) {
    <section class="relative h-[70vh] lg:h-[85vh] overflow-hidden">
      <img
        [src]="siteConfig.hero().imageUrl"
        [alt]="siteConfig.hero().title"
        class="w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-black/20"></div>
      <div
        class="absolute inset-0 flex items-center justify-center text-center text-white"
      >
        <div>
          <p class="text-sm tracking-widest uppercase mb-4 animate-slide-in-up">
            {{ siteConfig.hero().subtitle }}
          </p>
          <h1
            class="font-serif text-4xl md:text-6xl lg:text-7xl mb-6 animate-slide-in-up"
            style="animation-delay: 0.1s"
          >
            {{ siteConfig.hero().title }}
          </h1>
          <a
            [routerLink]="siteConfig.hero().buttonLink"
            class="inline-block bg-white text-primary-900 px-10 py-4 text-xs tracking-widest uppercase font-medium hover:bg-primary-900 hover:text-white transition-colors animate-slide-in-up"
            style="animation-delay: 0.2s"
          >
            {{ siteConfig.hero().buttonText }}
          </a>
        </div>
      </div>
    </section>
    }

    <!-- Categories Grid -->
    <section class="py-16 lg:py-24">
      <div class="max-w-8xl mx-auto px-4 lg:px-8">
        <h2 class="font-serif text-3xl lg:text-4xl text-center mb-12">
          Compre por Categoria
        </h2>

        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          @for (category of categories(); track category.id) {
          <a
            [routerLink]="['/produtos']"
            [queryParams]="{ category: category.slug }"
            class="group relative aspect-[3/4] overflow-hidden"
          >
            <img
              [src]="
                category.imageUrl || getDefaultCategoryImage(category.slug)
              "
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
    @if (siteConfig.bannerSplit().length > 0) {
    <section class="grid lg:grid-cols-2">
      @for (banner of siteConfig.bannerSplit(); track $index) { @if
      (banner.active) {
      <a
        [routerLink]="getBannerLink(banner.link)"
        [queryParams]="getBannerQueryParams(banner.link)"
        class="relative aspect-[4/5] lg:aspect-auto overflow-hidden group"
      >
        <img
          [src]="banner.imageUrl"
          [alt]="banner.title"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div class="absolute inset-0 bg-black/20"></div>
        <div
          class="absolute inset-0 flex items-center justify-center text-white text-center"
        >
          <div>
            <p class="text-sm tracking-widest uppercase mb-2">
              {{ banner.subtitle }}
            </p>
            <h3 class="font-serif text-4xl lg:text-5xl mb-4">
              {{ banner.title }}
            </h3>
            <span class="text-sm underline underline-offset-4">Comprar</span>
          </div>
        </div>
      </a>
      } }
    </section>
    }

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
    @if (siteConfig.saleBanner().active) {
    <section class="relative h-[50vh] overflow-hidden">
      <img
        [src]="siteConfig.saleBanner().imageUrl"
        [alt]="siteConfig.saleBanner().title"
        class="w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-sale/80"></div>
      <div
        class="absolute inset-0 flex items-center justify-center text-white text-center"
      >
        <div>
          <p class="text-sm tracking-widest uppercase mb-4">
            {{ siteConfig.saleBanner().subtitle }}
          </p>
          <h2 class="font-serif text-5xl lg:text-7xl mb-6">
            {{ siteConfig.saleBanner().title }}
          </h2>
          <a
            [routerLink]="getBannerLink(siteConfig.saleBanner().link)"
            [queryParams]="getBannerQueryParams(siteConfig.saleBanner().link)"
            class="inline-block bg-white text-sale px-10 py-4 text-xs tracking-widest uppercase font-medium hover:bg-primary-900 hover:text-white transition-colors"
          >
            {{ siteConfig.saleBanner().buttonText }}
          </a>
        </div>
      </div>
    </section>
    }

    <!-- Instagram Feed -->
    <section class="py-16 lg:py-24">
      <div class="max-w-8xl mx-auto px-4 lg:px-8 text-center">
        <h2 class="font-serif text-3xl lg:text-4xl mb-2">
          &#64;{{ siteConfig.instagramUsername() }}
        </h2>
        <p class="text-sm text-primary-500 mb-10">Siga-nos no Instagram</p>

        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-1">
          @for (img of siteConfig.instagramImages(); track $index) {
          <a
            [href]="'https://instagram.com/' + siteConfig.instagramUsername()"
            target="_blank"
            class="aspect-square overflow-hidden group"
          >
            <img
              [src]="img"
              alt="Instagram"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </a>
          }
        </div>
      </div>
    </section>

    <!-- Features -->
    @if (siteConfig.features().length > 0) {
    <section class="border-t border-primary-100 py-12">
      <div class="max-w-8xl mx-auto px-4 lg:px-8">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          @for (feature of siteConfig.features(); track $index) {
          <div>
            <span
              [innerHTML]="getFeatureIcon(feature.icon)"
              class="block mb-3"
            ></span>
            <h4 class="text-xs tracking-wider uppercase font-medium mb-1">
              {{ feature.title }}
            </h4>
            <p class="text-xs text-primary-500">{{ feature.description }}</p>
          </div>
          }
        </div>
      </div>
    </section>
    }
  `,
})
export class HomeComponent implements OnInit {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  siteConfig = inject(SiteConfigService);

  loading = signal(true);
  newArrivals = signal<Product[]>([]);
  bestSellers = signal<Product[]>([]);
  categories = signal<Category[]>([]);

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (cats) => {
        this.categories.set(cats.slice(0, 4));
      },
      error: () => {
        this.categories.set([
          {
            id: 1,
            name: 'Vestidos',
            slug: 'vestidos',
            description: '',
            active: true,
            imageUrl: '',
            displayOrder: 0,
            parentId: null,
            parentName: null,
            subcategories: [],
            productCount: 0,
          },
          {
            id: 2,
            name: 'Tops',
            slug: 'tops',
            description: '',
            active: true,
            imageUrl: '',
            displayOrder: 1,
            parentId: null,
            parentName: null,
            subcategories: [],
            productCount: 0,
          },
          {
            id: 3,
            name: 'Calças',
            slug: 'calcas',
            description: '',
            active: true,
            imageUrl: '',
            displayOrder: 2,
            parentId: null,
            parentName: null,
            subcategories: [],
            productCount: 0,
          },
          {
            id: 4,
            name: 'Acessórios',
            slug: 'acessorios',
            description: '',
            active: true,
            imageUrl: '',
            displayOrder: 3,
            parentId: null,
            parentName: null,
            subcategories: [],
            productCount: 0,
          },
        ]);
      },
    });
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
        this.newArrivals.set(this.getMockProducts());
        this.bestSellers.set(this.getMockProducts().reverse());
      },
    });
  }

  getDefaultCategoryImage(slug: string): string {
    const images: Record<string, string> = {
      vestidos:
        'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600',
      tops: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600',
      calcas:
        'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600',
      acessorios:
        'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=600',
      conjuntos:
        'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600',
    };
    return (
      images[slug] ||
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600'
    );
  }

  getBannerLink(link: string): string {
    return link.split('?')[0] || '/produtos';
  }

  getBannerQueryParams(link: string): Record<string, string> {
    const queryString = link.split('?')[1];
    if (!queryString) return {};

    const params: Record<string, string> = {};
    queryString.split('&').forEach((param) => {
      const [key, value] = param.split('=');
      if (key && value) {
        params[key] = value;
      }
    });
    return params;
  }

  getFeatureIcon(icon: string): string {
    const icons: Record<string, string> = {
      shipping:
        '<svg class="w-8 h-8 mx-auto text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/></svg>',
      exchange:
        '<svg class="w-8 h-8 mx-auto text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>',
      secure:
        '<svg class="w-8 h-8 mx-auto text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>',
      installment:
        '<svg class="w-8 h-8 mx-auto text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>',
      support:
        '<svg class="w-8 h-8 mx-auto text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"/></svg>',
      quality:
        '<svg class="w-8 h-8 mx-auto text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg>',
    };
    return icons[icon] || icons['shipping'];
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
        ],
        variants: [],
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
