import { Injectable, inject } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  uploadBytesResumable,
  UploadTaskSnapshot,
} from 'firebase/storage';
import { environment } from '../../environments/environment';
import { Observable, from, Subject } from 'rxjs';

export interface UploadProgress {
  progress: number;
  downloadUrl?: string;
  error?: string;
}

export interface UploadResult {
  url: string;
  path: string;
  fileName: string;
}

@Injectable({
  providedIn: 'root',
})
export class ImageUploadService {
  private app = initializeApp(environment.firebase);
  private storage = getStorage(this.app);

  /**
   * Upload de uma imagem para o Firebase Storage
   * @param file Arquivo de imagem
   * @param folder Pasta de destino (products, categories, banners)
   * @param fileName Nome do arquivo (opcional, gera um UUID se não informado)
   */
  uploadImage(
    file: File,
    folder: string = 'products',
    fileName?: string
  ): Observable<UploadProgress> {
    const subject = new Subject<UploadProgress>();

    const finalFileName = fileName || this.generateFileName(file);
    const filePath = `${folder}/${finalFileName}`;
    const storageRef = ref(this.storage, filePath);

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot: UploadTaskSnapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        subject.next({ progress });
      },
      (error) => {
        subject.next({ progress: 0, error: error.message });
        subject.complete();
      },
      async () => {
        const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
        subject.next({ progress: 100, downloadUrl });
        subject.complete();
      }
    );

    return subject.asObservable();
  }

  /**
   * Upload simples sem progresso (mais rápido para imagens pequenas)
   */
  async uploadImageSimple(
    file: File,
    folder: string = 'products',
    fileName?: string
  ): Promise<UploadResult> {
    const finalFileName = fileName || this.generateFileName(file);
    const filePath = `${folder}/${finalFileName}`;
    const storageRef = ref(this.storage, filePath);

    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);

    return {
      url,
      path: filePath,
      fileName: finalFileName,
    };
  }

  /**
   * Upload de múltiplas imagens
   */
  async uploadMultipleImages(
    files: File[],
    folder: string = 'products'
  ): Promise<UploadResult[]> {
    const uploadPromises = files.map((file) =>
      this.uploadImageSimple(file, folder)
    );
    return Promise.all(uploadPromises);
  }

  /**
   * Deletar uma imagem do Storage
   * @param path Caminho completo do arquivo ou URL
   */
  async deleteImage(pathOrUrl: string): Promise<void> {
    let path = pathOrUrl;

    // Se for uma URL, extrair o path
    if (
      pathOrUrl.includes('firebasestorage.googleapis.com') ||
      pathOrUrl.includes('firebasestorage.app')
    ) {
      path = this.extractPathFromUrl(pathOrUrl);
    }

    const storageRef = ref(this.storage, path);
    await deleteObject(storageRef);
  }

  /**
   * Gera um nome único para o arquivo
   */
  private generateFileName(file: File): string {
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    return `${timestamp}-${randomStr}.${extension}`;
  }

  /**
   * Extrai o path do arquivo a partir de uma URL do Firebase Storage
   */
  private extractPathFromUrl(url: string): string {
    const decodedUrl = decodeURIComponent(url);
    const match = decodedUrl.match(/\/o\/(.+?)\?/);
    return match ? match[1] : '';
  }

  /**
   * Valida se o arquivo é uma imagem válida
   */
  validateImage(file: File): { valid: boolean; error?: string } {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Tipo de arquivo não permitido. Use JPG, PNG, GIF ou WebP.',
      };
    }

    if (file.size > maxSize) {
      return { valid: false, error: 'Arquivo muito grande. Máximo 5MB.' };
    }

    return { valid: true };
  }

  /**
   * Redimensiona uma imagem antes do upload (opcional)
   */
  async resizeImage(
    file: File,
    maxWidth: number = 1200,
    maxHeight: number = 1200,
    quality: number = 0.85
  ): Promise<File> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      img.onload = () => {
        let { width, height } = img;

        // Calcular novas dimensões mantendo proporção
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const resizedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(resizedFile);
            } else {
              reject(new Error('Erro ao redimensionar imagem'));
            }
          },
          'image/jpeg',
          quality
        );
      };

      img.onerror = () => reject(new Error('Erro ao carregar imagem'));
      img.src = URL.createObjectURL(file);
    });
  }
}
