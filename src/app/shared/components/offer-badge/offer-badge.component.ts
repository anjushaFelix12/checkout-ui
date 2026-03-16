import { Component, Input } from '@angular/core';
import { ActiveOffer } from '../../model/product.model';

@Component({
  selector: 'app-offer-badge',
  templateUrl: './offer-badge.component.html',
  styleUrls: ['./offer-badge.component.css']
})
export class OfferBadgeComponent {
  @Input() offer: ActiveOffer | null = null;
}
