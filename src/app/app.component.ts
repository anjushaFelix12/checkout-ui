import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDrawer } from '@angular/material/sidenav';
import { CartService } from './core/services/cart.service';
import { Observable } from 'rxjs';
import { OfferService } from './core/services/offer.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  @ViewChild('cartDrawer') cartDrawer!: MatDrawer;

  itemCount$: Observable<number>;
  offerCount = 0;

  constructor(
    private cartService: CartService,
    private offerService: OfferService,
    private router: Router
  ) {
    this.itemCount$ = this.cartService.itemCount$;
  }

  ngOnInit(): void {
    // Init cart — restore from localStorage or create new
    this.cartService.init().subscribe({
      error: () => this.cartService.createCart().subscribe()
    });

    // Load offer count for nav badge
    this.offerService.getActiveOffers().subscribe({
      next: offers => this.offerCount = offers.length,
      error: () => this.offerCount = 0
    });
  }

  openCart(): void  { this.cartDrawer.open();  }
  closeCart(): void { this.cartDrawer.close(); }
}
