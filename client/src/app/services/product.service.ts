import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = 'http://localhost:3000/api/products';

  constructor(private http: HttpClient) {}

  getProducts(page: number, limit: number) {
    return this.http.get<any>(
      `${this.apiUrl}?page=${page}&limit=${limit}`
    );
  }

  addProduct(data: any) {
    return this.http.post(this.apiUrl, data);
  }

  updateProduct(id: number, data: any) {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deleteProduct(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
