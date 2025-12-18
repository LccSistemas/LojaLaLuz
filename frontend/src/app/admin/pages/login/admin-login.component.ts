import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div class="max-w-md w-full">
        <!-- Logo -->
        <div class="text-center mb-8">
          <h1 class="text-3xl font-serif font-bold text-white">La Luz</h1>
          <p class="text-gray-400 mt-2">Painel Administrativo</p>
        </div>

        <!-- Login Card -->
        <div class="bg-white rounded-2xl shadow-xl p-8">
          <h2 class="text-2xl font-semibold text-gray-900 mb-6">Entrar</h2>

          @if (error()) {
          <div
            class="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm"
          >
            {{ error() }}
          </div>
          }

          <form (ngSubmit)="onSubmit()" class="space-y-5">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                [(ngModel)]="email"
                name="email"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="admin@lojalaluz.com"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Senha
              </label>
              <div class="relative">
                <input
                  [type]="showPassword ? 'text' : 'password'"
                  [(ngModel)]="password"
                  name="password"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  (click)="showPassword = !showPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  @if (showPassword) {
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                  } @else {
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  }
                </button>
              </div>
            </div>

            <button
              type="submit"
              [disabled]="loading()"
              class="w-full py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              @if (loading()) {
              <span class="flex items-center justify-center">
                <svg
                  class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Entrando...
              </span>
              } @else { Entrar }
            </button>
          </form>

          <div class="mt-6 text-center">
            <a href="/" class="text-sm text-gray-500 hover:text-gray-700">
              ← Voltar para a loja
            </a>
          </div>
        </div>

        <p class="text-center text-gray-500 text-sm mt-8">
          © {{ currentYear }} Loja La Luz. Todos os direitos reservados.
        </p>
      </div>
    </div>
  `,
})
export class AdminLoginComponent {
  email = '';
  password = '';
  showPassword = false;
  loading = signal(false);
  error = signal('');
  currentYear = new Date().getFullYear();

  private returnUrl = '/admin';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Se já está logado como admin, redireciona
    if (this.authService.isAuthenticated() && this.authService.isAdmin()) {
      this.router.navigate(['/admin']);
    }

    // Pega returnUrl se existir
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin';
  }

  onSubmit() {
    if (!this.email || !this.password) {
      this.error.set('Preencha todos os campos');
      return;
    }

    this.loading.set(true);
    this.error.set('');

    this.authService
      .login({ email: this.email, password: this.password })
      .subscribe({
        next: (response) => {
          this.loading.set(false);

          if (response.role !== 'ADMIN') {
            this.error.set(
              'Acesso não autorizado. Apenas administradores podem acessar.'
            );
            this.authService.logout();
            return;
          }

          this.router.navigateByUrl(this.returnUrl);
        },
        error: (err) => {
          this.loading.set(false);
          if (err.status === 401) {
            this.error.set('Email ou senha incorretos');
          } else if (err.status === 429) {
            this.error.set('Muitas tentativas. Aguarde alguns minutos.');
          } else {
            this.error.set('Erro ao fazer login. Tente novamente.');
          }
        },
      });
  }
}
