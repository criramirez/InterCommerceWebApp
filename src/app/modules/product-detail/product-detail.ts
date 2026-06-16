import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { ShopService } from '../../core/services/shop.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})
export class ProductDetail implements OnInit {

  private route = inject(ActivatedRoute);
  public productService = inject(ProductService);
  public shopService = inject(ShopService);
  ngOnInit(): void {
    let idProduct = parseInt(this.route.snapshot.paramMap.get('id') ?? '0');
    // idProduct = parseInt(idProduct);
    this.productService.loadProduct(idProduct);
  }

}
