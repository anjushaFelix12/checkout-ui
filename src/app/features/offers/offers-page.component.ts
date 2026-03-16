import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Offer } from '../../shared/model/offer.model';
import { OfferService } from '../../core/services/offer.service';

@Component({
  selector: 'app-offers-page',
  templateUrl: './offers-page.component.html',
  styleUrl: './offers-page.component.css'
})
export class OffersPageComponent implements OnInit {

  offers: Offer[] = [];
  loading = true;
  error = false;

  constructor(
    private offerService: OfferService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.offerService.getActiveOffers().subscribe({
      next: offers => {
        this.offers = offers;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = true;
      }
    });
  }

  getImage(code: string): string {
    return `assets/products/${code.toLocaleLowerCase()}.png`;
  }

  isExpiringSoon(validUntil: string): boolean {
    if (!validUntil) return false;
    const diff = new Date(validUntil).getTime() - Date.now();
    return diff > 0 && diff < 3 * 24 * 60 * 60 * 1000; // within 3 days
  }

  isExpired(validUntil: string): boolean {
    if (!validUntil) return false;
    return new Date(validUntil).getTime() < Date.now();
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-IE', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  }

  onShopNow(): void {
    this.router.navigate(['/']);
  }
}
