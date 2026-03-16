# UI Architecture

This document describes the folder structure, module organisation, and architectural decisions of the Angular frontend.

---

## Architecture Pattern

The frontend follows the **Core / Shared / Features** pattern — a widely adopted Angular architecture that separates concerns cleanly and scales well as the application grows.

```
src/app/
├── core/        ← singleton services,
├── shared/      ← reusable components and models, used across features
└── features/    ← self-contained feature pages
```

Each layer has a single responsibility. Dependencies only flow **downward** — features depend on shared and core, never the reverse.

---


## `core/` — Global Singletons

The `core/` folder contains services and utilities.

### `core/services/`

| File | Responsibility |
|---|---|
| `product.service.ts` | Calls `GET /api/v1/products` — returns product list with embedded active offers |
| `cart.service.ts` | Manages all cart state and API calls. Holds the `BehaviorSubject` that drives the cart UI. Handles `localStorage` persistence of `cartId` |
| `offer.service.ts` | Calls `GET /api/v1/offers` — returns the active weekly offer list |
| `checkout.service.ts` | Calls `POST /api/v1/carts/{id}/checkout` — sends the cart for pricing and returns the receipt summary |


### `core/interceptors/`

| File | Responsibility |
|---|---|
| `error.interceptor.ts` | Catches all HTTP errors globally. Maps status codes (400, 404, 0) to user-friendly messages shown as a Material snackbar. Prevents error handling from being scattered across individual services |

### `core/core.module.ts`

Registers the `ErrorInterceptor` as an `HTTP_INTERCEPTOR` provider. Guards against being imported more than once using `@SkipSelf` in the constructor.

---

## `shared/` — Reusable Across Features

The `shared/` folder contains code that is used by **more than one feature**. 

### `shared/models/`

TypeScript interfaces that match the API response shapes exactly. All components and services use these types — no `any` types anywhere.

| File | Interfaces defined |
|---|---|
| `product.model.ts` | `Product`, `ActiveOffer` |
| `cart.model.ts` | `CartResponse`, `CartItemResponse`, `AddItemRequest`, `UpdateItemRequest` |
| `offer.model.ts` | `Offer` |
| `checkout.model.ts` | `CheckoutSummary`, `CheckoutLineItem`, `CheckoutDiscount` |

Keeping models in `shared/` means they are imported from a single location — changing a field in an API response only requires updating one file.

### `shared/components/offer-badge/`

A small presentational component that renders a green offer pill — used in both the product card and the cart item row.

```typescript
// Input — receives the offer from the parent
@Input() offer: ActiveOffer | null = null;
```

It is declared and exported from `SharedModule` so any feature can use `<app-offer-badge>` without re-declaring it.

### `shared/shared.module.ts`

Declares and exports all shared components. Imported by `AppModule` so shared components are available everywhere.

---

## `features/` — Self-Contained Pages

Each subfolder of `features/` represents one user-facing feature. A feature folder owns its own components, templates, and styles. Features communicate with the rest of the app **only through services** — never by calling each other directly.

### `features/product-list/`

Displays the product catalogue. Responsible for:
- Loading products via `ProductService` on `ngOnInit`
- Showing a loading spinner and error state
- Delegating the "Add to Cart" action to `CartService`
- Rendering product cards via the child `ProductCardComponent`

**`product-card/`** is a child component scoped to `product-list`. It is a pure presentational component — it receives a `Product` via `@Input()` and emits an `addToCart` event via `@Output()`. It contains no service calls.

### `features/cart/`

The cart slide-in drawer. Responsible for:
- Subscribing to `CartService.cart$` and rendering the item list
- Delegating quantity updates and item removal to `CartService`
- Navigating to `/checkout` when the user clicks Checkout

**`cart-item/`** is a child component scoped to `cart`. Pure presentational — receives a `CartItemResponse` via `@Input()` and emits `increment`, `decrement`, and `remove` events via `@Output()`. The parent `CartComponent` handles all service calls.

### `features/checkout/`

A full-page component with two visual states managed by a single boolean flag:

| State | Condition | What is shown |
|---|---|---|
| Review | `confirmed === false` | Order items table, offer preview, Confirm button |
| Receipt | `confirmed === true` | Itemised receipt, discounts, totals, action buttons |

On checkout it calls `CheckoutService.checkout()`, receives the `CheckoutSummary` from the backend.

### `features/offers/`

A read-only page that displays active weekly offers. Responsible for:
- Loading offers via `OfferService` on `ngOnInit`
- Rendering offer cards with deal highlights, validity dates, and ribbons
- Calculating expiry status (`isExpiringSoon`, `isExpired`) locally in the component

---

## `AppModule` — Root Module

`AppModule` is the root NgModule that wires everything together.


---

## Routing

Defined in `app-routing.module.ts`:

| Route | Component | Notes |
|---|---|---|
| `/` | `ProductListComponent` | Default route |
| `/offers` | `OffersPageComponent` | Weekly deals page |
| `/checkout` | `CheckoutPageComponent` | Redirects to `/` if cart is empty |
| `/**` | redirect → `/` | Wildcard fallback |



