import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-activate-account',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div
      class="min-h-screen bg-cream-50 flex items-center justify-center py-12 px-4"
    >
      <div class="max-w-md w-full">
        @switch (status()) { @case ('loading') {
        <div class="bg-white p-8 text-center">
          <div
            class="animate-spin w-12 h-12 border-2 border-black border-t-transparent rounded-full mx-auto mb-4"
          ></div>
          <p class="text-gray-600">Verificando token...</p>
        </div>
        } @case ('invalid') {
        <div class="bg-white p-8 text-center">
          <div
            class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <svg
              class="w-8 h-8 text-red-600"
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
          </div>
          <h1 class="font-cormorant text-2xl mb-3">
            Link Inválido ou Expirado
          </h1>
          <p class="text-gray-600 mb-6">
            O link de ativação que você usou não é válido ou já expirou.
          </p>
          <div class="space-y-3">
            <a routerLink="/login" class="btn-primary block text-center">
              Fazer Login
            </a>
            <a routerLink="/" class="btn-secondary block text-center">
              Voltar ao Início
            </a>
          </div>
        </div>
        } @case ('form') {
        <div class="bg-white p-8">
          <div class="text-center mb-8">
            <div
              class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <svg
                class="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 class="font-cormorant text-3xl mb-3">Ative sua Conta</h1>
            <p class="text-gray-600">
              Crie uma senha para acessar sua conta La Luz
            </p>
          </div>

          <form (ngSubmit)="activateAccount()" class="space-y-6">
            <!-- Password -->
            <div>
              <label
                for="password"
                class="block text-xs uppercase tracking-wider mb-2"
              >
                Senha
              </label>
              <input
                type="password"
                id="password"
                [(ngModel)]="password"
                name="password"
                class="w-full border border-gray-200 px-4 py-3 focus:border-black focus:ring-0 transition-colors"
                placeholder="Mínimo 8 caracteres"
                required
                minlength="8"
              />
            </div>

            <!-- Confirm Password -->
            <div>
              <label
                for="confirmPassword"
                class="block text-xs uppercase tracking-wider mb-2"
              >
                Confirmar Senha
              </label>
              <input
                type="password"
                id="confirmPassword"
                [(ngModel)]="confirmPassword"
                name="confirmPassword"
                class="w-full border border-gray-200 px-4 py-3 focus:border-black focus:ring-0 transition-colors"
                placeholder="Digite a senha novamente"
                required
              />
            </div>

            <!-- Password Requirements -->
            <div class="text-xs text-gray-500 space-y-1">
              <p [class.text-green-600]="password.length >= 8">
                {{ password.length >= 8 ? '✓' : '○' }} Mínimo 8 caracteres
              </p>
              <p
                [class.text-green-600]="
                  password === confirmPassword && password.length > 0
                "
              >
                {{
                  password === confirmPassword && password.length > 0
                    ? '✓'
                    : '○'
                }}
                Senhas coincidem
              </p>
            </div>

            @if (error()) {
            <div class="bg-red-50 text-red-600 text-sm p-4">
              {{ error() }}
            </div>
            }

            <button
              type="submit"
              class="btn-primary w-full h-12"
              [disabled]="
                submitting() ||
                password.length < 8 ||
                password !== confirmPassword
              "
              [class.opacity-50]="
                submitting() ||
                password.length < 8 ||
                password !== confirmPassword
              "
            >
              {{ submitting() ? 'ATIVANDO...' : 'ATIVAR MINHA CONTA' }}
            </button>
          </form>
        </div>
        } @case ('success') {
        <div class="bg-white p-8 text-center">
          <div
            class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <svg
              class="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 class="font-cormorant text-3xl mb-3">Conta Ativada!</h1>
          <p class="text-gray-600 mb-8">
            Sua conta foi ativada com sucesso. Agora você pode fazer login para
            acompanhar seus pedidos e aproveitar benefícios exclusivos.
          </p>
          <div class="space-y-3">
            <a routerLink="/login" class="btn-primary block text-center">
              Fazer Login
            </a>
            <a routerLink="/" class="btn-secondary block text-center">
              Continuar Comprando
            </a>
          </div>
        </div>
        } }
      </div>
    </div>
  `,
})
export class ActivateAccountComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private http = inject(HttpClient);

  status = signal<'loading' | 'invalid' | 'form' | 'success'>('loading');
  token = '';
  password = '';
  confirmPassword = '';
  submitting = signal(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.token = params['token'] || '';
      if (!this.token) {
        this.status.set('invalid');
        return;
      }
      this.verifyToken();
    });
  }

  verifyToken(): void {
    this.http
      .get<{ valid: boolean }>(
        `${environment.apiUrl}/account/verify-token?token=${this.token}`
      )
      .subscribe({
        next: (response) => {
          if (response.valid) {
            this.status.set('form');
          } else {
            this.status.set('invalid');
          }
        },
        error: () => {
          this.status.set('invalid');
        },
      });
  }

  activateAccount(): void {
    if (this.password !== this.confirmPassword) {
      this.error.set('As senhas não coincidem');
      return;
    }

    if (this.password.length < 8) {
      this.error.set('A senha deve ter pelo menos 8 caracteres');
      return;
    }

    this.submitting.set(true);
    this.error.set(null);

    this.http
      .post<{ message: string }>(`${environment.apiUrl}/account/activate`, {
        token: this.token,
        password: this.password,
      })
      .subscribe({
        next: () => {
          this.status.set('success');
          this.submitting.set(false);
        },
        error: (err) => {
          this.error.set(
            err.error?.message || 'Erro ao ativar conta. Tente novamente.'
          );
          this.submitting.set(false);
        },
      });
  }
}
