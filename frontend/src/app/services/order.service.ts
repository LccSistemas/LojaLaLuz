import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, Page, Address, PaymentMethod } from '../models';
import { environment } from '../../environments/environment';

interface CreateOrderRequest {
  shippingAddress: Address;
  paymentMethod: PaymentMethod;
  notes?: string;
}

export interface GuestOrderRequest {
  guestEmail: string;
  guestName: string;
  guestPhone?: string;
  shippingAddress: Address;
  paymentMethod: PaymentMethod;
  items: {
    productId: number;
    variantId?: number;
    quantity: number;
  }[];
  notes?: string;
}

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getMyOrders(page = 0, size = 10): Observable<Page<Order>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<Page<Order>>(`${this.apiUrl}/orders`, { params });
  }

  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/orders/${id}`);
  }

  getOrderByNumber(orderNumber: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/orders/number/${orderNumber}`);
  }

  createOrder(request: CreateOrderRequest): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}/orders`, request);
  }

  // Guest Checkout - creates order without user account
  createGuestOrder(request: GuestOrderRequest): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}/orders/guest`, request);
  }

  // Get order by number and email (for guest users)
  getGuestOrder(orderNumber: string, email: string): Observable<Order> {
    const params = new HttpParams().set('email', email);
    return this.http.get<Order>(`${this.apiUrl}/orders/guest/${orderNumber}`, {
      params,
    });
  }
}
