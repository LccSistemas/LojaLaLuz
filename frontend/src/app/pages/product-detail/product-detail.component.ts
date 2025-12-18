import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product, ProductVariant } from '../../models';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe],
  template: `
    <div class="min-h-screen bg-white">
      @if (loading()) {
        <!-- Loading Skeleton -->
        <div class="container mx-auto px-4 py-8">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            <div class="animate-pulse">
              <div class="aspect-[3/4] bg-gray-100"></div>
              <div class="flex gap-3 mt-4">
                <div class="w-20 h-20 bg-gray-100"></div>
                <div class="w-20 h-20 bg-gray-100"></div>
                <div class="w-20 h-20 bg-gray-100"></div>
              </div>
            </div>
            <div class="animate-pulse space-y-4">
              <div class="h-8 bg-gray-100 w-3/4"></div>
              <div class="h-6 bg-gray-100 w-1/4"></div>
              <div class="h-4 bg-gray-100 w-full"></div>
              <div class="h-4 bg-gray-100 w-2/3"></div>
            </div>
          </div>
        </div>
      } @else if (product()) {
        <!-- Breadcrumb -->
        <div class="border-b border-gray-100">
          <div class="container mx-auto px-4 py-4">
            <nav class="flex items-center text-xs uppercase tracking-wider text-gray-500">
              <a routerLink="/" class="hover:text-black transition-colors">Início</a>
              <span class="mx-3">/</span>
              @if (product()!.categoryName) {
                <a 
                  [routerLink]="['/categoria', product()!.categoryId]"
                  class="hover:text-black transition-colors"
                >{{ product()!.categoryName }}</a>
                <span class="mx-3">/</span>
              }
              <span class="text-black truncate max-w-[200px]">{{ product()!.name }}</span>
            </nav>
          </div>
        </div>

        <div class="container mx-auto px-4 py-8 lg:py-12">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            
            <!-- Image Gallery -->
            <div class="space-y-4">
              <!-- Main Image -->
              <div class="aspect-[3/4] bg-cream-50 overflow-hidden relative group">
                @if (product()!.onSale) {
                  <div class="absolute top-4 left-4 z-10 bg-black text-white text-xs px-3 py-1.5 tracking-wider">
                    -{{ calculateDiscount() }}%
                  </div>
                }
                <img
                  [src]="selectedImage() || product()!.images?.[0]?.url || 'https://placehold.co/600x800/f5f5f5/999?text=Sem+Imagem'"
                  [alt]="product()!.name"
                  class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                <!-- Image Navigation Arrows -->
                @if (product()!.images && product()!.images.length > 1) {
                  <button 
                    (click)="prevImage()"
                    class="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button 
                    (click)="nextImage()"
                    class="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                }
              </div>

              <!-- Thumbnails -->
              @if (product()!.images && product()!.images.length > 1) {
                <div class="flex gap-3 overflow-x-auto pb-2">
                  @for (image of product()!.images; track image.id; let i = $index) {
                    <button
                      (click)="selectImageByIndex(i)"
                      class="flex-shrink-0 w-20 h-24 overflow-hidden border transition-all"
                      [class.border-black]="selectedImageIndex() === i"
                      [class.border-gray-200]="selectedImageIndex() !== i"
                      [class.opacity-100]="selectedImageIndex() === i"
                      [class.opacity-60]="selectedImageIndex() !== i"
                      [class.hover:opacity-100]="selectedImageIndex() !== i"
                    >
                      <img
                        [src]="image.url"
                        [alt]="image.altText || product()!.name"
                        class="w-full h-full object-cover"
                      />
                    </button>
                  }
                </div>
              }
            </div>

            <!-- Product Info -->
            <div class="lg:sticky lg:top-24 lg:self-start">
              <!-- Brand -->
              @if (product()!.brand) {
                <p class="text-xs uppercase tracking-wider text-gray-500 mb-2">
                  {{ product()!.brand }}
                </p>
              }

              <!-- Name -->
              <h1 class="font-cormorant text-3xl md:text-4xl font-light text-black mb-4">
                {{ product()!.name }}
              </h1>

              <!-- Price -->
              <div class="flex items-baseline gap-3 mb-2">
                @if (product()!.onSale) {
                  <span class="text-xl font-medium text-black">
                    {{ product()!.salePrice | currency : 'BRL' : 'symbol' : '1.2-2' }}
                  </span>
                  <span class="text-lg text-gray-400 line-through">
                    {{ product()!.price | currency : 'BRL' : 'symbol' : '1.2-2' }}
                  </span>
                } @else {
                  <span class="text-xl font-medium text-black">
                    {{ product()!.price | currency : 'BRL' : 'symbol' : '1.2-2' }}
                  </span>
                }
              </div>

              <!-- Installments -->
              <p class="text-sm text-gray-500 mb-8">
                ou 6x de {{ product()!.currentPrice / 6 | currency : 'BRL' : 'symbol' : '1.2-2' }} sem juros
              </p>

              <!-- Color Selection -->
              @if (uniqueColors().length > 0) {
                <div class="mb-6">
                  <h3 class="text-xs uppercase tracking-wider mb-4">
                    Cor: <span class="font-medium">{{ selectedColor()?.color }}</span>
                  </h3>
                  <div class="flex gap-2">
                    @for (color of uniqueColors(); track color.colorCode) {
                      <button
                        (click)="selectColor(color)"
                        class="w-8 h-8 rounded-full border-2 transition-all"
                        [style.backgroundColor]="color.colorCode"
                        [class.ring-2]="selectedColor()?.colorCode === color.colorCode"
                        [class.ring-offset-2]="selectedColor()?.colorCode === color.colorCode"
                        [class.ring-black]="selectedColor()?.colorCode === color.colorCode"
                        [class.border-gray-300]="selectedColor()?.colorCode !== color.colorCode"
                        [class.border-black]="selectedColor()?.colorCode === color.colorCode"
                        [title]="color.color"
                      ></button>
                    }
                  </div>
                </div>
              }

              <!-- Size Selection -->
              @if (availableSizes().length > 0) {
                <div class="mb-8">
                  <div class="flex items-center justify-between mb-4">
                    <h3 class="text-xs uppercase tracking-wider">
                      Tamanho: <span class="font-medium">{{ selectedSize() }}</span>
                    </h3>
                    <button class="text-xs underline text-gray-500 hover:text-black transition-colors">
                      Guia de Tamanhos
                    </button>
                  </div>
                  <div class="flex flex-wrap gap-2">
                    @for (size of availableSizes(); track size) {
                      <button
                        (click)="selectSize(size)"
                        class="min-w-[48px] h-12 px-4 border text-sm transition-all"
                        [class.border-black]="selectedSize() === size"
                        [class.bg-black]="selectedSize() === size"
                        [class.text-white]="selectedSize() === size"
                        [class.border-gray-200]="selectedSize() !== size"
                        [class.hover:border-gray-400]="selectedSize() !== size"
                      >
                        {{ size }}
                      </button>
                    }
                  </div>
                </div>
              }

              <!-- Quantity -->
              <div class="mb-8">
                <h3 class="text-xs uppercase tracking-wider mb-4">Quantidade</h3>
                <div class="flex items-center border border-gray-200 w-fit">
                  <button
                    (click)="decreaseQuantity()"
                    class="w-12 h-12 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
                    [disabled]="quantity() <= 1"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                    </svg>
                  </button>
                  <span class="w-12 h-12 flex items-center justify-center text-sm font-medium">
                    {{ quantity() }}
                  </span>
                  <button
                    (click)="increaseQuantity()"
                    class="w-12 h-12 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Add to Cart Button -->
              <div class="flex gap-3 mb-6">
                <button
                  (click)="addToCart()"
                  class="flex-1 btn-primary h-14 flex items-center justify-center gap-2"
                  [disabled]="!canAddToCart()"
                  [class.opacity-50]="!canAddToCart()"
                  [class.cursor-not-allowed]="!canAddToCart()"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  ADICIONAR AO CARRINHO
                </button>
                <button
                  (click)="toggleWishlist()"
                  class="w-14 h-14 border border-gray-200 flex items-center justify-center hover:border-black transition-colors"
                  [class.bg-black]="isInWishlist()"
                  [class.border-black]="isInWishlist()"
                >
                  <svg 
                    class="w-5 h-5" 
                    [class.text-white]="isInWishlist()"
                    [class.fill-white]="isInWishlist()"
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>

              <!-- Stock Status -->
              @if (selectedVariant()) {
                <div class="mb-8">
                  @if (selectedVariant()!.stockQuantity > 10) {
                    <p class="text-sm text-green-600 flex items-center gap-2">
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" 
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                          clip-rule="evenodd" />
                      </svg>
                      Em estoque
                    </p>
                  } @else if (selectedVariant()!.stockQuantity > 0) {
                    <p class="text-sm text-amber-600 flex items-center gap-2">
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" 
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" 
                          clip-rule="evenodd" />
                      </svg>
                      Apenas {{ selectedVariant()!.stockQuantity }} restantes
                    </p>
                  } @else {
                    <p class="text-sm text-red-600 flex items-center gap-2">
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" 
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
                          clip-rule="evenodd" />
                      </svg>
                      Fora de estoque
                    </p>
                  }
                </div>
              }

              <!-- Features -->
              <div class="border-t border-gray-100 pt-8 space-y-4">
                <div class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                      d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                  <div>
                    <p class="text-sm font-medium">Frete Grátis</p>
                    <p class="text-xs text-gray-500">Para compras acima de R$ 299</p>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <div>
                    <p class="text-sm font-medium">Troca Fácil</p>
                    <p class="text-xs text-gray-500">30 dias para troca ou devolução</p>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <div>
                    <p class="text-sm font-medium">Compra Segura</p>
                    <p class="text-xs text-gray-500">Seus dados protegidos</p>
                  </div>
                </div>
              </div>

              <!-- Accordion Sections -->
              <div class="border-t border-gray-100 mt-8">
                <!-- Description -->
                <details class="group" open>
                  <summary class="flex items-center justify-between py-4 cursor-pointer">
                    <span class="text-xs uppercase tracking-wider font-medium">Descrição</span>
                    <svg class="w-4 h-4 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div class="pb-4 text-sm text-gray-600 leading-relaxed">
                    {{ product()!.description }}
                  </div>
                </details>

                <!-- Material -->
                @if (product()!.material) {
                  <details class="group border-t border-gray-100">
                    <summary class="flex items-center justify-between py-4 cursor-pointer">
                      <span class="text-xs uppercase tracking-wider font-medium">Composição</span>
                      <svg class="w-4 h-4 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </summary>
                    <div class="pb-4 text-sm text-gray-600">
                      {{ product()!.material }}
                    </div>
                  </details>
                }

                <!-- Care Instructions -->
                <details class="group border-t border-gray-100">
                  <summary class="flex items-center justify-between py-4 cursor-pointer">
                    <span class="text-xs uppercase tracking-wider font-medium">Cuidados</span>
                    <svg class="w-4 h-4 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div class="pb-4 text-sm text-gray-600">
                    <ul class="space-y-1">
                      <li>• Lavar à mão ou ciclo delicado</li>
                      <li>• Não usar alvejante</li>
                      <li>• Secar à sombra</li>
                      <li>• Passar em temperatura baixa</li>
                    </ul>
                  </div>
                </details>
              </div>
            </div>
          </div>
        </div>
      } @else {
        <!-- Not Found -->
        <div class="text-center py-32">
          <h2 class="font-cormorant text-3xl mb-4">Produto não encontrado</h2>
          <p class="text-gray-500 mb-8">O produto que você procura não está disponível</p>
          <a routerLink="/produtos" class="btn-primary">
            Ver Todos os Produtos
          </a>
        </div>
      }
    </div>
  `,
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  product = signal<Product | null>(null);
  loading = signal(true);

  selectedImageIndex = signal(0);
  selectedColor = signal<{ color: string; colorCode: string } | null>(null);
  selectedSize = signal<string | null>(null);
  quantity = signal(1);
  inWishlist = signal(false);

  selectedImage = computed(() => {
    const p = this.product();
    const idx = this.selectedImageIndex();
    if (p?.images && p.images.length > idx) {
      return p.images[idx].url;
    }
    return null;
  });

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params['slug']) {
        this.loadProduct(params['slug']);
      }
    });
  }

  loadProduct(slug: string): void {
    this.loading.set(true);
    this.productService.getProductBySlug(slug).subscribe({
      next: (product) => {
        this.product.set(product);
        this.selectedImageIndex.set(0);
        // Select first color and size
        const colors = this.uniqueColors();
        if (colors.length > 0) {
          this.selectColor(colors[0]);
        }
        this.loading.set(false);
      },
      error: () => {
        this.product.set(null);
        this.loading.set(false);
      },
    });
  }

  selectImageByIndex(index: number): void {
    this.selectedImageIndex.set(index);
  }

  prevImage(): void {
    const images = this.product()?.images || [];
    const current = this.selectedImageIndex();
    this.selectedImageIndex.set(current > 0 ? current - 1 : images.length - 1);
  }

  nextImage(): void {
    const images = this.product()?.images || [];
    const current = this.selectedImageIndex();
    this.selectedImageIndex.set(current < images.length - 1 ? current + 1 : 0);
  }

  uniqueColors(): { color: string; colorCode: string }[] {
    const seen = new Set<string>();
    return (this.product()?.variants || [])
      .filter((v) => {
        if (seen.has(v.colorCode)) return false;
        seen.add(v.colorCode);
        return true;
      })
      .map((v) => ({ color: v.color, colorCode: v.colorCode }));
  }

  availableSizes(): string[] {
    const color = this.selectedColor();
    if (!color) return [];

    return (this.product()?.variants || [])
      .filter((v) => v.colorCode === color.colorCode && v.available)
      .map((v) => v.size);
  }

  selectColor(color: { color: string; colorCode: string }): void {
    this.selectedColor.set(color);
    this.selectedSize.set(null);
    const sizes = this.availableSizes();
    if (sizes.length > 0) {
      this.selectedSize.set(sizes[0]);
    }
  }

  selectSize(size: string): void {
    this.selectedSize.set(size);
  }

  selectedVariant(): ProductVariant | null {
    const product = this.product();
    const color = this.selectedColor();
    const size = this.selectedSize();

    if (!product || !color || !size) return null;

    return (
      product.variants.find(
        (v) => v.colorCode === color.colorCode && v.size === size
      ) || null
    );
  }

  calculateDiscount(): number {
    const p = this.product();
    if (p?.salePrice && p?.price) {
      return Math.round((1 - p.salePrice / p.price) * 100);
    }
    return 0;
  }

  increaseQuantity(): void {
    this.quantity.update((q) => q + 1);
  }

  decreaseQuantity(): void {
    this.quantity.update((q) => Math.max(1, q - 1));
  }

  canAddToCart(): boolean {
    const variant = this.selectedVariant();
    return !!variant && variant.available && variant.stockQuantity >= this.quantity();
  }

  isInWishlist(): boolean {
    return this.inWishlist();
  }

  toggleWishlist(): void {
    this.inWishlist.update(v => !v);
    // TODO: Call wishlist service
  }

  addToCart(): void {
    const product = this.product();
    const variant = this.selectedVariant();

    if (!product || !variant) return;

    this.cartService.addItem(product.id, this.quantity(), variant.id).subscribe({
      next: () => {
        // Cart drawer opens automatically
      },
      error: (err) => {
        console.error('Error adding to cart:', err);
      },
    });
  }
}
