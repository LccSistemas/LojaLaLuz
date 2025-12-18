import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  SiteConfigService, 
  StoreConfig, 
  HeroConfig, 
  BannerSplitItem, 
  SaleBannerConfig, 
  FeatureItem 
} from '../../../services/site-config.service';
import { ImageUploadComponent } from '../../../components/image-upload/image-upload.component';
import { UploadResult } from '../../../services/image-upload.service';

@Component({
  selector: 'app-site-config',
  standalone: true,
  imports: [CommonModule, FormsModule, ImageUploadComponent],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Configuração do Site</h1>
          <p class="text-gray-500">Personalize a aparência e conteúdo da loja</p>
        </div>
        <div class="flex gap-3">
          <button
            (click)="resetDefaults()"
            class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Restaurar Padrão
          </button>
          <button
            (click)="saveConfig()"
            [disabled]="saving()"
            class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
          >
            {{ saving() ? 'Salvando...' : 'Salvar Alterações' }}
          </button>
        </div>
      </div>

      <!-- Tabs -->
      <div class="border-b border-gray-200">
        <nav class="flex gap-8">
          @for (tab of tabs; track tab.id) {
          <button
            (click)="activeTab = tab.id"
            class="py-3 text-sm font-medium border-b-2 transition-colors"
            [class.border-primary]="activeTab === tab.id"
            [class.text-primary]="activeTab === tab.id"
            [class.border-transparent]="activeTab !== tab.id"
            [class.text-gray-500]="activeTab !== tab.id"
          >
            {{ tab.label }}
          </button>
          }
        </nav>
      </div>

      <!-- Hero Section Tab -->
      @if (activeTab === 'hero') {
      <div class="bg-white rounded-xl shadow-sm p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Banner Principal (Hero)</h2>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Subtítulo</label>
              <input
                type="text"
                [(ngModel)]="config.hero.subtitle"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Nova Coleção"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Título Principal</label>
              <input
                type="text"
                [(ngModel)]="config.hero.title"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Summer Essentials"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Texto do Botão</label>
              <input
                type="text"
                [(ngModel)]="config.hero.buttonText"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Comprar Agora"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Link do Botão</label>
              <input
                type="text"
                [(ngModel)]="config.hero.buttonLink"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="/produtos"
              />
            </div>
            <label class="flex items-center">
              <input
                type="checkbox"
                [(ngModel)]="config.hero.active"
                class="w-4 h-4 text-primary border-gray-300 rounded"
              />
              <span class="ml-2 text-sm text-gray-700">Ativo</span>
            </label>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Imagem de Fundo</label>
            @if (config.hero.imageUrl) {
            <div class="relative mb-3">
              <img
                [src]="config.hero.imageUrl"
                alt="Hero"
                class="w-full h-48 object-cover rounded-lg"
              />
              <button
                (click)="config.hero.imageUrl = ''"
                class="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            }
            <app-image-upload
              folder="site"
              [multiple]="false"
              [maxFiles]="1"
              [maxSizeMB]="10"
              (imagesUploaded)="onHeroImageUploaded($event)"
            />
            <p class="text-xs text-gray-500 mt-1">Recomendado: 1920x1080 pixels</p>
          </div>
        </div>
      </div>
      }

      <!-- Banner Split Tab -->
      @if (activeTab === 'banners') {
      <div class="space-y-6">
        <div class="bg-white rounded-xl shadow-sm p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Banners Duplos (Split)</h2>
          <p class="text-sm text-gray-500 mb-4">Dois banners exibidos lado a lado na home</p>
          
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            @for (banner of config.bannerSplit; track $index; let i = $index) {
            <div class="border border-gray-200 rounded-lg p-4">
              <h3 class="font-medium text-gray-900 mb-3">Banner {{ i + 1 }}</h3>
              
              @if (banner.imageUrl) {
              <div class="relative mb-3">
                <img
                  [src]="banner.imageUrl"
                  [alt]="banner.title"
                  class="w-full h-32 object-cover rounded-lg"
                />
                <button
                  (click)="banner.imageUrl = ''"
                  class="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              }
              
              <app-image-upload
                folder="site"
                [multiple]="false"
                [maxFiles]="1"
                (imagesUploaded)="onBannerSplitImageUploaded($event, i)"
              />
              
              <div class="space-y-3 mt-3">
                <input
                  type="text"
                  [(ngModel)]="banner.subtitle"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="Subtítulo (ex: Coleção)"
                />
                <input
                  type="text"
                  [(ngModel)]="banner.title"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="Título (ex: Vestidos)"
                />
                <input
                  type="text"
                  [(ngModel)]="banner.link"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="Link (ex: /produtos?category=vestidos)"
                />
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    [(ngModel)]="banner.active"
                    class="w-4 h-4 text-primary border-gray-300 rounded"
                  />
                  <span class="ml-2 text-sm text-gray-700">Ativo</span>
                </label>
              </div>
            </div>
            }
          </div>
        </div>

        <!-- Sale Banner -->
        <div class="bg-white rounded-xl shadow-sm p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Banner de Promoção</h2>
          
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Subtítulo</label>
                <input
                  type="text"
                  [(ngModel)]="config.saleBanner.subtitle"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Aproveite"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Título</label>
                <input
                  type="text"
                  [(ngModel)]="config.saleBanner.title"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Até 50% OFF"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Texto do Botão</label>
                <input
                  type="text"
                  [(ngModel)]="config.saleBanner.buttonText"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Ver Sale"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Link</label>
                <input
                  type="text"
                  [(ngModel)]="config.saleBanner.link"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="/produtos?sale=true"
                />
              </div>
              <label class="flex items-center">
                <input
                  type="checkbox"
                  [(ngModel)]="config.saleBanner.active"
                  class="w-4 h-4 text-primary border-gray-300 rounded"
                />
                <span class="ml-2 text-sm text-gray-700">Ativo</span>
              </label>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Imagem</label>
              @if (config.saleBanner.imageUrl) {
              <div class="relative mb-3">
                <img
                  [src]="config.saleBanner.imageUrl"
                  alt="Sale Banner"
                  class="w-full h-32 object-cover rounded-lg"
                />
                <button
                  (click)="config.saleBanner.imageUrl = ''"
                  class="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              }
              <app-image-upload
                folder="site"
                [multiple]="false"
                [maxFiles]="1"
                [maxSizeMB]="10"
                (imagesUploaded)="onSaleBannerImageUploaded($event)"
              />
            </div>
          </div>
        </div>
      </div>
      }

      <!-- Features Tab -->
      @if (activeTab === 'features') {
      <div class="bg-white rounded-xl shadow-sm p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Benefícios (Features)</h2>
        <p class="text-sm text-gray-500 mb-4">Ícones de benefícios exibidos no rodapé da home</p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          @for (feature of config.features; track $index; let i = $index) {
          <div class="border border-gray-200 rounded-lg p-4">
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span [innerHTML]="getFeatureIcon(feature.icon)"></span>
              </div>
              <div class="flex-1 space-y-3">
                <select
                  [(ngModel)]="feature.icon"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="shipping">Frete / Entrega</option>
                  <option value="exchange">Troca / Devolução</option>
                  <option value="secure">Segurança</option>
                  <option value="installment">Parcelamento</option>
                  <option value="support">Suporte</option>
                  <option value="quality">Qualidade</option>
                </select>
                <input
                  type="text"
                  [(ngModel)]="feature.title"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="Título"
                />
                <input
                  type="text"
                  [(ngModel)]="feature.description"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="Descrição"
                />
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    [(ngModel)]="feature.active"
                    class="w-4 h-4 text-primary border-gray-300 rounded"
                  />
                  <span class="ml-2 text-sm text-gray-700">Ativo</span>
                </label>
              </div>
            </div>
          </div>
          }
        </div>
      </div>
      }

      <!-- Instagram Tab -->
      @if (activeTab === 'instagram') {
      <div class="bg-white rounded-xl shadow-sm p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Feed do Instagram</h2>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Username do Instagram</label>
            <div class="flex">
              <span class="inline-flex items-center px-3 border border-r-0 border-gray-300 rounded-l-lg bg-gray-50 text-gray-500 text-sm">
                &#64;
              </span>
              <input
                type="text"
                [(ngModel)]="config.instagramUsername"
                class="flex-1 px-4 py-2 border border-gray-300 rounded-r-lg"
                placeholder="lojalaluz"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Imagens do Feed (6 imagens)</label>
            <p class="text-xs text-gray-500 mb-3">Adicione URLs de imagens ou faça upload</p>
            
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              @for (img of config.instagramImages; track $index; let i = $index) {
              <div class="relative aspect-square">
                <img
                  [src]="img"
                  alt="Instagram"
                  class="w-full h-full object-cover rounded-lg"
                />
                <button
                  (click)="removeInstagramImage(i)"
                  class="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full"
                >
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              }
            </div>

            <div class="mt-4">
              <app-image-upload
                folder="instagram"
                [multiple]="true"
                [maxFiles]="6"
                (imagesUploaded)="onInstagramImagesUploaded($event)"
              />
            </div>
          </div>
        </div>
      </div>
      }

      <!-- Store Info Tab -->
      @if (activeTab === 'store') {
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white rounded-xl shadow-sm p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Informações da Loja</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nome da Loja</label>
              <input
                type="text"
                [(ngModel)]="config.storeName"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                [(ngModel)]="config.storeEmail"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                <input
                  type="text"
                  [(ngModel)]="config.storePhone"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                <input
                  type="text"
                  [(ngModel)]="config.storeWhatsapp"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="5511999999999"
                />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
              <textarea
                [(ngModel)]="config.storeAddress"
                rows="2"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg"
              ></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">CNPJ</label>
              <input
                type="text"
                [(ngModel)]="config.storeCnpj"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        </div>

        <div class="space-y-6">
          <!-- Promo Bar -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Barra Promocional</h2>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Texto</label>
                <input
                  type="text"
                  [(ngModel)]="config.promoBarText"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <label class="flex items-center">
                <input
                  type="checkbox"
                  [(ngModel)]="config.promoBarActive"
                  class="w-4 h-4 text-primary border-gray-300 rounded"
                />
                <span class="ml-2 text-sm text-gray-700">Exibir barra promocional</span>
              </label>
            </div>
          </div>

          <!-- Social Links -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Redes Sociais</h2>
            <div class="space-y-3">
              @for (social of config.socialLinks; track social.platform) {
              <div class="flex items-center gap-3">
                <label class="flex items-center flex-shrink-0">
                  <input
                    type="checkbox"
                    [(ngModel)]="social.active"
                    class="w-4 h-4 text-primary border-gray-300 rounded"
                  />
                </label>
                <span class="w-24 text-sm font-medium text-gray-700 capitalize">{{ social.platform }}</span>
                <input
                  type="url"
                  [(ngModel)]="social.url"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="URL completa"
                />
              </div>
              }
            </div>
          </div>
        </div>
      </div>
      }

      <!-- SEO Tab -->
      @if (activeTab === 'seo') {
      <div class="bg-white rounded-xl shadow-sm p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">SEO & Meta Tags</h2>
        <div class="space-y-4 max-w-2xl">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
            <input
              type="text"
              [(ngModel)]="config.metaTitle"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
            <p class="text-xs text-gray-500 mt-1">{{ config.metaTitle.length }}/60 caracteres</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
            <textarea
              [(ngModel)]="config.metaDescription"
              rows="3"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg"
            ></textarea>
            <p class="text-xs text-gray-500 mt-1">{{ config.metaDescription.length }}/160 caracteres</p>
          </div>
        </div>
      </div>
      }
    </div>
  `,
})
export class SiteConfigComponent implements OnInit {
  private siteConfigService: SiteConfigService;

  config!: StoreConfig;
  saving = signal(false);
  activeTab = 'hero';

  tabs = [
    { id: 'hero', label: 'Hero Principal' },
    { id: 'banners', label: 'Banners' },
    { id: 'features', label: 'Benefícios' },
    { id: 'instagram', label: 'Instagram' },
    { id: 'store', label: 'Loja' },
    { id: 'seo', label: 'SEO' },
  ];

  constructor(siteConfigService: SiteConfigService) {
    this.siteConfigService = siteConfigService;
  }

  ngOnInit() {
    this.config = { ...this.siteConfigService.getFullConfig() };
  }

  saveConfig() {
    this.saving.set(true);
    
    setTimeout(() => {
      this.siteConfigService.updateConfig(this.config);
      this.saving.set(false);
      alert('Configurações salvas com sucesso!');
    }, 500);
  }

  resetDefaults() {
    if (confirm('Restaurar todas as configurações para o padrão?')) {
      this.siteConfigService.resetToDefaults();
      this.config = { ...this.siteConfigService.getFullConfig() };
    }
  }

  onHeroImageUploaded(images: UploadResult[]) {
    if (images.length > 0) {
      this.config.hero.imageUrl = images[0].url;
    }
  }

  onBannerSplitImageUploaded(images: UploadResult[], index: number) {
    if (images.length > 0) {
      this.config.bannerSplit[index].imageUrl = images[0].url;
    }
  }

  onSaleBannerImageUploaded(images: UploadResult[]) {
    if (images.length > 0) {
      this.config.saleBanner.imageUrl = images[0].url;
    }
  }

  onInstagramImagesUploaded(images: UploadResult[]) {
    const newImages = images.map(img => img.url);
    this.config.instagramImages = [...this.config.instagramImages, ...newImages].slice(0, 6);
  }

  removeInstagramImage(index: number) {
    this.config.instagramImages.splice(index, 1);
  }

  getFeatureIcon(icon: string): string {
    const icons: Record<string, string> = {
      shipping: '<svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/></svg>',
      exchange: '<svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>',
      secure: '<svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>',
      installment: '<svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>',
      support: '<svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"/></svg>',
      quality: '<svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg>',
    };
    return icons[icon] || icons['shipping'];
  }
}
