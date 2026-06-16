import { effect, inject, Injectable, signal } from '@angular/core';
import { ApiService } from './api.service';
import { Product, Products, QuerySearchProduct } from '../models/product.entity';
import { Category } from '../models/category.entity';
import { UtilititesService } from './utilitites.service';
import { Params } from '@angular/router';
import { ShopService } from './shop.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {

  private api = inject(ApiService);
  private utilities = inject(UtilititesService);
  public shopService = inject(ShopService);
  public productsStore = signal<Products | null>(null);
  public productsList = signal<Product[]>([]);
  public total = signal<number>(0);
  public skip = signal<number>(0);
  public limit = signal<number>(12);
  public loadingMore = signal<boolean>(false);
  public productStore = signal<Product | null>(null);
  public categoriesStore = signal<Category[]>([]);
  public loadingProducts = signal<boolean>(false);
  public loadingProduct = signal<boolean>(false);
  public loadingCategories = signal<boolean>(false);
  public errorProducts = signal<string | null>(null);
  public errorProduct = signal<string | null>(null);
  public errorCategories = signal<string | null>(null);
  public productQuery: QuerySearchProduct = {};


  constructor() {
    effect(() => {
      let cart = this.shopService.shoppingCart();
      let cartMap = new Map(cart.map(item => [item.id, item.quantity]));
      this.productsList.update(list =>
        list.map(p => ({
          ...p,
          quantity: cartMap.get(p.id) ?? 0
        }))
      );
      let current = this.productStore();
      if (current) {
        let cartQty = cartMap.get(current.id) ?? 0;
        if (current.quantity !== cartQty) {
          this.productStore.set({ ...current, quantity: cartQty });
        }
      }

    });
  }


  public loadProduct(idProduct: number) {
    this.productStore.set(null);
    this.loadingProduct.set(true);
    this.errorProduct.set(null);
    this.api.getProduct(idProduct).subscribe({
      next: (req) => {
        req.finalPrice = (req.price) - (req.price * (req.discountPercentage / 100));
        this.productStore.set(req);
        this.loadingProduct.set(false);
        let productToCheck: Product[] = [];
        productToCheck.push(this.productStore() as Product);
        this.shopService.checkedProducts(productToCheck);
      },
      error: (error) => {
        this.errorProduct.set('Error cargando producto.');
        this.loadingProduct.set(false);
      }
    });
  }
  public loadProducts() {
    this.loadingProducts.set(true);
    this.loadingMore.set(true);
    this.errorProducts.set(null);
    // this.skip.set(this.productQuery.skip ?? 0);
    this.productsList.set([]);
    // this.limit.set(this.productQuery.limit ?? 30);

    this.api.getProducts(this.productQuery).subscribe({
      next: (res) => {
        if (this.productQuery.category) {
          let products = res.products.filter((ele) => { return ele.category == this.productQuery.category });
          this.productsList.set(products);
        } else {
          this.productsList.set(res.products);
        }
        this.productsList().map((product) => {
          product.finalPrice = (product.price) - (product.price * (product.discountPercentage / 100));
        });
        this.shopService.checkedProducts(this.productsList());
        this.total.set(res.total);
        this.skip.set(res.skip + res.products.length);
        this.loadingProducts.set(false);
        this.loadingMore.set(false);
      },
      error: () => {
        this.errorProducts.set('Error cargando productos.');
        this.loadingProducts.set(false);
        this.loadingMore.set(false);
      }
    });
  }

  // public loadProducts(query: QuerySearchProduct = {}) {
  //   this.loadingProducts.set(true);
  //   this.productsStore.set(null);
  //   this.errorProducts.set(null);
  //   this.api.getProducts(query).subscribe({
  //     next: (req) => {
  //       this.productsStore.set(req);
  //       this.loadingProducts.set(false);
  //     },
  //     error: (error) => {
  //       this.errorProducts.set('Error cargando productos.');
  //       this.loadingProducts.set(false);
  //     }
  //   })
  // }

  public loadCategories() {
    this.categoriesStore.set([]);
    this.loadingCategories.set(true);
    this.errorCategories.set(null);
    this.api.getCategories().subscribe({
      next: (req) => {
        this.categoriesStore.set(req);
        this.loadingCategories.set(false);
      },
      error: (error) => {
        this.errorCategories.set('Error cargando categorias.');
        this.loadingCategories.set(false);
      }
    })
  }

  public loadProductByCategory(category: string) {
    this.productsStore.set(null);
    this.loadingProducts.set(true);
    this.errorProducts.set(null);
    this.api.getProductByCategory(category).subscribe({
      next: (req) => {
        this.productsStore.set(req);
        this.loadingProducts.set(false);
      },
      error: (error) => {
        this.errorProducts.set('Error cargando productos.');
        this.loadingProducts.set(false);
      }
    })
  }

  // En product.service.ts
  public loadMore() {
    // Guardas
    if (this.loadingMore() || this.loadingProducts() || this.skip() >= this.total()) return;

    this.loadingMore.set(true);

    let query = { ...this.productQuery };
    query.limit = this.limit();
    query.skip = this.skip();

    this.productQuery.limit = (this.limit() + this.skip());
    this.productQuery.skip = 0;

    this.utilities.updateUrl(this.productQuery as Params);

    this.api.getProducts(query).subscribe({
      next: (res) => {
        res.products.map((product) => {
          product.finalPrice = (product.price) - (product.price * (product.discountPercentage / 100));
        });
        this.productsList.update(current => [...current, ...res.products]);
        this.shopService.checkedProducts(this.productsList());
        this.skip.set(this.skip() + res.products.length);
        this.total.set(res.total);
        this.loadingMore.set(false);
      },
      error: () => {
        this.errorProducts.set('Error cargando más productos.');
        this.loadingMore.set(false);
      }
    });
  }

  searchProductText(text: string) {
    if (text == '') {
      // this.productQuery.q = undefined;
      delete this.productQuery['q'];
      this.loadProducts();
      this.utilities.updateUrl(this.productQuery);
    } else {
      if (this.productQuery.q) {
        if (this.productQuery.q != text) {
          this.productQuery.q = text;
          this.loadProducts();
          this.utilities.updateUrl(this.productQuery);
        }
      } else {
        this.productQuery.q = text;
        this.loadProducts();
        this.utilities.updateUrl(this.productQuery);
      }
    }

  }

  searchProductCategory(category: string) {
    if (category == '') {
      delete this.productQuery['category'];
      this.productQuery.limit = 30;
    } else {
      this.productQuery.category = category;
      this.productQuery.limit = 0;
    }
    this.loadProducts();
    this.utilities.updateUrl(this.productQuery);
  }

}
