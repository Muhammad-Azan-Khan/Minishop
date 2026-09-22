<div align="center">
   <img src="minishop-frontend/public/favicon.svg" alt="MiniShop logo" width="150" />

  <h1>MiniShop</h1>

  <p>A full-stack e-commerce application for browsing products, managing a cart, placing orders, and administering the store catalog.</p>

  <p>
    <img src="https://img.shields.io/badge/Nuxt-4-00DC82?logo=nuxt.js&logoColor=white" alt="Nuxt 4" />
    <img src="https://img.shields.io/badge/Vue-3-4FC08D?logo=vue.js&logoColor=white" alt="Vue 3" />
    <img src="https://img.shields.io/badge/NestJS-11-E0234E?logo=nestjs&logoColor=white" alt="NestJS 11" />
    <img src="https://img.shields.io/badge/MySQL-8-4479A1?logo=mysql&logoColor=white" alt="MySQL" />
    <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  </p>
</div>

## Overview

MiniShop provides separate customer and administrator experiences in a responsive forest-and-gold interface. Customers can explore the catalog, maintain a live cart, complete a checkout form, and review their orders. Administrators can manage users, products, categories, and order statuses.

The repository contains two applications:

- `minishop-frontend` — Nuxt frontend served on `http://localhost:4000`
- `minishop-backend` — NestJS REST API served on `http://localhost:3000`

## Features

### Customer experience

- Account registration and cookie-based authentication
- Product browsing, searching, and category filtering
- Responsive product and category pages
- Add-to-cart feedback and a live navbar cart counter
- Quantity updates and item removal
- Delivery and card-detail checkout form with client-side validation
- Order placement and order-history tracking
- Profile and password management
- Desktop and mobile navigation

### Admin experience

- Role-protected admin dashboard
- Create and delete categories
- Create and delete products
- Product and category image uploads through Cloudinary
- View and remove users
- View all orders and update their statuses

### Backend

- JWT access and refresh tokens stored in HTTP-only cookies
- Role-based route guards for customer and admin resources
- Request validation with `class-validator`
- MySQL persistence through TypeORM
- Product stock updates during checkout
- Catalog seeding script with sample categories and products

## Tech stack

| Area | Technologies |
| --- | --- |
| Frontend | Nuxt 4, Vue 3, TypeScript, Pinia, Tailwind CSS |
| Validation | VeeValidate, Zod, NestJS ValidationPipe |
| UI | Lucide icons, scoped CSS, responsive animations |
| Backend | NestJS 11, TypeScript, REST |
| Database | MySQL, TypeORM |
| Authentication | Passport JWT, HTTP-only cookies, bcrypt |
| Media | Cloudinary |
| Testing | Jest, Supertest |

## Project structure

```text
minishop/
├── minishop-frontend/
│   ├── app/
│   │   ├── components/       # Shared navigation and UI components
│   │   ├── composables/      # API client and image helpers
│   │   ├── middleware/       # Authentication and role routing
│   │   ├── pages/            # Public, customer, and admin pages
│   │   ├── stores/           # Authentication and cart state
│   │   └── types/            # Frontend TypeScript models
│   └── nuxt.config.ts
│
└── minishop-backend/
    ├── scripts/              # Catalog seed script
    ├── src/
    │   ├── cloudinary/       # Image upload integration
    │   ├── entities/         # TypeORM entities
    │   ├── guards/           # JWT and role guards
    │   └── modules/          # Auth, users, products, cart, and orders
    └── test/
```

## Prerequisites

Install the following before starting:

- Node.js 20 or newer
- npm
- A MySQL-compatible database with SSL enabled
- A Cloudinary account if you want to upload product or category images

## Getting started

### 1. Install backend dependencies

```bash
cd minishop-backend
npm install
```

Create `minishop-backend/.env` with the following values:

```dotenv
# Server
PORT=3000

# MySQL
DB_HOST=your-database-host
DB_PORT=3306
DB_USERNAME=your-database-user
DB_PASSWORD=your-database-password
DB_NAME=minishop

# Authentication
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=15m
REFRESH_SECRET=replace-with-another-long-random-secret
REFRESH_EXPIRES_IN=7d

# A user registered with this email receives the ADMIN role
ADMIN_EMAIL=admin@example.com

# Cloudinary image uploads
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

> The current TypeORM configuration enables schema synchronization and verifies database TLS certificates. Use a database connection that supports SSL.

Start the API:

```bash
npm run start:dev
```

The backend will be available at `http://localhost:3000`.

### 2. Seed the catalog (optional)

With the backend environment configured, populate the database with sample categories and products:

```bash
cd minishop-backend
npm run seed:catalog
```

The seed is safe to run more than once: it checks for existing catalog entries before creating them.

### 3. Install frontend dependencies

Open another terminal:

```bash
cd minishop-frontend
npm install
npm run dev
```

Open `http://localhost:4000` in your browser. The frontend is configured to call the API at `http://localhost:3000`.

### 4. Create an admin account (optional)

Set `ADMIN_EMAIL` in the backend environment, restart the backend, and register through the application using that exact email address. Other registrations receive the `USER` role.

## Available scripts

### Frontend

Run these commands from `minishop-frontend`:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Nuxt development server |
| `npm run build` | Create a production build |
| `npm run preview` | Preview the production build locally |
| `npm run generate` | Generate a static Nuxt output |

### Backend

Run these commands from `minishop-backend`:

| Command | Purpose |
| --- | --- |
| `npm run start:dev` | Start the API in watch mode |
| `npm run build` | Compile the NestJS application |
| `npm run start:prod` | Run the compiled application |
| `npm run seed:catalog` | Seed sample catalog data |
| `npm run lint` | Run ESLint with automatic fixes |
| `npm test` | Run unit tests |
| `npm run test:e2e` | Run end-to-end tests |
| `npm run test:cov` | Generate a test coverage report |

## API overview

| Resource | Base route | Access |
| --- | --- | --- |
| Authentication | `/auth` | Public and authenticated |
| Products | `/products` | Public read; admin write |
| Categories | `/categories` | Public read; admin write |
| Cart | `/cart` | Authenticated customers |
| Orders | `/orders` | Authenticated customers and admins |
| Users | `/users` | Authenticated; admin management |

Authentication requests use credentials-enabled cookies. The frontend and backend must therefore use compatible origins and CORS settings.

## Order and checkout flow

1. A customer adds products to the cart.
2. The shared cart store updates the navbar quantity badge.
3. The customer reviews quantities on the cart page.
4. Checkout collects delivery and card-form details and validates them in the browser.
5. Placing the order creates an order, records purchase prices, reduces stock, and clears the cart.
6. The new order appears on the customer orders page and in the admin order dashboard.

> **Payment note:** MiniShop currently does not integrate a payment gateway. Card-form values are not sent to or stored by the backend. Connect a PCI-compliant payment provider such as Stripe before accepting real payments.

## Production notes

Before deploying the application, update the development-oriented settings:

- Use environment-based frontend API and backend CORS origins.
- Serve both applications over HTTPS.
- Set authentication cookies to `secure: true` in production.
- Disable TypeORM `synchronize` and use database migrations.
- Store secrets only in the deployment platform's secret manager.
- Configure a production-ready password recovery flow.
- Add rate limiting, security headers, and request logging.
- Integrate a real payment provider if checkout will charge customers.

## License

No license has been added to this repository yet.
