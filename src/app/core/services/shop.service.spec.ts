// shop.service.spec.ts

import { TestBed } from '@angular/core/testing';
import { ShopService } from './shop.service';
import { Product } from '../models/product.entity';
import { provideZonelessChangeDetection } from '@angular/core';

describe('ShopService - integración (agregar al carrito → ver total)', () => {
  let service: ShopService;

  let mockProduct: Product = {
    id: 1,
    title: 'Test Product',
    description: 'Test',
    category: 'test',
    price: 100,
    discountPercentage: 10,
    rating: 4.5,
    stock: 10,
    tags: [],
    brand: 'TestBrand',
    sku: 'TEST-001',
    weight: 1,
    dimensions: { width: 1, height: 1, depth: 1 },
    warrantyInformation: '',
    shippingInformation: '',
    availabilityStatus: 'In Stock',
    reviews: [],
    returnPolicy: '',
    minimumOrderQuantity: 1,
    meta: { createdAt: new Date(), updatedAt: new Date(), barcode: '', qrCode: '' },
    thumbnail: '',
    images: [],
    quantity: 0
  } as Product;

  beforeEach(() => {

    localStorage.clear();

    TestBed.configureTestingModule({

      providers: [provideZonelessChangeDetection()]

    });

    service = TestBed.inject(ShopService);

  });
  it('debe agregar un producto y reflejar el cambio en el total', () => {
    // Arrange
    expect(service.shoppingCart().length).toBe(0);
    expect(service.total()).toBe(0);

    // Act
    service.addRemmoveQuantityProduct(mockProduct, true);

    // Assert
    expect(service.shoppingCart().length).toBe(1);
    expect(service.shoppingCart()[0].quantity).toBe(1);
    // 100 * 0.9 = 90 (con 10% descuento) → 90 + 19% de impuestos = 107.10
    expect(service.subtotal()).toBeCloseTo(90, 2);
    expect(service.total_taxes()).toBeCloseTo(90 * 0.19, 2);
    expect(service.total()).toBeCloseTo(90 + (90 * 0.19), 2);
  });

  it('debe acumular cantidad al agregar el mismo producto dos veces', () => {
    service.addRemmoveQuantityProduct(mockProduct, true);
    service.addRemmoveQuantityProduct(mockProduct, true);

    expect(service.shoppingCart().length).toBe(1);
    expect(service.shoppingCart()[0].quantity).toBe(2);
  });

  it('debe persistir el carrito en localStorage', () => {
    service.addRemmoveQuantityProduct(mockProduct, true);
    const saved = localStorage.getItem('ShoppingCartMemory');
    expect(saved).toBeTruthy();
    expect(JSON.parse(saved!).length).toBe(1);
  });

  it('debe limpiar el carrito con cleanShoppingCarts', () => {
    service.addRemmoveQuantityProduct(mockProduct, true);
    expect(service.shoppingCart().length).toBe(1);

    service.cleanShoppingCarts();

    expect(service.shoppingCart().length).toBe(0);
    expect(service.total()).toBe(0);
    expect(localStorage.getItem('ShoppingCartMemory')).toBeNull();
  });

  it('debe cargar el carrito desde localStorage al iniciar', () => {
    // Arrange: pre-cargar localStorage
    const initialCart = [{ ...mockProduct, quantity: 3 }];
    localStorage.setItem('ShoppingCartMemory', JSON.stringify(initialCart));
    
    service.loadShoppingCarts();

    expect(service.shoppingCart().length).toBe(1);
    expect(service.shoppingCart()[0].quantity).toBe(3);
  });
});