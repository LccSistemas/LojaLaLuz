import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ImageUploadService,
  UploadResult,
} from '../../services/image-upload.service';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-4">
      <!-- Área de Drop -->
      <div
        class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center transition-colors"
        [class.border-primary]="isDragging()"
        [class.bg-nude-light]="isDragging()"
        (dragover)="onDragOver($event)"
        (dragleave)="onDragLeave($event)"
        (drop)="onDrop($event)"
      >
        <input
          type="file"
          [accept]="acceptedTypes"
          [multiple]="multiple"
          class="hidden"
          #fileInput
          (change)="onFileSelected($event)"
        />

        <div class="space-y-2">
          <svg
            class="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <div class="text-sm text-gray-600">
            <button
              type="button"
              class="font-medium text-primary hover:text-primary/80"
              (click)="fileInput.click()"
            >
              Clique para enviar
            </button>
            <span> ou arraste e solte</span>
          </div>
          <p class="text-xs text-gray-500">
            PNG, JPG, GIF ou WebP até {{ maxSizeMB }}MB
          </p>
        </div>
      </div>

      <!-- Preview das Imagens -->
      @if (uploadedImages().length > 0) {
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        @for (image of uploadedImages(); track image.url) {
        <div class="relative group">
          <img
            [src]="image.url"
            [alt]="image.fileName"
            class="w-full h-32 object-cover rounded-lg"
          />
          <button
            type="button"
            class="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            (click)="removeImage(image)"
          >
            <svg
              class="w-4 h-4"
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
          </button>
        </div>
        }
      </div>
      }

      <!-- Uploads em Progresso -->
      @if (uploadingFiles().length > 0) {
      <div class="space-y-2">
        @for (upload of uploadingFiles(); track upload.name) {
        <div class="bg-gray-100 rounded-lg p-3">
          <div class="flex items-center justify-between mb-1">
            <span class="text-sm text-gray-600 truncate">{{
              upload.name
            }}</span>
            <span class="text-sm text-gray-500">{{ upload.progress }}%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div
              class="bg-primary h-2 rounded-full transition-all duration-300"
              [style.width.%]="upload.progress"
            ></div>
          </div>
        </div>
        }
      </div>
      }

      <!-- Erro -->
      @if (error()) {
      <div class="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
        {{ error() }}
      </div>
      }
    </div>
  `,
})
export class ImageUploadComponent {
  @Input() folder: string = 'products';
  @Input() multiple: boolean = true;
  @Input() maxSizeMB: number = 5;
  @Input() maxFiles: number = 10;
  @Input() resizeImages: boolean = true;
  @Input() acceptedTypes: string = 'image/jpeg,image/png,image/gif,image/webp';

  @Output() imagesUploaded = new EventEmitter<UploadResult[]>();
  @Output() imageRemoved = new EventEmitter<UploadResult>();

  isDragging = signal(false);
  uploadedImages = signal<UploadResult[]>([]);
  uploadingFiles = signal<{ name: string; progress: number }[]>([]);
  error = signal<string | null>(null);

  constructor(private imageUploadService: ImageUploadService) {}

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);

    const files = event.dataTransfer?.files;
    if (files) {
      this.handleFiles(Array.from(files));
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.handleFiles(Array.from(input.files));
      input.value = ''; // Reset input
    }
  }

  async handleFiles(files: File[]): Promise<void> {
    this.error.set(null);

    // Verificar limite de arquivos
    const currentCount = this.uploadedImages().length;
    if (currentCount + files.length > this.maxFiles) {
      this.error.set(`Máximo de ${this.maxFiles} imagens permitido.`);
      return;
    }

    // Validar e processar cada arquivo
    for (const file of files) {
      const validation = this.imageUploadService.validateImage(file);
      if (!validation.valid) {
        this.error.set(validation.error || 'Arquivo inválido');
        continue;
      }

      // Adicionar ao array de uploads em progresso
      const uploadingList = [
        ...this.uploadingFiles(),
        { name: file.name, progress: 0 },
      ];
      this.uploadingFiles.set(uploadingList);

      try {
        // Redimensionar se necessário
        let fileToUpload = file;
        if (this.resizeImages) {
          fileToUpload = await this.imageUploadService.resizeImage(file);
        }

        // Fazer upload com progresso
        this.imageUploadService
          .uploadImage(fileToUpload, this.folder)
          .subscribe({
            next: (progress) => {
              // Atualizar progresso
              const updated = this.uploadingFiles().map((f) =>
                f.name === file.name ? { ...f, progress: progress.progress } : f
              );
              this.uploadingFiles.set(updated);

              // Se completou, adicionar à lista de imagens
              if (progress.downloadUrl) {
                const result: UploadResult = {
                  url: progress.downloadUrl,
                  path: `${this.folder}/${file.name}`,
                  fileName: file.name,
                };

                const newImages = [...this.uploadedImages(), result];
                this.uploadedImages.set(newImages);
                this.imagesUploaded.emit(newImages);

                // Remover do array de uploads em progresso
                const remaining = this.uploadingFiles().filter(
                  (f) => f.name !== file.name
                );
                this.uploadingFiles.set(remaining);
              }
            },
            error: (err) => {
              this.error.set(`Erro ao enviar ${file.name}: ${err.message}`);
              const remaining = this.uploadingFiles().filter(
                (f) => f.name !== file.name
              );
              this.uploadingFiles.set(remaining);
            },
          });
      } catch (err: any) {
        this.error.set(`Erro ao processar ${file.name}: ${err.message}`);
        const remaining = this.uploadingFiles().filter(
          (f) => f.name !== file.name
        );
        this.uploadingFiles.set(remaining);
      }
    }
  }

  async removeImage(image: UploadResult): Promise<void> {
    try {
      await this.imageUploadService.deleteImage(image.path);
      const remaining = this.uploadedImages().filter(
        (i) => i.url !== image.url
      );
      this.uploadedImages.set(remaining);
      this.imageRemoved.emit(image);
    } catch (err: any) {
      this.error.set(`Erro ao remover imagem: ${err.message}`);
    }
  }

  // Método para definir imagens iniciais (edição)
  setInitialImages(images: UploadResult[]): void {
    this.uploadedImages.set(images);
  }

  // Método para limpar todas as imagens
  clearAll(): void {
    this.uploadedImages.set([]);
    this.uploadingFiles.set([]);
    this.error.set(null);
  }
}
