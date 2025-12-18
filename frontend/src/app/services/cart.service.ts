import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Cart, CartItem } from '../models';
import { environment } from '../../environments/environment';

interface AddToCartRequest {
  productId: number;
  variantId?: number;
  quantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly apiUrl = environment.apiUrl;

  private cartSignal = signal<Cart | null>(null);

  readonly cart = this.cartSignal.asReadonly();
  readonly cartItems = computed(() => this.cartSignal()?.items || []);
  readonly cartTotal = computed(() => this.cartSignal()?.subtotal || 0);
  readonly cartCount = computed(() => this.cartSignal()?.totalItems || 0);
  readonly isEmpty = computed(() => this.cartCount() === 0);

  constructor(private http: HttpClient) {
    this.loadCart();
  }

  loadCart(): void {
    this.http.get<Cart>(`${this.apiUrl}/cart`).subscribe({
      next: (cart) => this.cartSignal.set(cart),
      error: () =>
        this.cartSignal.set({ id: 0, items: [], subtotal: 0, totalItems: 0 }),
    });
  }

  addToCart(
    productId: number,
    quantity: number = 1,
    variantId?: number
  ): Observable<Cart> {
    const request: AddToCartRequest = { productId, quantity, variantId };
    return this.http
      .post<Cart>(`${this.apiUrl}/cart/items`, request)
      .pipe(tap((cart) => this.cartSignal.set(cart)));
  }

  // Alias for addToCart
  addItem(productId: number, quantity: number = 1, variantId?: number): Observable<Cart> {
    return this.addToCart(productId, quantity, variantId);
  }

  updateQuantity(itemId: number, quantity: number): Observable<Cart> {
    return this.http
      .patch<Cart>(
        `${this.apiUrl}/cart/items/${itemId}?quantity=${quantity}`,
        {}
      )
      .pipe(tap((cart) => this.cartSignal.set(cart)));
  }

  removeItem(itemId: number): Observable<Cart> {
    return this.http
      .delete<Cart>(`${this.apiUrl}/cart/items/${itemId}`)
      .pipe(tap((cart) => this.cartSignal.set(cart)));
  }

  clearCart(): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/cart`)
      .pipe(
        tap(() =>
          this.cartSignal.set({ id: 0, items: [], subtotal: 0, totalItems: 0 })
        )
      );
  }
}
