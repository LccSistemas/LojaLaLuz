import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { Order } from '../../models';

@Component({
  selector: 'app-checkout-success',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe, DatePipe],
  template: `
    <div class="min-h-screen bg-accent-cream/30 py-12 lg:py-20">
      <div class="max-w-2xl mx-auto px-4">
        <!-- Success Icon -->
        <div class="text-center mb-10">
          <div
            class="w-20 h-20 bg-accent-sage/30 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <svg
              class="w-10 h-10 text-primary-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 class="font-serif text-3xl lg:text-4xl mb-3">
            Pedido Confirmado!
          </h1>
          <p class="text-primary-600">Obrigado por comprar na La Luz</p>
        </div>

        <!-- Order Info Card -->
        <div class="bg-white p-6 lg:p-8 mb-6">
          <div
            class="flex items-center justify-between mb-6 pb-6 border-b border-primary-100"
          >
            <div>
              <p class="text-xs tracking-wider uppercase text-primary-500 mb-1">
                Número do Pedido
              </p>
              <p class="text-lg font-medium">{{ orderNumber }}</p>
            </div>
            <div class="text-right">
              <p class="text-xs tracking-wider uppercase text-primary-500 mb-1">
                Status
              </p>
              <span
                class="inline-block bg-accent-sage/30 text-primary-700 px-3 py-1 text-xs tracking-wider uppercase"
              >
                Confirmado
              </span>
            </div>
          </div>

          <!-- Email confirmation -->
          <div class="flex items-start gap-4 mb-6">
            <div
              class="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center flex-shrink-0"
            >
              <svg
                class="w-5 h-5 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <h3 class="font-medium mb-1">Confirmação enviada</h3>
              <p class="text-sm text-primary-600">
                Enviamos os detalhes do pedido para <strong>{{ email }}</strong>
              </p>
            </div>
          </div>

          <!-- Create Account CTA (for guest users) -->
          @if (!isLoggedIn()) {
          <div class="bg-accent-blush/30 p-5 mb-6">
            <h3 class="font-medium mb-2">🎉 Crie sua conta em 1 clique</h3>
            <p class="text-sm text-primary-600 mb-4">
              Enviamos um link mágico para seu email. Clique nele para criar sua
              conta e:
            </p>
            <ul class="text-sm text-primary-600 space-y-1 mb-4">
              <li class="flex items-center gap-2">
                <svg
                  class="w-4 h-4 text-accent-sage"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
                Acompanhar seus pedidos
              </li>
              <li class="flex items-center gap-2">
                <svg
                  class="w-4 h-4 text-accent-sage"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
                Salvar endereços para próximas compras
              </li>
              <li class="flex items-center gap-2">
                <svg
                  class="w-4 h-4 text-accent-sage"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
                Receber ofertas exclusivas
              </li>
            </ul>
            <p class="text-xs text-primary-500">
              Sem senha! Acesse usando apenas seu email.
            </p>
          </div>
          }

          <!-- Next Steps -->
          <div class="space-y-4">
            <h3 class="font-medium">Próximos passos</h3>

            <div class="flex items-start gap-4">
              <div
                class="w-8 h-8 bg-primary-900 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm"
              >
                1
              </div>
              <div>
                <p class="font-medium text-sm">Confirmação do pagamento</p>
                <p class="text-sm text-primary-500">
                  Você receberá um email quando o pagamento for confirmado
                </p>
              </div>
            </div>

            <div class="flex items-start gap-4">
              <div
                class="w-8 h-8 bg-primary-200 text-primary-600 rounded-full flex items-center justify-center flex-shrink-0 text-sm"
              >
                2
              </div>
              <div>
                <p class="font-medium text-sm">Preparação do pedido</p>
                <p class="text-sm text-primary-500">
                  Vamos preparar seus itens com carinho
                </p>
              </div>
            </div>

            <div class="flex items-start gap-4">
              <div
                class="w-8 h-8 bg-primary-200 text-primary-600 rounded-full flex items-center justify-center flex-shrink-0 text-sm"
              >
                3
              </div>
              <div>
                <p class="font-medium text-sm">Envio</p>
                <p class="text-sm text-primary-500">
                  Você receberá o código de rastreamento por email
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a routerLink="/" class="btn-primary text-center">
            Continuar Comprando
          </a>
          @if (isLoggedIn()) {
          <a routerLink="/conta" class="btn-secondary text-center">
            Ver Meus Pedidos
          </a>
          }
        </div>

        <!-- Support -->
        <div class="text-center mt-10">
          <p class="text-sm text-primary-500">
            Dúvidas? Entre em contato:
            <a href="mailto:contato@lojalaluz.com" class="underline"
              >contato&#64;lojalaluz.com</a
            >
          </p>
        </div>
      </div>
    </div>
  `,
})
export class CheckoutSuccessComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);

  orderNumber: string | null = null;
  email: string | null = null;

  ngOnInit(): void {
    this.orderNumber = this.route.snapshot.queryParams['order'];
    this.email =
      this.route.snapshot.queryParams['email'] ||
      this.authService.currentUser()?.email;
  }

  isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }
}
