import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div
      class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4"
    >
      <div class="max-w-md w-full">
        <!-- Logo -->
        <div class="text-center mb-8">
          <a
            routerLink="/"
            class="text-4xl font-display font-bold text-primary-600"
            >La Luz</a
          >
          <h2 class="mt-4 text-2xl font-bold text-gray-900">Criar sua conta</h2>
          <p class="mt-2 text-gray-600">
            Já tem conta?
            <a
              routerLink="/login"
              class="text-primary-600 font-medium hover:underline"
              >Faça login</a
            >
          </p>
        </div>

        <!-- Register Form -->
        <div class="bg-white rounded-2xl shadow-sm p-8">
          @if (error()) {
          <div class="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm">
            {{ error() }}
          </div>
          }

          <form (ngSubmit)="register()" class="space-y-5">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Nome completo *</label
              >
              <input
                type="text"
                [(ngModel)]="name"
                name="name"
                class="input-field"
                placeholder="Seu nome"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >E-mail *</label
              >
              <input
                type="email"
                [(ngModel)]="email"
                name="email"
                class="input-field"
                placeholder="seu@email.com"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Telefone</label
              >
              <input
                type="tel"
                [(ngModel)]="phone"
                name="phone"
                class="input-field"
                placeholder="(11) 99999-9999"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Senha *</label
              >
              <input
                type="password"
                [(ngModel)]="password"
                name="password"
                class="input-field"
                placeholder="Mínimo 6 caracteres"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Confirmar senha *</label
              >
              <input
                type="password"
                [(ngModel)]="confirmPassword"
                name="confirmPassword"
                class="input-field"
                placeholder="Repita a senha"
                required
              />
            </div>

            <div class="flex items-start">
              <input
                type="checkbox"
                id="terms"
                [(ngModel)]="acceptTerms"
                name="acceptTerms"
                class="w-4 h-4 text-primary-600 rounded mt-1"
              />
              <label for="terms" class="ml-2 text-sm text-gray-600">
                Li e aceito os
                <a href="#" class="text-primary-600">Termos de Uso</a> e
                <a href="#" class="text-primary-600">Política de Privacidade</a>
              </label>
            </div>

            <button
              type="submit"
              [disabled]="loading() || !acceptTerms"
              class="w-full btn-primary disabled:opacity-50"
            >
              @if (loading()) {
              <span class="flex items-center justify-center gap-2">
                <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                    fill="none"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  ></path>
                </svg>
                Criando conta...
              </span>
              } @else { Criar conta }
            </button>
          </form>
        </div>

        <!-- Benefits -->
        <div class="mt-8 text-center text-sm text-gray-600">
          <p class="font-medium mb-2">Vantagens de criar sua conta:</p>
          <ul class="space-y-1">
            <li>✓ Acompanhe seus pedidos</li>
            <li>✓ Ganhe cupons exclusivos</li>
            <li>✓ Salve seus produtos favoritos</li>
          </ul>
        </div>
      </div>
    </div>
  `,
})
export class RegisterComponent {
  private router = inject(Router);
  private authService = inject(AuthService);

  name = '';
  email = '';
  phone = '';
  password = '';
  confirmPassword = '';
  acceptTerms = false;

  loading = signal(false);
  error = signal<string | null>(null);

  register(): void {
    if (!this.name || !this.email || !this.password) {
      this.error.set('Preencha todos os campos obrigatórios');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error.set('As senhas não coincidem');
      return;
    }

    if (this.password.length < 6) {
      this.error.set('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.authService
      .register({
        name: this.name,
        email: this.email,
        password: this.password,
        phone: this.phone || undefined,
      })
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.loading.set(false);
          this.error.set(
            err.error?.message || 'Erro ao criar conta. Tente novamente.'
          );
        },
      });
  }
}
