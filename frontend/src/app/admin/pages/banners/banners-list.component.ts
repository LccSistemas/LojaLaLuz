import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ImageUploadComponent } from '../../../components/image-upload/image-upload.component';
import {
  UploadResult,
  ImageUploadService,
} from '../../../services/image-upload.service';

interface Banner {
  id: number;
  title: string;
  subtitle: string;
  imageUrl: string;
  link: string;
  order: number;
  active: boolean;
}

@Component({
  selector: 'app-banners-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ImageUploadComponent],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Banners</h1>
          <p class="text-gray-500">Gerencie os banners da página inicial</p>
        </div>
        <button
          (click)="openModal()"
          class="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          <svg
            class="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Novo Banner
        </button>
      </div>

      <!-- Info -->
      <div class="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div class="flex items-start space-x-3">
          <svg
            class="w-5 h-5 text-blue-500 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <p class="text-sm text-blue-800 font-medium">Dicas para banners</p>
            <ul class="text-sm text-blue-700 mt-1 list-disc list-inside">
              <li>Tamanho recomendado: 1920x600 pixels</li>
              <li>Formato: JPG ou WebP para melhor performance</li>
              <li>Arraste os banners para reordenar</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Banners List -->
      <div class="space-y-4">
        @for (banner of banners(); track banner.id; let i = $index) {
        <div class="bg-white rounded-xl shadow-sm overflow-hidden flex">
          <div class="w-64 h-32 bg-gray-100 flex-shrink-0">
            @if (banner.imageUrl) {
            <img
              [src]="banner.imageUrl"
              [alt]="banner.title"
              class="w-full h-full object-cover"
            />
            } @else {
            <div class="flex items-center justify-center h-full text-gray-400">
              <svg
                class="w-12 h-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            }
          </div>
          <div class="flex-1 p-4 flex items-center justify-between">
            <div>
              <h3 class="font-semibold text-gray-900">
                {{ banner.title || 'Sem título' }}
              </h3>
              <p class="text-sm text-gray-500">
                {{ banner.subtitle || 'Sem subtítulo' }}
              </p>
              @if (banner.link) {
              <p class="text-xs text-gray-400 mt-1">Link: {{ banner.link }}</p>
              }
            </div>
            <div class="flex items-center space-x-4">
              <label class="flex items-center">
                <input
                  type="checkbox"
                  [checked]="banner.active"
                  (change)="toggleBanner(banner)"
                  class="w-4 h-4 text-primary border-gray-300 rounded"
                />
                <span class="ml-2 text-sm text-gray-600">Ativo</span>
              </label>
              <button
                (click)="editBanner(banner)"
                class="p-2 text-gray-400 hover:text-primary"
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
                    stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
              <button
                (click)="deleteBanner(banner)"
                class="p-2 text-gray-400 hover:text-red-600"
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
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
        } @empty {
        <div class="bg-white rounded-xl shadow-sm p-12 text-center">
          <svg
            class="w-12 h-12 text-gray-300 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p class="text-gray-500 mb-4">Nenhum banner criado</p>
          <button (click)="openModal()" class="text-primary hover:underline">
            Adicionar primeiro banner
          </button>
        </div>
        }
      </div>

      <!-- Modal -->
      @if (showModal()) {
      <div class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen p-4">
          <div class="fixed inset-0 bg-black/50" (click)="closeModal()"></div>
          <div class="relative bg-white rounded-xl shadow-xl max-w-lg w-full">
            <div class="p-6 border-b border-gray-100">
              <h3 class="text-lg font-semibold">
                {{ editingBanner ? 'Editar Banner' : 'Novo Banner' }}
              </h3>
            </div>
            <div class="p-6 space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Título</label
                >
                <input
                  type="text"
                  [(ngModel)]="formData.title"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Título do banner"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Subtítulo</label
                >
                <input
                  type="text"
                  [(ngModel)]="formData.subtitle"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Subtítulo ou call to action"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Link (opcional)</label
                >
                <input
                  type="text"
                  [(ngModel)]="formData.link"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="/produtos ou URL externa"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Imagem</label
                >
                <app-image-upload
                  #bannerImageUpload
                  folder="banners"
                  [multiple]="false"
                  [maxFiles]="1"
                  [maxSizeMB]="10"
                  [resizeImages]="false"
                  (imagesUploaded)="onImageUploaded($event)"
                />
              </div>
              <label class="flex items-center">
                <input
                  type="checkbox"
                  [(ngModel)]="formData.active"
                  class="w-4 h-4 text-primary border-gray-300 rounded"
                />
                <span class="ml-2 text-sm text-gray-700">Banner ativo</span>
              </label>
            </div>
            <div
              class="p-6 border-t border-gray-100 flex justify-end space-x-3"
            >
              <button
                (click)="closeModal()"
                class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg"
              >
                Cancelar
              </button>
              <button
                (click)="saveBanner()"
                [disabled]="saving()"
                class="px-4 py-2 bg-primary text-white rounded-lg disabled:opacity-50"
              >
                {{ saving() ? 'Salvando...' : 'Salvar' }}
              </button>
            </div>
          </div>
        </div>
      </div>
      }
    </div>
  `,
})
export class BannersListComponent implements OnInit {
  @ViewChild('bannerImageUpload') bannerImageUpload!: ImageUploadComponent;

  banners = signal<Banner[]>([]);
  showModal = signal(false);
  saving = signal(false);
  editingBanner: Banner | null = null;

  formData = {
    title: '',
    subtitle: '',
    imageUrl: '',
    link: '',
    active: true,
  };

  constructor() {}

  ngOnInit() {
    this.loadBanners();
  }

  loadBanners() {
    // For now, use localStorage. In production, would be API call
    const stored = localStorage.getItem('laluz_banners');
    if (stored) {
      this.banners.set(JSON.parse(stored));
    } else {
      // Default banners
      this.banners.set([
        {
          id: 1,
          title: 'Nova Coleção Verão',
          subtitle: 'Descubra as tendências da estação',
          imageUrl:
            'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1920&h=600&fit=crop',
          link: '/produtos',
          order: 0,
          active: true,
        },
        {
          id: 2,
          title: 'Até 50% OFF',
          subtitle: 'Promoção por tempo limitado',
          imageUrl:
            'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&h=600&fit=crop',
          link: '/produtos?sale=true',
          order: 1,
          active: true,
        },
      ]);
    }
  }

  saveBannersToStorage() {
    localStorage.setItem('laluz_banners', JSON.stringify(this.banners()));
  }

  openModal() {
    this.editingBanner = null;
    this.formData = {
      title: '',
      subtitle: '',
      imageUrl: '',
      link: '',
      active: true,
    };
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.editingBanner = null;
    if (this.bannerImageUpload) {
      this.bannerImageUpload.clearAll();
    }
  }

  editBanner(banner: Banner) {
    this.editingBanner = banner;
    this.formData = {
      title: banner.title,
      subtitle: banner.subtitle,
      imageUrl: banner.imageUrl,
      link: banner.link,
      active: banner.active,
    };
    this.showModal.set(true);
  }

  onImageUploaded(images: UploadResult[]) {
    if (images.length > 0) {
      this.formData.imageUrl = images[0].url;
    }
  }

  saveBanner() {
    this.saving.set(true);

    setTimeout(() => {
      if (this.editingBanner) {
        // Update existing
        this.banners.update((banners) =>
          banners.map((b) =>
            b.id === this.editingBanner!.id ? { ...b, ...this.formData } : b
          )
        );
      } else {
        // Add new
        const newBanner: Banner = {
          id: Date.now(),
          ...this.formData,
          order: this.banners().length,
        };
        this.banners.update((banners) => [...banners, newBanner]);
      }

      this.saveBannersToStorage();
      this.saving.set(false);
      this.closeModal();
    }, 500);
  }

  toggleBanner(banner: Banner) {
    banner.active = !banner.active;
    this.saveBannersToStorage();
  }

  deleteBanner(banner: Banner) {
    if (confirm('Excluir este banner?')) {
      this.banners.update((banners) =>
        banners.filter((b) => b.id !== banner.id)
      );
      this.saveBannersToStorage();
    }
  }
}
