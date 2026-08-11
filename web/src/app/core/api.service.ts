import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Book, Order, Personalization } from './models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  books() {
    return firstValueFrom(this.http.get<Book[]>('/api/books'));
  }

  book(slug: string) {
    return firstValueFrom(this.http.get<Book>(`/api/books/${slug}`));
  }

  createPersonalization(form: FormData) {
    return firstValueFrom(this.http.post<Personalization>('/api/personalizations', form));
  }

  personalization(id: string) {
    return firstValueFrom(this.http.get<Personalization>(`/api/personalizations/${id}`));
  }

  personalizations(ids: string[]) {
    if (!ids.length) return Promise.resolve([] as Personalization[]);
    return firstValueFrom(
      this.http.get<Personalization[]>(`/api/personalizations`, {
        params: { ids: ids.join(',') },
      }),
    );
  }

  pdfUrl(id: string) {
    return `/api/personalizations/${id}/pdf`;
  }

  createOrder(body: {
    customerName: string;
    phone: string;
    city: string;
    address: string;
    paymentMethod: string;
    items: { personalizationId: string }[];
  }) {
    return firstValueFrom(this.http.post<Order>('/api/orders', body));
  }

  login(email: string, password: string) {
    return firstValueFrom(
      this.http.post<{ accessToken: string; user: { email: string } }>('/api/auth/login', {
        email,
        password,
      }),
    );
  }

  orders() {
    return firstValueFrom(this.http.get<Order[]>('/api/orders'));
  }

  updateOrder(id: string, status: string) {
    return firstValueFrom(this.http.patch<Order>(`/api/orders/${id}`, { status }));
  }
}
