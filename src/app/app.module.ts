import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

// Material
import { MatToolbarModule }         from '@angular/material/toolbar';
import { MatButtonModule }          from '@angular/material/button';
import { MatIconModule }            from '@angular/material/icon';
import { MatCardModule }            from '@angular/material/card';
import { MatSidenavModule }         from '@angular/material/sidenav';
import { MatDividerModule }         from '@angular/material/divider';
import { MatSnackBarModule }        from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatBadgeModule }           from '@angular/material/badge';
import { MatChipsModule }           from '@angular/material/chips';
import { MatMenuModule }            from '@angular/material/menu';
import { MatTooltipModule }         from '@angular/material/tooltip';

// App
import { AppRoutingModule }         from './app-routing.module';
import { AppComponent }             from './app.component';
import { ProductListComponent }     from './features/product-list/product-list.component';
import { ProductCardComponent }     from './features/product-list/product-card/product-card.component';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { OffersPageComponent } from './features/offers-page/offers-page.component';

const MATERIAL = [
  MatToolbarModule,
  MatButtonModule,
  MatIconModule,
  MatCardModule,
  MatSidenavModule,
  MatDividerModule,
  MatSnackBarModule,
  MatProgressSpinnerModule,
  MatBadgeModule,
  MatChipsModule,
  MatMenuModule,
  MatTooltipModule,
];

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    ProductCardComponent,
    OffersPageComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CommonModule,
    AppRoutingModule,
    CoreModule,
    SharedModule,
    ...MATERIAL,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
