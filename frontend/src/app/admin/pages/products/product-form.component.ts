import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ImageUploadComponent } from '../../../components/image-upload/image-upload.component';
import { UploadResult } from '../../../services/image-upload.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    ImageUploadComponent,
  ],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <a
            routerLink="/admin/products"
            class="p-2 text-gray-400 hover:text-gray-600"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </a>
          <div>
            <h1 class="text-2xl font-bold text-gray-900">
              {{ isEditing ? 'Editar Produto' : 'Novo Produto' }}
            </h1>
            <p class="text-gray-500">
              {{
                isEditing
                  ? 'Atualize as informações do produto'
                  : 'Preencha as informações do produto'
              }}
            </p>
          </div>
        </div>
        <div class="flex items-center space-x-3">
          <button
            type="button"
            routerLink="/admin/products"
            class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            (click)="saveProduct()"
            [disabled]="saving()"
            class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
          >
            {{
              saving()
                ? 'Salvando...'
                : isEditing
                ? 'Atualizar'
                : 'Criar Produto'
            }}
          </button>
        </div>
      </div>

      <form [formGroup]="form" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Basic Info -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">
              Informações Básicas
            </h2>

            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Nome do Produto *</label
                >
                <input
                  type="text"
                  formControlName="name"
                  (blur)="generateSlug()"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Ex: Vestido Midi Floral"
                />
                @if (form.get('name')?.invalid && form.get('name')?.touched) {
                <p class="mt-1 text-sm text-red-600">Nome é obrigatório</p>
                }
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Slug (URL)</label
                >
                <input
                  type="text"
                  formControlName="slug"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="vestido-midi-floral"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Descrição</label
                >
                <textarea
                  formControlName="description"
                  rows="4"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Descreva o produto..."
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Images -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Imagens</h2>
            <app-image-upload
              #imageUpload
              folder="products"
              [multiple]="true"
              [maxFiles]="10"
              (imagesUploaded)="onImagesUploaded($event)"
              (imageRemoved)="onImageRemoved($event)"
            />
          </div>

          <!-- Variants -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-semibold text-gray-900">
                Variantes (Tamanhos/Cores)
              </h2>
              <button
                type="button"
                (click)="addVariant()"
                class="text-sm text-primary hover:underline"
              >
                + Adicionar Variante
              </button>
            </div>

            <div class="space-y-4">
              @for (variant of variants.controls; track $index; let i = $index)
              {
              <div class="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <div class="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label class="block text-xs font-medium text-gray-500 mb-1"
                      >Tamanho</label
                    >
                    <input
                      type="text"
                      [formControl]="getVariantControl(i, 'size')"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="P, M, G..."
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-500 mb-1"
                      >Cor</label
                    >
                    <input
                      type="text"
                      [formControl]="getVariantControl(i, 'color')"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="Preto, Branco..."
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-500 mb-1"
                      >Estoque</label
                    >
                    <input
                      type="number"
                      [formControl]="getVariantControl(i, 'stockQuantity')"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      min="0"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-500 mb-1"
                      >SKU</label
                    >
                    <input
                      type="text"
                      [formControl]="getVariantControl(i, 'sku')"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="PROD-001-P"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  (click)="removeVariant(i)"
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
              } @empty {
              <p class="text-gray-500 text-center py-4">
                Nenhuma variante adicionada. Clique em "Adicionar Variante" para
                criar.
              </p>
              }
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Pricing -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Preço</h2>

            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Preço (R$) *</label
                >
                <input
                  type="number"
                  formControlName="price"
                  step="0.01"
                  min="0"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Preço Promocional (R$)</label
                >
                <input
                  type="number"
                  formControlName="salePrice"
                  step="0.01"
                  min="0"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="0.00"
                />
                <p class="mt-1 text-xs text-gray-500">
                  Deixe em branco se não houver promoção
                </p>
              </div>
            </div>
          </div>

          <!-- Organization -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">
              Organização
            </h2>

            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Categoria</label
                >
                <select
                  formControlName="categoryId"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option [ngValue]="null">Selecione uma categoria</option>
                  @for (cat of categories(); track cat.id) {
                  <option [ngValue]="cat.id">{{ cat.name }}</option>
                  }
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Marca</label
                >
                <input
                  type="text"
                  formControlName="brand"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Nome da marca"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Material</label
                >
                <input
                  type="text"
                  formControlName="material"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Ex: 100% Algodão"
                />
              </div>
            </div>
          </div>

          <!-- Status -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Status</h2>

            <div class="space-y-4">
              <label class="flex items-center">
                <input
                  type="checkbox"
                  formControlName="active"
                  class="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span class="ml-2 text-sm text-gray-700">Produto ativo</span>
              </label>

              <label class="flex items-center">
                <input
                  type="checkbox"
                  formControlName="featured"
                  class="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span class="ml-2 text-sm text-gray-700"
                  >Produto em destaque</span
                >
              </label>
            </div>
          </div>
        </div>
      </form>
    </div>
  `,
})
export class ProductFormComponent implements OnInit {
  @ViewChild('imageUpload') imageUpload!: ImageUploadComponent;

  form: FormGroup;
  categories = signal<{ id: number; name: string }[]>([]);
  saving = signal(false);
  isEditing = false;
  productId: number | null = null;
  uploadedImages: UploadResult[] = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      slug: [''],
      description: [''],
      price: [null, [Validators.required, Validators.min(0)]],
      salePrice: [null],
      categoryId: [null],
      brand: [''],
      material: [''],
      active: [true],
      featured: [false],
      variants: this.fb.array([]),
    });
  }

  get variants(): FormArray {
    return this.form.get('variants') as FormArray;
  }

  getVariantControl(index: number, field: string): any {
    return (this.variants.at(index) as FormGroup).get(field);
  }

  ngOnInit() {
    this.loadCategories();

    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEditing = true;
      this.productId = parseInt(id);
      this.loadProduct(this.productId);
    } else {
      // Add default variant
      this.addVariant();
    }
  }

  loadCategories() {
    this.http.get<any[]>(`${environment.apiUrl}/categories`).subscribe({
      next: (cats) => this.categories.set(cats),
      error: () => this.categories.set([]),
    });
  }

  loadProduct(id: number) {
    this.http.get<any>(`${environment.apiUrl}/products/${id}`).subscribe({
      next: (product) => {
        this.form.patchValue({
          name: product.name,
          slug: product.slug,
          description: product.description,
          price: product.price,
          salePrice: product.salePrice,
          categoryId: product.categoryId,
          brand: product.brand,
          material: product.material,
          active: product.active,
          featured: product.featured,
        });

        // Load variants
        if (product.variants?.length) {
          product.variants.forEach((v: any) => {
            this.variants.push(
              this.fb.group({
                id: [v.id],
                size: [v.size],
                color: [v.color],
                stockQuantity: [v.stockQuantity],
                sku: [v.sku],
              })
            );
          });
        }

        // Load existing images
        if (product.images?.length) {
          this.uploadedImages = product.images.map((img: any) => ({
            url: img.url,
            path: img.url,
            fileName: img.altText || 'image',
          }));
          if (this.imageUpload) {
            this.imageUpload.setInitialImages(this.uploadedImages);
          }
        }
      },
      error: (err) => {
        console.error('Error loading product:', err);
        this.router.navigate(['/admin/products']);
      },
    });
  }

  generateSlug() {
    const name = this.form.get('name')?.value;
    if (name && !this.form.get('slug')?.value) {
      const slug = name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      this.form.patchValue({ slug });
    }
  }

  addVariant() {
    this.variants.push(
      this.fb.group({
        id: [null],
        size: [''],
        color: ['Padrão'],
        stockQuantity: [10],
        sku: [''],
      })
    );
  }

  removeVariant(index: number) {
    this.variants.removeAt(index);
  }

  onImagesUploaded(images: UploadResult[]) {
    this.uploadedImages = images;
  }

  onImageRemoved(image: UploadResult) {
    this.uploadedImages = this.uploadedImages.filter(
      (i) => i.url !== image.url
    );
  }

  saveProduct() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);

    const formValue = this.form.value;
    const productData = {
      name: formValue.name,
      description: formValue.description,
      price: formValue.price,
      salePrice: formValue.salePrice || null,
      sku: formValue.sku || null,
      stockQuantity: formValue.stockQuantity || 0,
      featured: formValue.featured || false,
      brand: formValue.brand || null,
      material: formValue.material || null,
      categoryId: formValue.categoryId || null,
      imageUrls: this.uploadedImages.map((img) => img.url),
      variants:
        formValue.variants?.map((v: any) => ({
          size: v.size,
          color: v.color,
          colorCode: v.colorCode || null,
          sku: v.sku || null,
          stockQuantity: v.stockQuantity || 0,
          additionalPrice: v.additionalPrice || null,
        })) || [],
    };

    const request = this.isEditing
      ? this.http.put(
          `${environment.apiUrl}/products/${this.productId}`,
          productData
        )
      : this.http.post(`${environment.apiUrl}/products`, productData);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.router.navigate(['/admin/products']);
      },
      error: (err) => {
        this.saving.set(false);
        console.error('Error saving product:', err);
        alert('Erro ao salvar produto. Verifique os dados e tente novamente.');
      },
    });
  }
}
