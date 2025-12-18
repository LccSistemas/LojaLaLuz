import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  RouterOutlet,
  RouterLink,
  RouterLinkActive,
  Router,
} from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-screen bg-gray-100">
      <!-- Sidebar -->
      <aside
        class="fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 transform transition-transform duration-300 lg:translate-x-0"
        [class.-translate-x-full]="!sidebarOpen"
      >
        <!-- Logo -->
        <div class="flex items-center justify-between h-16 px-6 bg-gray-800">
          <a
            routerLink="/admin"
            class="text-xl font-serif font-bold text-white"
          >
            La Luz Admin
          </a>
          <button
            class="lg:hidden text-gray-400 hover:text-white"
            (click)="sidebarOpen = false"
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

        <!-- Navigation -->
        <nav class="mt-6 px-3">
          <div class="space-y-1">
            @for (item of menuItems; track item.route) {
            <a
              [routerLink]="item.route"
              routerLinkActive="bg-gray-800 text-white"
              [routerLinkActiveOptions]="{ exact: item.exact }"
              class="flex items-center px-4 py-3 text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white transition-colors group"
            >
              <span [innerHTML]="item.icon" class="w-5 h-5 mr-3"></span>
              {{ item.label }}
              @if (item.badge) {
              <span
                class="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full"
              >
                {{ item.badge }}
              </span>
              }
            </a>
            }
          </div>

          <!-- Divider -->
          <div class="my-6 border-t border-gray-700"></div>

          <!-- Store Link -->
          <a
            href="/"
            target="_blank"
            class="flex items-center px-4 py-3 text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white transition-colors"
          >
            <svg
              class="w-5 h-5 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
            Ver Loja
          </a>

          <!-- Logout -->
          <button
            (click)="logout()"
            class="w-full flex items-center px-4 py-3 text-red-400 rounded-lg hover:bg-gray-800 hover:text-red-300 transition-colors mt-2"
          >
            <svg
              class="w-5 h-5 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Sair
          </button>
        </nav>
      </aside>

      <!-- Main Content -->
      <div class="lg:pl-64">
        <!-- Top Bar -->
        <header class="sticky top-0 z-40 bg-white border-b border-gray-200">
          <div class="flex items-center justify-between h-16 px-4 sm:px-6">
            <!-- Mobile menu button -->
            <button
              class="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              (click)="sidebarOpen = true"
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
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <!-- Search -->
            <div class="flex-1 max-w-lg mx-4 hidden sm:block">
              <div class="relative">
                <input
                  type="text"
                  placeholder="Buscar..."
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

            <!-- Right side -->
            <div class="flex items-center space-x-4">
              <!-- Notifications -->
              <button class="relative p-2 text-gray-400 hover:text-gray-600">
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
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                <span
                  class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"
                ></span>
              </button>

              <!-- Profile -->
              <div class="relative">
                <button
                  (click)="showProfileMenu = !showProfileMenu"
                  class="flex items-center space-x-2 hover:bg-gray-100 rounded-lg p-2 transition-colors"
                >
                  <div
                    class="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-medium"
                  >
                    {{ userInitial }}
                  </div>
                  <span
                    class="hidden md:block text-sm font-medium text-gray-700"
                    >{{ userName }}</span
                  >
                  <svg
                    class="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                <!-- Dropdown Menu -->
                @if (showProfileMenu) {
                <div
                  class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
                >
                  <div class="px-4 py-2 border-b border-gray-100">
                    <p class="text-sm font-medium text-gray-900">
                      {{ userName }}
                    </p>
                    <p class="text-xs text-gray-500">{{ userEmail }}</p>
                  </div>
                  <a
                    href="/"
                    class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <svg
                      class="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                    Ver Loja
                  </a>
                  <button
                    (click)="logout()"
                    class="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <svg
                      class="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Sair
                  </button>
                </div>
                }
              </div>
            </div>
          </div>
        </header>

        <!-- Page Content -->
        <main class="p-4 sm:p-6 lg:p-8">
          <router-outlet></router-outlet>
        </main>
      </div>

      <!-- Overlay -->
      @if (sidebarOpen) {
      <div
        class="fixed inset-0 z-40 bg-black/50 lg:hidden"
        (click)="sidebarOpen = false"
      ></div>
      }

      <!-- Profile Menu Overlay -->
      @if (showProfileMenu) {
      <div class="fixed inset-0 z-40" (click)="showProfileMenu = false"></div>
      }
    </div>
  `,
})
export class AdminLayoutComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  sidebarOpen = false;
  showProfileMenu = false;

  get userName(): string {
    return this.authService.userName() || 'Admin';
  }

  get userEmail(): string {
    return this.authService.currentUser()?.email || '';
  }

  get userInitial(): string {
    return this.userName.charAt(0).toUpperCase();
  }

  logout() {
    this.showProfileMenu = false;
    this.authService.logout();
    this.router.navigate(['/admin/login']);
  }

  menuItems = [
    {
      label: 'Dashboard',
      route: '/admin',
      exact: true,
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>',
    },
    {
      label: 'Pedidos',
      route: '/admin/orders',
      exact: false,
      badge: 3,
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/></svg>',
    },
    {
      label: 'Produtos',
      route: '/admin/products',
      exact: false,
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>',
    },
    {
      label: 'Categorias',
      route: '/admin/categories',
      exact: false,
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg>',
    },
    {
      label: 'Clientes',
      route: '/admin/customers',
      exact: false,
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>',
    },
    {
      label: 'Banners',
      route: '/admin/banners',
      exact: false,
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>',
    },
    {
      label: 'Personalização',
      route: '/admin/site-config',
      exact: false,
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"/></svg>',
    },
    {
      label: 'Configurações',
      route: '/admin/settings',
      exact: false,
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>',
    },
  ];
}
