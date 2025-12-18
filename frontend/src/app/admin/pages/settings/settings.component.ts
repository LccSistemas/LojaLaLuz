import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface StoreSettings {
  storeName: string;
  storeEmail: string;
  storePhone: string;
  storeWhatsapp: string;
  storeAddress: string;
  storeCnpj: string;

  // Social
  instagram: string;
  facebook: string;
  tiktok: string;

  // Shipping
  freeShippingMinimum: number;
  defaultShippingCost: number;

  // Promo Bar
  promoBarText: string;
  promoBarActive: boolean;

  // SEO
  metaTitle: string;
  metaDescription: string;

  // Payment
  mercadoPagoPublicKey: string;
  pixEnabled: boolean;
  creditCardEnabled: boolean;
  boletoEnabled: boolean;
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Configurações</h1>
          <p class="text-gray-500">Configure as informações da sua loja</p>
        </div>
        <button
          (click)="saveSettings()"
          [disabled]="saving()"
          class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
        >
          {{ saving() ? 'Salvando...' : 'Salvar Alterações' }}
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Store Info -->
        <div class="bg-white rounded-xl shadow-sm p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">
            Informações da Loja
          </h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Nome da Loja</label
              >
              <input
                type="text"
                [(ngModel)]="settings.storeName"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Email</label
              >
              <input
                type="email"
                [(ngModel)]="settings.storeEmail"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Telefone</label
                >
                <input
                  type="text"
                  [(ngModel)]="settings.storePhone"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="(11) 99999-9999"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >WhatsApp</label
                >
                <input
                  type="text"
                  [(ngModel)]="settings.storeWhatsapp"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="5511999999999"
                />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Endereço</label
              >
              <textarea
                [(ngModel)]="settings.storeAddress"
                rows="2"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg"
              ></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >CNPJ</label
              >
              <input
                type="text"
                [(ngModel)]="settings.storeCnpj"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="00.000.000/0000-00"
              />
            </div>
          </div>
        </div>

        <!-- Social Media -->
        <div class="bg-white rounded-xl shadow-sm p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">
            Redes Sociais
          </h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Instagram</label
              >
              <div class="flex">
                <span
                  class="inline-flex items-center px-3 border border-r-0 border-gray-300 rounded-l-lg bg-gray-50 text-gray-500 text-sm"
                >
                  instagram.com/
                </span>
                <input
                  type="text"
                  [(ngModel)]="settings.instagram"
                  class="flex-1 px-4 py-2 border border-gray-300 rounded-r-lg"
                  placeholder="lojalaluz"
                />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Facebook</label
              >
              <div class="flex">
                <span
                  class="inline-flex items-center px-3 border border-r-0 border-gray-300 rounded-l-lg bg-gray-50 text-gray-500 text-sm"
                >
                  facebook.com/
                </span>
                <input
                  type="text"
                  [(ngModel)]="settings.facebook"
                  class="flex-1 px-4 py-2 border border-gray-300 rounded-r-lg"
                  placeholder="lojalaluz"
                />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >TikTok</label
              >
              <div class="flex">
                <span
                  class="inline-flex items-center px-3 border border-r-0 border-gray-300 rounded-l-lg bg-gray-50 text-gray-500 text-sm"
                >
                  tiktok.com/&#64;
                </span>
                <input
                  type="text"
                  [(ngModel)]="settings.tiktok"
                  class="flex-1 px-4 py-2 border border-gray-300 rounded-r-lg"
                  placeholder="lojalaluz"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Shipping -->
        <div class="bg-white rounded-xl shadow-sm p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Frete</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Frete Grátis Acima de (R$)</label
              >
              <input
                type="number"
                [(ngModel)]="settings.freeShippingMinimum"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="299.00"
              />
              <p class="text-xs text-gray-500 mt-1">
                Deixe 0 para desativar frete grátis
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Custo Padrão de Frete (R$)</label
              >
              <input
                type="number"
                [(ngModel)]="settings.defaultShippingCost"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="19.90"
              />
            </div>
          </div>
        </div>

        <!-- Promo Bar -->
        <div class="bg-white rounded-xl shadow-sm p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">
            Barra Promocional
          </h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Texto da Barra</label
              >
              <input
                type="text"
                [(ngModel)]="settings.promoBarText"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="FRETE GRÁTIS para compras acima de R$ 299"
              />
            </div>
            <label class="flex items-center">
              <input
                type="checkbox"
                [(ngModel)]="settings.promoBarActive"
                class="w-4 h-4 text-primary border-gray-300 rounded"
              />
              <span class="ml-2 text-sm text-gray-700"
                >Mostrar barra promocional</span
              >
            </label>
          </div>
        </div>

        <!-- SEO -->
        <div class="bg-white rounded-xl shadow-sm p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">SEO</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Título (Meta Title)</label
              >
              <input
                type="text"
                [(ngModel)]="settings.metaTitle"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Loja La Luz - Moda Feminina"
              />
              <p class="text-xs text-gray-500 mt-1">
                Recomendado: até 60 caracteres
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Descrição (Meta Description)</label
              >
              <textarea
                [(ngModel)]="settings.metaDescription"
                rows="3"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Descubra as últimas tendências em moda feminina..."
              ></textarea>
              <p class="text-xs text-gray-500 mt-1">
                Recomendado: até 160 caracteres
              </p>
            </div>
          </div>
        </div>

        <!-- Payment -->
        <div class="bg-white rounded-xl shadow-sm p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Pagamentos</h2>
          <div class="space-y-4">
            <div class="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p class="text-sm text-yellow-800">
                <strong>Mercado Pago:</strong> Configure o Access Token no
                painel do Heroku para ativar pagamentos reais.
              </p>
            </div>
            <div class="space-y-3">
              <label class="flex items-center">
                <input
                  type="checkbox"
                  [(ngModel)]="settings.pixEnabled"
                  class="w-4 h-4 text-primary border-gray-300 rounded"
                />
                <span class="ml-2 text-sm text-gray-700">Aceitar PIX</span>
              </label>
              <label class="flex items-center">
                <input
                  type="checkbox"
                  [(ngModel)]="settings.creditCardEnabled"
                  class="w-4 h-4 text-primary border-gray-300 rounded"
                />
                <span class="ml-2 text-sm text-gray-700"
                  >Aceitar Cartão de Crédito</span
                >
              </label>
              <label class="flex items-center">
                <input
                  type="checkbox"
                  [(ngModel)]="settings.boletoEnabled"
                  class="w-4 h-4 text-primary border-gray-300 rounded"
                />
                <span class="ml-2 text-sm text-gray-700">Aceitar Boleto</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Danger Zone -->
      <div class="bg-white rounded-xl shadow-sm p-6 border-2 border-red-200">
        <h2 class="text-lg font-semibold text-red-600 mb-4">Zona de Perigo</h2>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium text-gray-900">Limpar Cache</p>
              <p class="text-sm text-gray-500">Remove dados em cache da loja</p>
            </div>
            <button
              class="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50"
            >
              Limpar Cache
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class SettingsComponent implements OnInit {
  saving = signal(false);

  settings: StoreSettings = {
    storeName: 'Loja La Luz',
    storeEmail: 'contato@lojalaluz.com.br',
    storePhone: '',
    storeWhatsapp: '',
    storeAddress: '',
    storeCnpj: '',
    instagram: 'lojalaluz',
    facebook: '',
    tiktok: '',
    freeShippingMinimum: 299,
    defaultShippingCost: 19.9,
    promoBarText: 'FRETE GRÁTIS para compras acima de R$ 299',
    promoBarActive: true,
    metaTitle: 'Loja La Luz - Moda Feminina',
    metaDescription:
      'Descubra as últimas tendências em moda feminina. Vestidos, blusas, calças e muito mais.',
    mercadoPagoPublicKey: '',
    pixEnabled: true,
    creditCardEnabled: true,
    boletoEnabled: false,
  };

  ngOnInit() {
    this.loadSettings();
  }

  loadSettings() {
    const stored = localStorage.getItem('laluz_settings');
    if (stored) {
      this.settings = { ...this.settings, ...JSON.parse(stored) };
    }
  }

  saveSettings() {
    this.saving.set(true);

    setTimeout(() => {
      localStorage.setItem('laluz_settings', JSON.stringify(this.settings));
      this.saving.set(false);
      alert('Configurações salvas com sucesso!');
    }, 500);
  }
}
