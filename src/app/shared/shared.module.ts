import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { OfferBadgeComponent } from './components/offer-badge/offer-badge.component';

@NgModule({
  declarations: [OfferBadgeComponent],
  imports: [
    CommonModule,
    MatIconModule,
    MatChipsModule
  ],
  exports: [OfferBadgeComponent]
})
export class SharedModule {}
