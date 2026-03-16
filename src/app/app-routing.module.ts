import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from './features/product-list/product-list.component';
import { OffersPageComponent } from './features/offers/offers-page.component';
import { CheckoutPageComponent } from './features/checkout/checkout-page.component';


const routes: Routes = [
  { path: '',          component: ProductListComponent },
  { path: 'offers',    component: OffersPageComponent },
  { path: 'checkout',  component: CheckoutPageComponent },
  { path: '**',        redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
