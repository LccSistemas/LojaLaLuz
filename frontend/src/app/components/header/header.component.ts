import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { CartDrawerComponent } from '../cart-drawer/cart-drawer.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, CartDrawerComponent],
  template: `
    <!-- Announcement Bar -->
    <div class="bg-primary-900 text-white text-center py-2.5">
      <p class="text-xs tracking-wider">
        FRETE GRÁTIS PARA COMPRAS ACIMA DE R$ 299 | PARCELE EM ATÉ 6X SEM JUROS
      </p>
    </div>

    <!-- Main Header -->
    <header class="bg-white sticky top-0 z-40 border-b border-primary-100">
      <div class="max-w-8xl mx-auto">
        <!-- Top Row: Search | Logo | Icons -->
        <div
          class="flex items-center justify-between px-4 lg:px-8 h-16 lg:h-20"
        >
          <!-- Left: Menu + Search (Desktop) -->
          <div class="flex items-center gap-6 flex-1">
            <!-- Mobile Menu Toggle -->
            <button
              (click)="mobileMenuOpen.set(!mobileMenuOpen())"
              class="lg:hidden p-1"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                @if (mobileMenuOpen()) {
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M6 18L18 6M6 6l12 12"
                />
                } @else {
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M4 6h16M4 12h16M4 18h16"
                />
                }
              </svg>
            </button>

            <!-- Search Icon (Mobile) / Search Bar (Desktop) -->
            <button
              (click)="searchOpen.set(!searchOpen())"
              class="lg:hidden p-1"
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
                  stroke-width="1.5"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>

            <div class="hidden lg:block relative w-64">
              <input
                type="text"
                placeholder="Buscar..."
                class="w-full pl-10 pr-4 py-2 text-sm border-b border-primary-200 focus:border-primary-900 focus:outline-none bg-transparent placeholder-primary-400"
                (keyup.enter)="search($event)"
              />
              <svg
                class="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          <!-- Center: Logo -->
          <a
            routerLink="/"
            class="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0"
          >
            <h1 class="font-serif text-2xl lg:text-3xl tracking-wide">
              LA LUZ
            </h1>
          </a>

          <!-- Right: Account + Wishlist + Cart -->
          <div class="flex items-center gap-4 lg:gap-6 flex-1 justify-end">
            <!-- Account -->
            <div class="relative group">
              @if (auth.isAuthenticated()) {
              <button class="hidden lg:flex items-center gap-1 nav-link">
                <span>Olá, {{ getUserFirstName() }}</span>
              </button>
              <a routerLink="/conta" class="lg:hidden p-1">
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </a>
              <!-- Dropdown -->
              <div
                class="absolute right-0 top-full mt-2 w-48 bg-white border border-primary-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50"
              >
                <a
                  routerLink="/conta"
                  class="block px-4 py-2 text-sm hover:bg-primary-50"
                  >Minha Conta</a
                >
                <a
                  routerLink="/conta"
                  class="block px-4 py-2 text-sm hover:bg-primary-50"
                  >Meus Pedidos</a
                >
                @if (auth.isAdmin()) {
                <a
                  routerLink="/admin"
                  class="block px-4 py-2 text-sm text-accent-gold hover:bg-primary-50"
                  >Painel Admin</a
                >
                }
                <hr class="my-2 border-primary-100" />
                <button
                  (click)="auth.logout()"
                  class="block w-full text-left px-4 py-2 text-sm text-sale hover:bg-primary-50"
                >
                  Sair
                </button>
              </div>
              } @else {
              <a routerLink="/login" class="hidden lg:block nav-link">Entrar</a>
              <a routerLink="/login" class="lg:hidden p-1">
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </a>
              }
            </div>

            <!-- Wishlist -->
            <a
              routerLink="/wishlist"
              class="p-1 hover:opacity-60 transition-opacity"
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
                  stroke-width="1.5"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </a>

            <!-- Cart Button -->
            <button
              (click)="cartOpen.set(true)"
              class="relative p-1 hover:opacity-60 transition-opacity"
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
                  stroke-width="1.5"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              @if (cart.cartCount() > 0) {
              <span
                class="absolute -top-1 -right-1 bg-primary-900 text-white text-2xs w-4 h-4 flex items-center justify-center"
              >
                {{ cart.cartCount() }}
              </span>
              }
            </button>
          </div>
        </div>

        <!-- Navigation (Desktop) -->
        <nav
          class="hidden lg:flex items-center justify-center gap-10 py-3 border-t border-primary-50"
        >
          <a
            routerLink="/produtos"
            [queryParams]="{ new: true }"
            class="nav-link"
            >Novidades</a
          >
          <a
            routerLink="/produtos"
            [queryParams]="{ category: 'vestidos' }"
            class="nav-link"
            >Vestidos</a
          >
          <a
            routerLink="/produtos"
            [queryParams]="{ category: 'tops' }"
            class="nav-link"
            >Tops</a
          >
          <a
            routerLink="/produtos"
            [queryParams]="{ category: 'calcas' }"
            class="nav-link"
            >Calças</a
          >
          <a
            routerLink="/produtos"
            [queryParams]="{ category: 'saias' }"
            class="nav-link"
            >Saias</a
          >
          <a
            routerLink="/produtos"
            [queryParams]="{ category: 'conjuntos' }"
            class="nav-link"
            >Conjuntos</a
          >
          <a
            routerLink="/produtos"
            [queryParams]="{ category: 'acessorios' }"
            class="nav-link"
            >Acessórios</a
          >
          <a
            routerLink="/produtos"
            [queryParams]="{ sale: true }"
            class="nav-link text-sale"
            >Sale</a
          >
        </nav>
      </div>
    </header>

    <!-- Mobile Search Bar -->
    @if (searchOpen()) {
    <div
      class="lg:hidden fixed inset-x-0 top-[105px] bg-white border-b border-primary-100 p-4 z-30 animate-fade-in"
    >
      <div class="relative">
        <input
          type="text"
          placeholder="Buscar produtos..."
          class="w-full pl-10 pr-4 py-3 text-sm border border-primary-200 focus:border-primary-900 focus:outline-none"
          (keyup.enter)="search($event)"
        />
        <svg
          class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <button
          (click)="searchOpen.set(false)"
          class="absolute right-3 top-1/2 -translate-y-1/2"
        >
          <svg
            class="w-5 h-5 text-primary-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
    }

    <!-- Mobile Menu -->
    @if (mobileMenuOpen()) {
    <div class="lg:hidden fixed inset-0 z-50">
      <div class="overlay" (click)="mobileMenuOpen.set(false)"></div>
      <div
        class="fixed top-0 left-0 h-full w-80 max-w-full bg-white z-50 mobile-menu-slide overflow-y-auto"
      >
        <!-- Header -->
        <div
          class="flex items-center justify-between p-5 border-b border-primary-100"
        >
          <span class="font-serif text-xl">LA LUZ</span>
          <button (click)="mobileMenuOpen.set(false)">
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <!-- Navigation -->
        <nav class="p-5 space-y-1">
          <a
            routerLink="/produtos"
            (click)="mobileMenuOpen.set(false)"
            class="block py-3 text-sm tracking-wider uppercase border-b border-primary-50"
          >
            Novidades
          </a>
          <a
            routerLink="/produtos"
            [queryParams]="{ category: 'vestidos' }"
            (click)="mobileMenuOpen.set(false)"
            class="block py-3 text-sm tracking-wider uppercase border-b border-primary-50"
          >
            Vestidos
          </a>
          <a
            routerLink="/produtos"
            [queryParams]="{ category: 'tops' }"
            (click)="mobileMenuOpen.set(false)"
            class="block py-3 text-sm tracking-wider uppercase border-b border-primary-50"
          >
            Tops
          </a>
          <a
            routerLink="/produtos"
            [queryParams]="{ category: 'calcas' }"
            (click)="mobileMenuOpen.set(false)"
            class="block py-3 text-sm tracking-wider uppercase border-b border-primary-50"
          >
            Calças
          </a>
          <a
            routerLink="/produtos"
            [queryParams]="{ category: 'saias' }"
            (click)="mobileMenuOpen.set(false)"
            class="block py-3 text-sm tracking-wider uppercase border-b border-primary-50"
          >
            Saias
          </a>
          <a
            routerLink="/produtos"
            [queryParams]="{ category: 'conjuntos' }"
            (click)="mobileMenuOpen.set(false)"
            class="block py-3 text-sm tracking-wider uppercase border-b border-primary-50"
          >
            Conjuntos
          </a>
          <a
            routerLink="/produtos"
            [queryParams]="{ category: 'acessorios' }"
            (click)="mobileMenuOpen.set(false)"
            class="block py-3 text-sm tracking-wider uppercase border-b border-primary-50"
          >
            Acessórios
          </a>
          <a
            routerLink="/produtos"
            [queryParams]="{ sale: true }"
            (click)="mobileMenuOpen.set(false)"
            class="block py-3 text-sm tracking-wider uppercase text-sale border-b border-primary-50"
          >
            Sale
          </a>
        </nav>

        <!-- Account Links -->
        <div class="p-5 border-t border-primary-100">
          @if (auth.isAuthenticated()) {
          <a
            routerLink="/conta"
            (click)="mobileMenuOpen.set(false)"
            class="block py-2 text-sm"
            >Minha Conta</a
          >
          <a
            routerLink="/conta"
            (click)="mobileMenuOpen.set(false)"
            class="block py-2 text-sm"
            >Meus Pedidos</a
          >
          <button
            (click)="auth.logout(); mobileMenuOpen.set(false)"
            class="block py-2 text-sm text-sale"
          >
            Sair
          </button>
          } @else {
          <a
            routerLink="/login"
            (click)="mobileMenuOpen.set(false)"
            class="block py-2 text-sm"
            >Entrar / Cadastrar</a
          >
          }
        </div>
      </div>
    </div>
    }

    <!-- Cart Drawer -->
    @if (cartOpen()) {
    <app-cart-drawer (close)="cartOpen.set(false)" />
    }
  `,
  styles: [
    `
      @keyframes slideInLeft {
        from {
          transform: translateX(-100%);
        }
        to {
          transform: translateX(0);
        }
      }
      .mobile-menu-slide {
        animation: slideInLeft 0.3s ease-out forwards;
      }
    `,
  ],
})
export class HeaderComponent {
  cart = inject(CartService);
  auth = inject(AuthService);

  mobileMenuOpen = signal(false);
  searchOpen = signal(false);
  cartOpen = signal(false);

  search(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    if (query.trim()) {
      this.searchOpen.set(false);
      window.location.href = `/produtos?q=${encodeURIComponent(query)}`;
    }
  }

  openCart(): void {
    this.cartOpen.set(true);
  }

  getUserFirstName(): string {
    const user = this.auth.currentUser();
    if (user?.name) {
      return user.name.split(' ')[0];
    }
    return '';
  }
}
