import { Component, inject } from '@angular/core';
import { ShopService } from '../../core/services/shop.service';
import { ProductCardComponent } from "../product-card-component/product-card-component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shoppingcart',
  imports: [ProductCardComponent, CommonModule],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.scss',
})
export class ShoppingCartComponent {

  public shopService = inject(ShopService);

}
