import { AfterViewInit, Component, effect, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ProductService } from '../../core/services/product.service';
import { UtilititesService } from '../../core/services/utilitites.service';
import { ProductCardComponent } from "../../components/product-card-component/product-card-component";

@Component({
  selector: 'app-catalog.component',
  imports: [ProductCardComponent],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss',
})
export class CatalogComponent implements OnInit, AfterViewInit, OnDestroy {

  public productService = inject(ProductService);
  public utilities = inject(UtilititesService);
  public skeletonArray = this.productService.limit();
  @ViewChild('scrollSentinel') sentinel!: ElementRef;
  @ViewChild('inputF') inputFilter!: ElementRef;
  private observer!: IntersectionObserver;

  ngOnInit(): void {
    this.productService.loadCategories();
    this.productService.productQuery = this.utilities.getParams();
    this.productService.loadProducts();    
  }

  ngAfterViewInit(): void {
    (this.inputFilter.nativeElement as HTMLInputElement).value = this.productService.productQuery.q ?? '';
    this.observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        this.productService.loadMore();
      }
    }, { rootMargin: '200px' }); // carga 200px antes de llegar
    if (this.sentinel) {
      this.observer.observe(this.sentinel.nativeElement);
    }
  }
  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  filterProductsText() {
    // let input = event.currentTarget as HTMLInputElement;
    this.productService.searchProductText((this.inputFilter.nativeElement as HTMLInputElement).value);
  }

  selCategory(category: string) {
    this.productService.searchProductCategory(category);
  }

}
