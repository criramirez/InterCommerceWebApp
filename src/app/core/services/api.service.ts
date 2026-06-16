import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { Product, Products, QuerySearchProduct } from '../models/product.entity';
import { Category } from '../models/category.entity';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);
  private head = new HttpHeaders({ "Content-Type": "application/json" });
  private endPoints = {
    product: {
      products: '/products',
      categories: '/products/categories',
      productByCategory: '/products/category'
    }
  }

  public getProduct(idProduct: number): Observable<Product> {
    return this.http.get<Product>(`${environment.apiUrl + this.endPoints.product.products}/${idProduct}`, { headers: this.head });
  }

  public getProducts(query: QuerySearchProduct): Observable<Products> {
    let params = new HttpParams();
    let url = `${environment.apiUrl + this.endPoints.product.products}`;
    if (query.q) {
      params = params.set('q', query.q);
      url = `${url}/search`;
    }

    if (query.limit !== undefined) params = params.set('limit', String(query.limit));

    if (query.skip !== undefined) params = params.set('skip', String(query.skip));

    if (query.sortBy) params = params.set('sortBy', query.sortBy);

    if (query.order) params = params.set('order', query.order);

    if (query.select?.length) params = params.set('select', query.select.join(','));

    return this.http.get<Products>(url, { params: params, headers: this.head });
  }

  public getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${environment.apiUrl + this.endPoints.product.categories}`, { headers: this.head });
  }

  public getProductByCategory(category: string): Observable<Products> {
    return this.http.get<Products>(`${environment.apiUrl + this.endPoints.product.productByCategory}/${category}`, { headers: this.head });
  }

}
