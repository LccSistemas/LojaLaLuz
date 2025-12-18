import { Component, input, inject, output } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../../models';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe],
  template: `
    <div class="product-card">
      <!-- Image Container -->
      <a
        [routerLink]="['/produto', product().slug]"
        class="product-card-image block"
      >
        <!-- Main Image -->
        <img
          [src]="
            product().images[0]?.url ||
            'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400'
          "
          [alt]="product().name"
          class="main-image"
          loading="lazy"
        />

        <!-- Hover Image (if available) -->
        @if (product().images[1]) {
        <img
          [src]="product().images[1].url"
          [alt]="product().name"
          class="hover-image"
          loading="lazy"
        />
        }

        <!-- Badges -->
        <div class="absolute top-3 left-3 flex flex-col gap-1">
          @if (product().onSale) {
          <span class="badge-sale">SALE</span>
          } @if (isNew()) {
          <span class="badge-new">NEW</span>
          }
        </div>

        <!-- Quick Add (on hover) -->
        <div
          class="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <button
            (click)="quickAdd($event)"
            class="w-full bg-white/95 text-primary-900 py-3 text-xs tracking-widest uppercase font-medium hover:bg-primary-900 hover:text-white transition-colors"
          >
            + Adicionar
          </button>
        </div>

        <!-- Wishlist Button -->
        <button
          (click)="toggleWishlist($event)"
          class="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white/80 hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
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
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
      </a>

      <!-- Product Info -->
      <div class="pt-3 pb-1 px-1">
        <a [routerLink]="['/produto', product().slug]" class="block">
          <h3
            class="text-sm font-medium text-primary-900 line-clamp-1 hover:underline underline-offset-2"
          >
            {{ product().name }}
          </h3>
        </a>

        <!-- Price -->
        <div class="mt-1 flex items-center gap-2">
          @if (product().onSale && product().salePrice) {
          <span class="text-sm font-medium text-sale">
            {{ product().salePrice | currency : 'BRL' : 'symbol' : '1.2-2' }}
          </span>
          <span class="text-sm text-primary-400 line-through">
            {{ product().price | currency : 'BRL' : 'symbol' : '1.2-2' }}
          </span>
          } @else {
          <span class="text-sm font-medium text-primary-900">
            {{ product().price | currency : 'BRL' : 'symbol' : '1.2-2' }}
          </span>
          }
        </div>

        <!-- Color Swatches (if available) -->
        @if (colors().length > 1) {
        <div class="mt-2 flex items-center gap-1">
          @for (color of colors().slice(0, 4); track color) {
          <span
            class="w-3 h-3 rounded-full border border-primary-200"
            [style.background-color]="color"
          ></span>
          } @if (colors().length > 4) {
          <span class="text-xs text-primary-500"
            >+{{ colors().length - 4 }}</span
          >
          }
        </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .product-card-image {
        position: relative;
        overflow: hidden;
        aspect-ratio: 3/4;
        background-color: #f5f5f5;
      }

      .main-image,
      .hover-image {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: opacity 0.5s ease;
      }

      .hover-image {
        opacity: 0;
      }

      .product-card:hover .hover-image {
        opacity: 1;
      }

      .product-card:hover .main-image {
        opacity: 0;
      }
    `,
  ],
})
export class ProductCardComponent {
  product = input.required<Product>();
  addedToCart = output<Product>();

  private cartService = inject(CartService);

  isNew(): boolean {
    // Consider product new if created within last 14 days
    return true; // For demo purposes
  }

  colors(): string[] {
    const uniqueColors = [
      ...new Set(
        this.product()
          .variants.map((v) => v.colorCode)
          .filter(Boolean)
      ),
    ];
    return uniqueColors as string[];
  }

  quickAdd(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    const product = this.product();
    const variant = product.variants?.[0];

    this.cartService.addToCart(product.id, 1, variant?.id).subscribe(() => {
      this.addedToCart.emit(product);
    });
  }

  toggleWishlist(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    // TODO: Implement wishlist
    console.log('Toggle wishlist:', this.product().id);
  }
}
