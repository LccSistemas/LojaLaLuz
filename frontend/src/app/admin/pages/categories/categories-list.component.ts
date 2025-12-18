import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ImageUploadComponent } from '../../../components/image-upload/image-upload.component';
import { UploadResult } from '../../../services/image-upload.service';

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  active: boolean;
  displayOrder: number;
  productCount: number;
}

@Component({
  selector: 'app-categories-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ImageUploadComponent],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Categorias</h1>
          <p class="text-gray-500">Organize seus produtos em categorias</p>
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
          Nova Categoria
        </button>
      </div>

      <!-- Categories Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (category of categories(); track category.id) {
        <div class="bg-white rounded-xl shadow-sm overflow-hidden group">
          <div class="relative h-40 bg-gray-100">
            @if (category.imageUrl) {
            <img
              [src]="category.imageUrl"
              [alt]="category.name"
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
            <div
              class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2"
            >
              <button
                (click)="editCategory(category)"
                class="p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100"
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
                (click)="deleteCategory(category)"
                class="p-2 bg-white rounded-full text-red-600 hover:bg-red-50"
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
          <div class="p-4">
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-semibold text-gray-900">{{ category.name }}</h3>
              <div class="flex items-center gap-2">
                <span class="text-xs text-gray-400">Ordem: {{ category.displayOrder || 0 }}</span>
                <span
                  class="px-2 py-1 text-xs rounded-full"
                  [class.bg-green-100]="category.active"
                  [class.text-green-800]="category.active"
                  [class.bg-gray-100]="!category.active"
                  [class.text-gray-600]="!category.active"
                >
                  {{ category.active ? 'Ativa' : 'Inativa' }}
                </span>
              </div>
            </div>
            <p class="text-sm text-gray-500 mb-2">
              {{ category.description || 'Sem descrição' }}
            </p>
            <p class="text-sm text-gray-400">
              {{ category.productCount || 0 }} produtos
            </p>
          </div>
        </div>
        } @empty {
        <div
          class="col-span-full bg-white rounded-xl shadow-sm p-12 text-center"
        >
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
              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
            />
          </svg>
          <p class="text-gray-500 mb-4">Nenhuma categoria criada</p>
          <button (click)="openModal()" class="text-primary hover:underline">
            Criar primeira categoria
          </button>
        </div>
        }
      </div>

      <!-- Modal -->
      @if (showModal()) {
      <div class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen p-4">
          <div class="fixed inset-0 bg-black/50" (click)="closeModal()"></div>
          <div class="relative bg-white rounded-xl shadow-xl max-w-md w-full">
            <div class="p-6 border-b border-gray-100">
              <h3 class="text-lg font-semibold">
                {{ editingCategory ? 'Editar Categoria' : 'Nova Categoria' }}
              </h3>
            </div>
            <div class="p-6 space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Nome *</label
                >
                <input
                  type="text"
                  [(ngModel)]="formData.name"
                  (blur)="generateSlug()"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Ex: Vestidos"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Slug</label
                >
                <input
                  type="text"
                  [(ngModel)]="formData.slug"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="vestidos"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Descrição</label
                >
                <textarea
                  [(ngModel)]="formData.description"
                  rows="3"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Descrição da categoria..."
                ></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Imagem</label
                >
                <app-image-upload
                  #categoryImageUpload
                  folder="categories"
                  [multiple]="false"
                  [maxFiles]="1"
                  (imagesUploaded)="onImageUploaded($event)"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Ordem de Exibição</label
                >
                <input
                  type="number"
                  [(ngModel)]="formData.displayOrder"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="0"
                  min="0"
                />
                <p class="text-xs text-gray-500 mt-1">Menor número aparece primeiro no menu</p>
              </div>
              <label class="flex items-center">
                <input
                  type="checkbox"
                  [(ngModel)]="formData.active"
                  class="w-4 h-4 text-primary border-gray-300 rounded"
                />
                <span class="ml-2 text-sm text-gray-700">Categoria ativa</span>
              </label>
            </div>
            <div
              class="p-6 border-t border-gray-100 flex justify-end space-x-3"
            >
              <button
                (click)="closeModal()"
                class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                (click)="saveCategory()"
                [disabled]="saving()"
                class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
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
export class CategoriesListComponent implements OnInit {
  @ViewChild('categoryImageUpload') categoryImageUpload!: ImageUploadComponent;

  categories = signal<Category[]>([]);
  showModal = signal(false);
  saving = signal(false);
  editingCategory: Category | null = null;

  formData = {
    name: '',
    slug: '',
    description: '',
    imageUrl: '',
    displayOrder: 0,
    active: true,
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.http.get<Category[]>(`${environment.apiUrl}/categories`).subscribe({
      next: (cats) => this.categories.set(cats),
      error: () => this.categories.set([]),
    });
  }

  openModal() {
    this.editingCategory = null;
    this.formData = {
      name: '',
      slug: '',
      description: '',
      imageUrl: '',
      displayOrder: 0,
      active: true,
    };
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.editingCategory = null;
    if (this.categoryImageUpload) {
      this.categoryImageUpload.clearAll();
    }
  }

  editCategory(category: Category) {
    this.editingCategory = category;
    this.formData = {
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      imageUrl: category.imageUrl || '',
      displayOrder: category.displayOrder || 0,
      active: category.active,
    };
    this.showModal.set(true);
  }

  generateSlug() {
    if (this.formData.name && !this.formData.slug) {
      this.formData.slug = this.formData.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }
  }

  onImageUploaded(images: UploadResult[]) {
    if (images.length > 0) {
      this.formData.imageUrl = images[0].url;
    }
  }

  saveCategory() {
    if (!this.formData.name) return;

    this.saving.set(true);

    const data = { ...this.formData };
    const request = this.editingCategory
      ? this.http.put(
          `${environment.apiUrl}/categories/${this.editingCategory.id}`,
          data
        )
      : this.http.post(`${environment.apiUrl}/categories`, data);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.closeModal();
        this.loadCategories();
      },
      error: (err) => {
        this.saving.set(false);
        console.error('Error saving category:', err);
        alert('Erro ao salvar categoria');
      },
    });
  }

  deleteCategory(category: Category) {
    if (confirm(`Excluir categoria "${category.name}"?`)) {
      this.http
        .delete(`${environment.apiUrl}/categories/${category.id}`)
        .subscribe({
          next: () => this.loadCategories(),
          error: () => alert('Erro ao excluir categoria'),
        });
    }
  }
}
