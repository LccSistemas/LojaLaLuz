import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SiteConfigService } from '../../services/site-config.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- Newsletter Section -->
    <section class="bg-accent-cream py-16">
      <div class="max-w-xl mx-auto px-4 text-center">
        <h3 class="font-serif text-2xl mb-2">Junte-se à nossa comunidade</h3>
        <p class="text-sm text-primary-600 mb-6">
          Cadastre-se e receba 10% OFF na primeira compra + novidades exclusivas
        </p>
        <form class="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            placeholder="Seu melhor email"
            class="flex-1 px-4 py-3.5 border border-primary-200 text-sm focus:border-primary-900 focus:outline-none"
          />
          <button type="submit" class="btn-primary">Inscrever</button>
        </form>
      </div>
    </section>

    <!-- Main Footer -->
    <footer class="bg-white border-t border-primary-100">
      <div class="max-w-8xl mx-auto px-4 lg:px-8 py-12">
        <!-- Footer Grid -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          <!-- Column 1: Shop -->
          <div>
            <h4 class="text-xs tracking-widest uppercase font-medium mb-6">
              Comprar
            </h4>
            <ul class="space-y-3">
              <li>
                <a
                  routerLink="/produtos"
                  class="text-sm text-primary-600 hover:text-primary-900 transition-colors"
                  >Novidades</a
                >
              </li>
              <li>
                <a
                  routerLink="/produtos"
                  [queryParams]="{ category: 'vestidos' }"
                  class="text-sm text-primary-600 hover:text-primary-900 transition-colors"
                  >Vestidos</a
                >
              </li>
              <li>
                <a
                  routerLink="/produtos"
                  [queryParams]="{ category: 'tops' }"
                  class="text-sm text-primary-600 hover:text-primary-900 transition-colors"
                  >Tops</a
                >
              </li>
              <li>
                <a
                  routerLink="/produtos"
                  [queryParams]="{ category: 'calcas' }"
                  class="text-sm text-primary-600 hover:text-primary-900 transition-colors"
                  >Calças</a
                >
              </li>
              <li>
                <a
                  routerLink="/produtos"
                  [queryParams]="{ sale: true }"
                  class="text-sm text-sale hover:opacity-80 transition-opacity"
                  >Sale</a
                >
              </li>
            </ul>
          </div>

          <!-- Column 2: Help -->
          <div>
            <h4 class="text-xs tracking-widest uppercase font-medium mb-6">
              Ajuda
            </h4>
            <ul class="space-y-3">
              <li>
                <a
                  href="#"
                  class="text-sm text-primary-600 hover:text-primary-900 transition-colors"
                  >Fale Conosco</a
                >
              </li>
              <li>
                <a
                  href="#"
                  class="text-sm text-primary-600 hover:text-primary-900 transition-colors"
                  >Entregas</a
                >
              </li>
              <li>
                <a
                  href="#"
                  class="text-sm text-primary-600 hover:text-primary-900 transition-colors"
                  >Trocas e Devoluções</a
                >
              </li>
              <li>
                <a
                  href="#"
                  class="text-sm text-primary-600 hover:text-primary-900 transition-colors"
                  >Guia de Tamanhos</a
                >
              </li>
              <li>
                <a
                  href="#"
                  class="text-sm text-primary-600 hover:text-primary-900 transition-colors"
                  >FAQ</a
                >
              </li>
            </ul>
          </div>

          <!-- Column 3: Company -->
          <div>
            <h4 class="text-xs tracking-widest uppercase font-medium mb-6">
              Sobre
            </h4>
            <ul class="space-y-3">
              <li>
                <a
                  href="#"
                  class="text-sm text-primary-600 hover:text-primary-900 transition-colors"
                  >Nossa História</a
                >
              </li>
              <li>
                <a
                  href="#"
                  class="text-sm text-primary-600 hover:text-primary-900 transition-colors"
                  >Sustentabilidade</a
                >
              </li>
              <li>
                <a
                  href="#"
                  class="text-sm text-primary-600 hover:text-primary-900 transition-colors"
                  >Carreiras</a
                >
              </li>
              <li>
                <a
                  href="#"
                  class="text-sm text-primary-600 hover:text-primary-900 transition-colors"
                  >Termos de Uso</a
                >
              </li>
              <li>
                <a
                  href="#"
                  class="text-sm text-primary-600 hover:text-primary-900 transition-colors"
                  >Privacidade</a
                >
              </li>
            </ul>
          </div>

          <!-- Column 4: Social -->
          <div>
            <h4 class="text-xs tracking-widest uppercase font-medium mb-6">
              Siga-nos
            </h4>
            <div class="flex items-center gap-4 mb-6">
              @for (social of siteConfig.socialLinks(); track social.platform) {
              <a
                [href]="social.url"
                target="_blank"
                class="hover:opacity-60 transition-opacity"
              >
                @if (social.platform === 'instagram') {
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
                  />
                </svg>
                } @else if (social.platform === 'twitter') {
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"
                  />
                </svg>
                } @else if (social.platform === 'youtube') {
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"
                  />
                </svg>
                } @else if (social.platform === 'pinterest') {
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"
                  />
                </svg>
                } @else if (social.platform === 'facebook') {
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                  />
                </svg>
                } @else if (social.platform === 'tiktok') {
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"
                  />
                </svg>
                } @else if (social.platform === 'whatsapp') {
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
                  />
                </svg>
                }
              </a>
              }
            </div>

            <!-- Payment Methods -->
            <h4 class="text-xs tracking-widest uppercase font-medium mb-4">
              Pagamento
            </h4>
            <div class="flex flex-wrap items-center gap-2">
              <img
                src="https://cdn-icons-png.flaticon.com/32/349/349221.png"
                alt="Visa"
                class="h-6 opacity-60"
              />
              <img
                src="https://cdn-icons-png.flaticon.com/32/349/349228.png"
                alt="Mastercard"
                class="h-6 opacity-60"
              />
              <img
                src="https://cdn-icons-png.flaticon.com/32/5968/5968299.png"
                alt="PIX"
                class="h-6 opacity-60"
              />
              <img
                src="https://cdn-icons-png.flaticon.com/32/888/888870.png"
                alt="Boleto"
                class="h-6 opacity-60"
              />
            </div>
          </div>
        </div>

        <!-- Bottom Bar -->
        <div
          class="mt-12 pt-8 border-t border-primary-100 flex flex-col md:flex-row items-center justify-between gap-4"
        >
          @if (siteConfig.storeLogo()) {
          <img
            [src]="siteConfig.storeLogo()"
            [alt]="siteConfig.storeName()"
            class="h-6"
          />
          } @else {
          <span class="font-serif text-xl">{{ siteConfig.storeName() }}</span>
          }
          <p class="text-xs text-primary-500">
            © {{ currentYear }} {{ siteConfig.storeName() }}. Todos os direitos
            reservados.
          </p>
          <div class="flex items-center gap-4">
            <img
              src="https://cdn-icons-png.flaticon.com/32/5968/5968350.png"
              alt="SSL"
              class="h-8 opacity-60"
            />
          </div>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  siteConfig = inject(SiteConfigService);
  currentYear = new Date().getFullYear();
}
