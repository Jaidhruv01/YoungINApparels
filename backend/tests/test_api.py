import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.db.database import Base, engine, SessionLocal
from app.db.seed_data import seed_database

@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "YoungINApparels API"

def test_list_products():
    response = client.get("/api/v1/products")
    assert response.status_code == 200
    products = response.json()
    assert len(products) >= 6
    assert "slug" in products[0]
    assert "price" in products[0]

def test_get_product_by_slug():
    response = client.get("/api/v1/products/500gsm-raw-hem-heavyweight-hoodie")
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "500GSM Raw-Hem Heavyweight Hoodie"
    assert len(data["variants"]) > 0

def test_collections():
    response = client.get("/api/v1/collections")
    assert response.status_code == 200
    collections = response.json()
    assert len(collections) > 0

    # Get specific collection
    coll_resp = client.get("/api/v1/collections/autumn-winter-26")
    assert coll_resp.status_code == 200
    assert len(coll_resp.json()["products"]) > 0

def test_search():
    response = client.get("/api/v1/search?q=hoodie")
    assert response.status_code == 200
    data = response.json()
    assert data["count"] >= 1

    sugg_resp = client.get("/api/v1/search/suggestions?q=coat")
    assert sugg_resp.status_code == 200
    assert len(sugg_resp.json()["suggestions"]) > 0

def test_cart_and_quote_flow():
    session_id = "test-session-suite-1"
    # Get products to find a variant
    p_resp = client.get("/api/v1/products/500gsm-raw-hem-heavyweight-hoodie")
    variant_id = next(v["id"] for v in p_resp.json()["variants"] if v["available_quantity"] > 0)

    # 1. Add to cart
    add_resp = client.post("/api/v1/cart/items", json={
        "session_id": session_id,
        "variant_id": variant_id,
        "quantity": 1
    })
    assert add_resp.status_code == 200
    cart = add_resp.json()
    assert cart["item_count"] == 1
    assert len(cart["items"]) == 1

    # 2. Get checkout quote
    quote_resp = client.post("/api/v1/checkout/quote", json={
        "items": [{"variant_id": variant_id, "quantity": 1}],
        "shipping_method": "standard",
        "discount_code": "RADIAN15"
    })
    assert quote_resp.status_code == 200
    quote = quote_resp.json()
    assert quote["discount"] > 0
    assert quote["total"] > 0

    # 3. Create order
    order_resp = client.post("/api/v1/orders", json={
        "session_id": session_id,
        "email": "testbuyer@youngin.com",
        "first_name": "Alexander",
        "last_name": "Vance",
        "phone": "+1 555-019-2831",
        "address1": "742 Evergreen Terrace",
        "city": "New York",
        "state": "NY",
        "postal_code": "10001",
        "shipping_method": "standard",
        "payment_method": "credit_card",
        "discount_code": "RADIAN15",
        "items": [{"variant_id": variant_id, "quantity": 1}]
    })
    assert order_resp.status_code == 200
    order_data = order_resp.json()
    assert order_data["order_number"].startswith("YIN-")
    assert order_data["status"] == "confirmed"

    # 4. Verify order lookup
    lookup_resp = client.get(f"/api/v1/orders/{order_data['order_number']}")
    assert lookup_resp.status_code == 200
    assert lookup_resp.json()["order_number"] == order_data["order_number"]

def test_cms_and_lookbook():
    cms_resp = client.get("/api/v1/cms/homepage")
    assert cms_resp.status_code == 200
    assert "announcement" in cms_resp.json()
    assert "hero" in cms_resp.json()

    lb_resp = client.get("/api/v1/lookbook")
    assert lb_resp.status_code == 200
    assert len(lb_resp.json()["hotspots"]) >= 3
