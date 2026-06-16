import { Injectable, signal } from '@angular/core';
import { Product } from '../models/product.entity';
const SHOPPING_CARD_MEMORY = 'ShoppingCartMemory';
const TAX = 19;
@Injectable({
  providedIn: 'root',
})
export class ShopService {

  public shoppingCart = signal<Product[]>([]);
  public total = signal(0);
  public subtotal = signal(0);
  public total_taxes = signal(0);
  public total_discount = signal(0);

  constructor() {
    this.loadShoppingCarts();
    this.calculateValues();
  }

  addRemmoveQuantityProduct(item: Product, add: boolean): void {

    if (!item) return;
    let current = this.shoppingCart().find(i => i.id === item.id);
    let currentQty = current?.quantity ?? 0;
    let newQty = add ? currentQty + 1 : currentQty - 1;
    if (add && newQty > item.stock) return;
    if (!add && newQty < 0) return;
    if (newQty === 0) {
      this.removeProduct(item.id);
    } else {
      this.upsertItem({ ...item, quantity: newQty });
    }
    this.calculateValues();
    this.saveInMemory();

  }

  private upsertItem(item: Product): void {
    this.shoppingCart.update(cart => {
      let existing = cart.find(i => i.id === item.id);
      if (existing) {
        return cart.map(i => i.id === item.id ? { ...i, quantity: item.quantity } : i);
      }
      return [...cart, item];
    });

  }


  removeProduct(productId: number): void {
    this.shoppingCart.update(cart => cart.filter(i => i.id !== productId));

  }
  cleanShoppingCarts() {
    this.shoppingCart.set([]);
    this.total.set(0);
    this.subtotal.set(0);
    this.total_taxes.set(0);
    this.total_discount.set(0);
    this.cleanMemory();
  }


  calculateValues() {
    let subtotal = 0;
    let totalDiscount = 0;
    let totalTax = 0;
    let total = 0;
    this.shoppingCart().forEach((ele) => {
      let price = ele.price;
      let quantity = Math.round(ele.quantity ?? 0);
      let taxRate = (TAX / 100);
      let discount_percentage = (ele.discountPercentage / 100);

      // Subtotal del producto (sin impuestos)
      let itemSubtotal = price * quantity;

      // Descuento aplicado al producto (si es porcentaje)
      let discountValue = discount_percentage > 0 && discount_percentage < 1
        ? itemSubtotal * discount_percentage
        : discount_percentage;

      // Base gravable (subtotal - descuento)
      let taxableBase = itemSubtotal - discountValue;

      // Impuesto del producto
      let itemTax = taxableBase * (taxRate);
      subtotal += taxableBase;
      totalTax += itemTax;
      totalDiscount += discountValue;
    });
    total = subtotal + totalTax;
    this.total.set(total);
    this.subtotal.set(subtotal);
    this.total_taxes.set(totalTax);
    this.total_discount.set(totalDiscount);
  }


  saveInMemory() {
    localStorage.setItem(SHOPPING_CARD_MEMORY, JSON.stringify(this.shoppingCart()));
  }

  cleanMemory() {
    localStorage.removeItem(SHOPPING_CARD_MEMORY);
  }

  loadShoppingCarts() {
    let shoppingCartInMemory = localStorage.getItem(SHOPPING_CARD_MEMORY);
    if (shoppingCartInMemory) {
      this.shoppingCart.set(JSON.parse(shoppingCartInMemory));
    }
  }

  checkedProducts(products: Product[]) {
    this.shoppingCart().forEach(element => {
      let productAdd = products.find((ele) => { return ele.id == element.id });
      if (productAdd) {
        productAdd.quantity = element.quantity;
      }
    });
  }


}
