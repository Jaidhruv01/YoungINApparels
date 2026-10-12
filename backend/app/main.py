import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.db.database import Base, engine, SessionLocal
from app.db.seed_data import seed_database
from app.api.v1 import catalog, search, cart, checkout, cms, admin, newsletter

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB and seed
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield

app = FastAPI(
    title="YoungINApparels API",
    description="Luxury Editorial Direct-to-Consumer Commerce API",
    version=settings.VERSION,
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files for product photography and campaign imagery
static_dir = os.path.join(os.path.dirname(__file__), "static")
if os.path.exists(static_dir):
    app.mount("/static", StaticFiles(directory=static_dir), name="static")

# Include Routers
app.include_router(catalog.router, prefix=settings.API_V1_STR, tags=["Catalog"])
app.include_router(search.router, prefix=settings.API_V1_STR, tags=["Search"])
app.include_router(cart.router, prefix=settings.API_V1_STR, tags=["Cart"])
app.include_router(checkout.router, prefix=settings.API_V1_STR, tags=["Checkout & Orders"])
app.include_router(cms.router, prefix=settings.API_V1_STR, tags=["CMS & Lookbook"])
app.include_router(admin.router, prefix=settings.API_V1_STR, tags=["Admin"])
app.include_router(newsletter.router, prefix=settings.API_V1_STR, tags=["Newsletter"])

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "YoungINApparels API",
        "version": settings.VERSION
    }

@app.get("/")
def root():
    return {
        "brand": "YoungINApparels",
        "tagline": "The Editorial Archive",
        "docs": "/docs",
        "health": "/health"
    }
