# Cartyy — product EMI comparison

Cartyy is a full-stack product catalogue for comparing phone variants and their database-backed EMI plans. Every variant owns six distinct plans: five no-cost options and one longer interest-bearing option. The interface makes monthly payment, cashback, total payable, and effective cost visible before a user proceeds.

## Tech stack

- **Frontend:** React 19, JavaScript, Vite, React Router, TanStack Query and CSS
- **Backend:** Node.js, Express 5 and JavaScript
- **Database:** PostgreSQL 17
- **ORM:** Prisma 6
- **Deployment:** Vercel (frontend), Render (API), Neon or Render PostgreSQL

## Features

- Six seeded phones with manufacturer-confirmed finishes and two storage choices
- Unique product URLs such as `/products/iphone-17-pro`
- Variant-specific pricing, inventory, images, savings and EMI plans
- Official manufacturer image URLs stored in PostgreSQL rather than frontend constants
- Six EMI options per variant, including five at 0% interest
- Plan-specific cashback, total payable and effective cost
- Responsive catalogue and product pages
- Loading, empty, error, not-found and confirmation states
- Keyboard-visible focus states and reduced-motion support
- PostgreSQL health endpoint

## Project structure

```text
.
├── client/                 React application
│   ├── src/components/     Shared interface components
│   ├── src/pages/          Catalogue and product routes
│   └── src/lib/            API client and formatting utilities
└── server/                 Express API
    ├── prisma/             Schema, migrations and seed data
    └── src/                Routes, configuration and database client
```

## Database schema

```text
Product 1 ─────── * ProductVariant 1 ─────── * EmiPlan
```

### Product

Stores the shared name, slug, brand, description and highlights.

### ProductVariant

Stores SKU, colour, storage, finish, MRP, selling price, image URL, inventory and the default selection. Each variant belongs to one product.

### EmiPlan

Stores tenure, monthly amount, interest rate, cashback, total payable, effective cost, no-cost status and recommendation status. Each EMI plan belongs to exactly one variant. The database prevents duplicate tenures on the same variant.

## Local setup

### Prerequisites

- Node.js 20 or newer
- PostgreSQL 15 or newer
- npm 10 or newer

### 1. Install dependencies

No root workspace. Install each app separately:

```bash
cd server
npm ci
cd ../client
npm ci
```

### 2. Configure the API

Copy `server/.env.example` to `server/.env` and update the PostgreSQL connection string.
Copy `client/.env.example` to `client/.env` for local frontend config.

```env
# server/.env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/cartyy_store?schema=public"
PORT=4000
CLIENT_URL=http://localhost:5173
```

```env
# client/.env
VITE_API_URL=http://localhost:4000/api
```

`*.env` is gitignored. Only `*.env.example` is committed.

### 3. Create and seed the database

Create a PostgreSQL database named `cartyy_store`, then run from `server/`:

```bash
cd server
npm run db:generate
npm run db:migrate -- --name init
npm run db:seed
```

The seed creates 6 products, 34 colour/storage variants and 204 EMI plans.

### 4. Start both applications

Run in two terminals:

```bash
# terminal 1 - API on http://localhost:4000
cd server
npm run dev

# terminal 2 - frontend on http://localhost:5173
cd client
npm run dev
```

## Scripts

Run from the listed folder (`server/` or `client/`).

| Command | Run from | Purpose |
| ------- | -------- | ------- |
| `npm run dev` | `server/` | Start Express with watch |
| `npm run dev` | `client/` | Start Vite dev server |
| `npm run start` | `server/` | Start Express (production) |
| `npm run build` | `client/` | Build frontend for Vercel |
| `npm run check` | `server/`, `client/` | Syntax-check project JavaScript |
| `npm run db:generate` | `server/` | Generate the Prisma client |
| `npm run db:migrate -- --name <name>` | `server/` | Create and apply a migration (local only) |
| `npm run db:deploy` | `server/` | Apply committed migrations to hosted DB |
| `npm run db:seed` | `server/` | Reset and seed catalogue data (run once per DB) |

## API endpoints

### `GET /api/health`

Checks that the API can reach PostgreSQL.

```json
{
  "status": "ok",
  "database": "connected"
}
```

### `GET /api/products`

Returns every product with its variants and related EMI plans.

```json
{
  "data": [
    {
      "id": "product-id",
      "name": "iPhone 17 Pro",
      "slug": "iphone-17-pro",
      "brand": "Apple",
      "variants": [
        {
          "storage": "256 GB",
          "color": "Silver",
          "mrp": 134900,
          "sellingPrice": 127400,
          "emiPlans": [
            {
              "tenureMonths": 12,
              "monthlyAmount": 10617,
              "interestRate": 0,
              "cashbackAmount": 7000,
              "totalPayable": 127404,
              "effectiveCost": 120404,
              "isNoCost": true,
              "isRecommended": true
            }
          ]
        }
      ]
    }
  ]
}
```

### `GET /api/products/:slug`

Returns one product and all related variants and plans. Returns `404` when the slug is unknown.

```text
GET /api/products/iphone-17-pro
```

## Pricing definitions

```text
Instant savings = MRP - selling price
Total payable   = monthly amount × tenure
Effective cost  = total payable - cashback
```

Cashback is intentionally not subtracted from the displayed monthly payment because it is a later benefit, not an upfront EMI reduction.

## Deployment

### Database

1. Create a PostgreSQL database on Neon, Render or another provider.
2. Set `DATABASE_URL` in the backend environment.
3. From `server/` run once against that database:

```bash
npm run db:deploy
npm run db:seed
```

Do not run `db:seed` on every deploy — it resets the managed products.

### Backend on Render (manual Web Service, no render.yaml)

Create **New → Web Service** manually:

- **Root Directory:** `server`
- **Build Command:** `npm ci && npx prisma generate && npx prisma migrate deploy`
- **Start Command:** `npm start`
- **Health Check Path:** `/api/health`
- **Environment:**
  ```env
  NODE_VERSION=20.18.0
  NODE_ENV=production
  DATABASE_URL=postgresql://<hosted-db-url>
  CLIENT_URL=https://<your-vercel-app>.vercel.app
  ```

`PORT` is provided by Render and picked up automatically.

### Frontend on Vercel

Use `client` as the project root and set:

```env
VITE_API_URL=https://your-render-service.onrender.com/api
```

The included `client/vercel.json` preserves React Router URLs during refreshes.

## Demo video checklist

For the required 2–5 minute recording:

1. Show the catalogue and open two different product URLs.
2. Switch variants and point out that prices and EMI plans change.
3. Compare a 0% plan with the 10.5% plan.
4. Show cashback, total payable and effective cost.
5. Complete the plan-confirmation interaction.
6. Show the Express routes and Prisma schema.
7. Open PostgreSQL and show the product, variant and EMI-plan records.
8. Finish with the deployed link and GitHub repository.

## Assignment deliverables

- [ ] Public GitHub repository
- [ ] Public deployed frontend
- [ ] Deployed backend connected to PostgreSQL
- [ ] README with setup, endpoints, stack and schema
- [ ] 2–5 minute public demo video
- [ ] Submission form completed
