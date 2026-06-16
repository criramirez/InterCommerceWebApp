import { Routes } from '@angular/router';
import { CatalogComponent } from './modules/catalog.component/catalog.component';
import { ProductDetail } from './modules/product-detail/product-detail';
import { ShoppingCartComponent } from './components/shopping-cart.component/shopping-cart.component';

export const routes: Routes = [
    { path: '', redirectTo: 'catalog', pathMatch: 'full' },
    { path: 'catalog', component: CatalogComponent, title: 'Catalog' },
    { path: 'shop-cart', component: ShoppingCartComponent, title: 'Shopping Cart' },
    { path: 'product/:id', component: ProductDetail, title: 'Product' }
];
