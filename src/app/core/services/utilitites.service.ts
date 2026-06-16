import { inject, Injectable } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { OrderProduct, ProductFields, QuerySearchProduct } from '../models/product.entity';

@Injectable({
  providedIn: 'root',
})
export class UtilititesService {

  private router = inject(Router);
  private route = inject(ActivatedRoute);

  public updateUrl(params: Params): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: 'replace',
      replaceUrl: true,
    });
  }

  public getParams() {
    let params = this.route.snapshot.queryParams;
    let query: QuerySearchProduct = {};
    if (params['q']) query.q = params['q'];
    if (params['limit']) query.limit = Number(params['limit']);
    if (params['skip']) query.skip = Number(params['skip']);
    if (params['sortBy']) query.sortBy = params['sortBy'] as ProductFields;
    if (params['order']) query.order = params['order'] as OrderProduct;
    if (params['category']) query.category = params['category'];
    return query;
  }

}
