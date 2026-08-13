import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { Book, Order, Personalization } from './models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly base = environment.apiBase;

  constructor(private http: HttpClient) {}

  books() {
    return firstValueFrom(this.http.get<Book[]>(`${this.base}/api/books`));
  }

  book(slug: string) {
    return firstValueFrom(this.http.get<Book>(`${this.base}/api/books/${slug}`));
  }

  inspectPhoto(form: FormData) {
    return firstValueFrom(
      this.http.post<{ ok: boolean }>(`${this.base}/api/personalizations/inspect`, form),
    );
  }

  createPersonalization(form: FormData) {
    return firstValueFrom(this.http.post<Personalization>(`${this.base}/api/personalizations`, form));
  }

  personalization(id: string) {
    return firstValueFrom(this.http.get<Personalization>(`${this.base}/api/personalizations/${id}`));
  }

  personalizations(ids?: string[]) {
    if (ids?.length) {
      return firstValueFrom(
        this.http.get<Personalization[]>(`${this.base}/api/personalizations`, {
          params: { ids: ids.join(',') },
        }),
      );
    }
    return firstValueFrom(
      this.http.get<Personalization[]>(`${this.base}/api/personalizations`),
    );
  }

  pdfUrl(id: string) {
    return `${this.base}/api/personalizations/${id}/pdf`;
  }

  deletePersonalization(id: string) {
    return firstValueFrom(this.http.delete(`${this.base}/api/personalizations/${id}`));
  }

  createOrder(body: {
    customerName: string;
    phone: string;
    city: string;
    address: string;
    paymentMethod: string;
    items: { personalizationId: string }[];
  }) {
    return firstValueFrom(this.http.post<Order>(`${this.base}/api/orders`, body));
  }

  login(email: string, password: string) {
    return firstValueFrom(
      this.http.post<{ accessToken: string; user: { email: string } }>(`${this.base}/api/auth/login`, {
        email,
        password,
      }),
    );
  }

  orders() {
    return firstValueFrom(this.http.get<Order[]>(`${this.base}/api/orders`));
  }

  updateOrder(id: string, status: string) {
    return firstValueFrom(this.http.patch<Order>(`${this.base}/api/orders/${id}`, { status }));
  }
}
