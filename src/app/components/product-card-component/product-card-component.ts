import { Component, inject, Input } from '@angular/core';
import { Product } from '../../core/models/product.entity';
import { RouterLink } from '@angular/router';
import { ShopService } from '../../core/services/shop.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-card-component',
  imports: [RouterLink, CommonModule],
  templateUrl: './product-card-component.html',
  styleUrl: './product-card-component.scss',
})
export class ProductCardComponent {

  @Input() product!: Product;
  @Input() shoppingVersion: boolean = false;
  public shopService = inject(ShopService);

}
