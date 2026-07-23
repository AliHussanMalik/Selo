# 💈 Selo — Salon Booking Platform

> A localized, appointment-first salon booking platform with a P2P slot resale marketplace.

---

## 🏗️ Architecture

```
selo-platform/
├── backend/          Node.js (Express 5) + PostgreSQL (Knex)
└── mobile_app/       React Native (Expo) — Phase 2
```

---

## 🚀 Backend Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 14+ (local or hosted)

### 1. Install dependencies
```bash
cd backend
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env with your DB credentials and JWT secret
```

### 3. Create the database
```sql
CREATE DATABASE selo_db;
```

### 4. Run migrations
```bash
npm run migrate
```

### 5. (Optional) Seed dev data
```bash
npm run seed
```

### 6. Start the dev server
```bash
npm run dev
# API available at http://localhost:5000
```

---

## 📡 API Reference

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Login and receive JWT |
| GET | `/api/auth/me` | 🔒 Any | Get current user profile |

### Salons
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/salons` | Public | Browse salons (filter by city, amenity) |
| POST | `/api/salons` | 🔒 salon_owner | Create a new salon |
| GET | `/api/salons/:id` | Public | Get salon detail + amenities |
| PATCH | `/api/salons/:id` | 🔒 salon_owner | Update salon info |
| GET | `/api/salons/:id/services` | Public | List salon services |
| POST | `/api/salons/:id/services` | 🔒 salon_owner | Add a service |
| GET | `/api/salons/:id/slots` | Public | Get available slots for a date |

### Bookings
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/bookings` | 🔒 customer | Create a booking |
| GET | `/api/bookings/my` | 🔒 customer | My active bookings |
| GET | `/api/bookings/:id` | 🔒 Any | Get booking detail |
| PATCH | `/api/bookings/:id/cancel` | 🔒 customer | Cancel a booking |

### Resale Marketplace
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/resale/list` | 🔒 customer | List a booking slot for resale |
| GET | `/api/resale/flash` | Public | Browse all flash resale slots |
| GET | `/api/resale/:id` | Public | Get a specific resale listing |
| POST | `/api/resale/purchase/:id` | 🔒 customer | Purchase a resale slot |
| PATCH | `/api/resale/:id/cancel` | 🔒 customer | Cancel your resale listing |

---

## 🔐 User Roles

| Role | Capabilities |
|------|-------------|
| `customer` | Browse salons, book, cancel, list for resale, purchase resale |
| `dresser` | Linked to bookings, manage availability |
| `salon_owner` | Create/manage salon, services, view all bookings |
| `admin` | Full platform access |

---

## 🗄️ Database Schema

See `backend/migrations/` for the full Knex migration files.

Tables: `users`, `salons`, `salon_amenities`, `services`, `bookings`, `slot_resale_transactions`, `reviews`

---

## 📱 Mobile App (Phase 2)

React Native (Expo) app targeting iOS and Android.

Screens: Explore → Salon Profile → Time Slot Picker → Confirmation → My Bookings → Flash Marketplace

---

## 📝 License

MIT
