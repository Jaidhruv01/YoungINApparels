# YoungINApparels — Editorial Luxury Clothing Storefront

> Direct-to-Consumer Luxury Fashion E-Commerce Platform built from the Radian (Axiom Themes) Developer Specification.

![YoungINApparels Campaign](frontend/public/images/campaign-hero.jpg)

---

## 1. Overview & Architecture

YoungINApparels is a luxury clothing brand storefront inspired by the **Radian Shopify Theme Store** editorial aesthetic:
- **High-Contrast Canvas**: Crisp white product surfaces contrasted with near-black (`#0A0A0A`) editorial blocks.
- **Color Identity**: Campaign crimson accents (`#B51224`), deep red (`#5D0712`), warm light neutral (`#F7F6F4`), and refined typography.
- **Custom Commerce Stack**: Decoupled React + TypeScript frontend with a high-performance FastAPI backend.

```
YoungINApparels/
├── backend/
│   ├── app/
│   │   ├── api/v1/         # Catalog, Search, Cart, Checkout, CMS, Admin, Newsletter
│   │   ├── core/           # Config & security settings
│   │   ├── db/             # SQLAlchemy models, database session, seeder
│   │   ├── schemas/        # Pydantic v2 schemas
│   │   └── main.py         # FastAPI application entry
│   ├── tests/              # Pytest test suite (7/7 passed)
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── public/images/      # Custom high-fashion photography assets
│   ├── src/
│   │   ├── components/     # Header, Footer, Marquee, StoryCircles, ProductTabs, Lookbook, CartDrawer
│   │   ├── pages/          # Home, Collection, PDP, Checkout, Confirmation, Admin, About, Contact, FAQ, Policies
│   │   ├── context/        # CartContext, CurrencyContext
│   │   ├── services/       # Typed API client
│   │   └── types/          # Domain TypeScript models
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml
├── .env.example
└── PLAN.md
```

---

## 2. Key Features

- **Pausable Announcement Marquee**: Displays threshold free shipping notices and capsule drop announcements.
- **Story Circles**: Horizontal circular collection thumbnails with smooth overflow touch scrolling.
- **Product Discovery Tabs**: Instant switching between All Collection, New Arrivals, Best Sellers, and Archive Sale.
- **Interactive Lookbook with Shoppable Hotspots**: Campaign model with pulsating pins linking to garments with instant 1-click Add to Cart popovers.
- **Faceted Collection Filters**: Filter by Category, Sizing, Colorway, Price Range, and In-Stock availability, plus multi-column responsive grid.
- **Product Detail Page (PDP)**: Multi-photo gallery, interactive zoom, live inventory alerts, size selector with disabled states, interactive Size Guide matrix, and accordions.
- **Slideout Cart Drawer**: Live free shipping progress meter (₹5,000 threshold), promo code validator (`RADIAN15`, `YOUNGIN1000`), quantity steppers, and express checkout trigger.
- **Verified Checkout & Order Creation**: Server-calculated pricing in Indian Rupees (`₹` / `INR`), automated order number generation (`YIN-XXXX`), GST tax calculation, inventory decrement transactions, and confirmation receipt.
- **Admin Management Portal**: Order fulfillment tracker, variant stock manager, promo code creator, and live homepage CMS text editor.

---

## 3. Getting Started

### Prerequisites
- Node.js 18+ & npm
- Python 3.11+
- (Optional) Docker & Docker Compose

### Running the Backend

```bash
cd backend
python3 -m pip install -r requirements.txt
python3 -m uvicorn app.main:app --reload --port 8000
```
- Interactive API Docs: `http://localhost:8000/docs`
- Health check: `http://localhost:8000/health`

### Running the Frontend

```bash
cd frontend
npm install
npm run dev
```
- Storefront will be available at `http://localhost:5173`

### Running with Docker Compose

```bash
docker-compose up --build
```

---

## 4. Running Backend Tests

```bash
PYTHONPATH=backend python3 -m pytest backend/tests/test_api.py -v
```
All 7 unit and integration tests verify catalog listings, slug lookups, search suggestions, atomic cart transactions, promo calculations, and orders.
# YoungINApparels
