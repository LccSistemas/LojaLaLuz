import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, Page } from '../models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getProducts(page = 0, size = 12): Observable<Page<Product>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<Page<Product>>(`${this.apiUrl}/products`, { params });
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`);
  }

  getProductBySlug(slug: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/slug/${slug}`);
  }

  getProductsByCategory(
    categoryId: number,
    page = 0,
    size = 12
  ): Observable<Page<Product>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<Page<Product>>(
      `${this.apiUrl}/products/category/${categoryId}`,
      { params }
    );
  }

  searchProducts(
    query: string,
    page = 0,
    size = 12
  ): Observable<Page<Product>> {
    const params = new HttpParams()
      .set('q', query)
      .set('page', page)
      .set('size', size);
    return this.http.get<Page<Product>>(`${this.apiUrl}/products/search`, {
      params,
    });
  }

  getFeaturedProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products/featured`);
  }

  getProductsOnSale(page = 0, size = 12): Observable<Page<Product>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<Page<Product>>(`${this.apiUrl}/products/sale`, {
      params,
    });
  }

  getBrands(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/products/brands`);
  }
}
