# Supermarket Checkout UI

Angular frontend for the Supermarket Checkout System.
This application provides a user interface for interacting with the backend REST API.

## Features include:

- Product catalog browsing

- Viewing weekly offers

- Creating and managing a shopping cart

- Adding, updating, and removing items from the cart

- Checkout price calculation with bundle offers applied


## How to run

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
ng serve
```

## Angular will run at:

http://localhost:4200

---

## How to Run Tests

```bash
ng test
```

---

## How to Build for Production

```bash
ng build --configuration production
# Output → dist/checkout-ui/
```

---


## Proxy Configuration

`proxy.conf.json` forwards all `/api` requests to the backend in development:

```json
{
  "/api": {
    "target": "http://localhost:8080",
    "secure": false,
    "changeOrigin": true
  }
}
```
## Documentation

Project documentation is available in the `docs/` directory:

- [Architecture](docs/architecture.md) — Backend architecture and module structure
