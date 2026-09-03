# Cartyy 

Full-stack catalogue for comparing phone variants and their database-backed EMI plans. Each variant has six plans (five at 0% interest, one at 10.5%) with monthly amount, cashback, total payable and effective cost.

## Tech stack

- **Frontend:** React 19, Vite 7, React Router 7, TanStack Query 5, Tailwind CSS 4
- **Backend:** Node.js 20+, Express 5, JavaScript (ESM)
- **Database:** PostgreSQL 15+ (Neon or Render hosted)
- **ORM:** Prisma 6
- **Deployment:** Vercel (frontend), Render (API)

## Setup and run

Prerequisites: Node.js 20+, PostgreSQL 15+, npm 10+.

```bash
# 1. Install (no root workspace — each app separately)
cd server && npm ci
cd ../client && npm ci

# 2. Configure
cp server/.env.example server/.env
cp client/.env.example client/.env
```

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

```bash
# 3. Create and seed the database
cd server
npm run db:generate
npm run db:migrate -- --name init
npm run db:seed

# 4. Run (two terminals)
cd server && npm run dev   # API on http://localhost:4000
cd client && npm run dev   # frontend on http://localhost:5173
```

## API endpoints

### `GET /api/health`

```json
{
  "status": "ok",
  "database": "connected"
}
```

### `GET /api/products`

Every product with variants and EMI plans.

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

One product, e.g. `/api/products/iphone-17-pro`. Same product shape as above. Unknown slug returns `404 { "error": { "message": "Product not found" } }`.

## Schema

`server/prisma/schema.prisma`. Relations: `Product 1 — * ProductVariant 1 — * EmiPlan`.

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Product {
  id          String           @id @default(cuid())
  name        String
  slug        String           @unique
  brand       String
  category    String           @default("Smartphones")
  description String
  highlights  String[]
  isFeatured  Boolean          @default(false)
  variants    ProductVariant[]
  createdAt   DateTime         @default(now())
  updatedAt   DateTime         @updatedAt

  @@index([brand])
}

model ProductVariant {
  id           String    @id @default(cuid())
  productId    String
  sku          String    @unique
  color        String
  colorHex     String
  storage      String
  finish       String?
  mrp          Decimal   @db.Decimal(12, 2)
  sellingPrice Decimal   @db.Decimal(12, 2)
  imageUrl     String
  stock        Int       @default(0)
  isDefault    Boolean   @default(false)
  product      Product   @relation(fields: [productId], references: [id], onDelete: Cascade)
  emiPlans     EmiPlan[]
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt

  @@index([productId])
}

model EmiPlan {
  id             String         @id @default(cuid())
  variantId      String
  tenureMonths   Int
  monthlyAmount  Decimal        @db.Decimal(12, 2)
  interestRate   Decimal        @db.Decimal(5, 2)
  cashbackAmount Decimal        @default(0) @db.Decimal(12, 2)
  totalPayable   Decimal        @db.Decimal(12, 2)
  effectiveCost  Decimal        @db.Decimal(12, 2)
  isNoCost       Boolean        @default(false)
  isRecommended  Boolean        @default(false)
  variant        ProductVariant @relation(fields: [variantId], references: [id], onDelete: Cascade)
  createdAt      DateTime       @default(now())
  updatedAt      DateTime       @updatedAt

  @@unique([variantId, tenureMonths])
  @@index([variantId])
}
```

Seed: 6 products, 34 variants, 204 EMI plans (`server/prisma/seed.js`).

Pricing: `savings = MRP − selling price`, `total payable = monthly × tenure`, `effective cost = total payable − cashback`.

## Deployment

Database: create a hosted PostgreSQL, then from `server/` run `npm run db:deploy` and `npm run db:seed` once.

Backend (Render, manual Web Service): Root Directory `server`, Build `npm ci && npx prisma generate && npx prisma migrate deploy`, Start `npm start`, Health Check `/api/health`, env `NODE_VERSION=20.18.0`, `NODE_ENV=production`, `DATABASE_URL`, `CLIENT_URL=https://<your-vercel-app>.vercel.app`.

Frontend (Vercel): project root `client`, env `VITE_API_URL=https://<your-render-service>.onrender.com/api`.
