from sqlalchemy.orm import Session
from app.db.models import (
    Product, ProductVariant, ProductImage, Collection, CollectionProduct,
    Discount, LookbookHotspot, CMSContent
)

def seed_database(db: Session):
    # Check if already seeded
    if db.query(Product).count() > 0:
        return

    # 1. Gymwear Collections
    c_tank_tops = Collection(
        title="Tank Tops",
        slug="tank-tops",
        description="Raw-cut drop-armhole muscle tanks and athletic scoop tanks designed for maximum upper-body mobility and physique accentuation.",
        image="/images/product-hoodie.jpg",
        badge="MOBILITY",
        sort_order=1
    )
    c_basic_compressions = Collection(
        title="Basic Compressions",
        slug="basic-compressions",
        description="Four-way stretch base layer compression tees and shorts engineered for everyday high-rep workouts and conditioning.",
        image="/images/product-sweater.jpg",
        badge="CORE",
        sort_order=2
    )
    c_premium_compressions = Collection(
        title="Premium Compressions",
        slug="premium-compressions",
        description="High-tensile graduated compression garments engineered with flatlock anti-chafing seams and muscle stabilization zones.",
        image="/images/product-bomber.jpg",
        badge="PRO ARMOR",
        sort_order=3
    )
    c_ribbed_vests = Collection(
        title="Ribbed Vests",
        slug="ribbed-vests",
        description="2x2 heavy stretch rib combed cotton training vests sculpted to accentuate chest, back, and lat lines.",
        image="/images/editorial-split.jpg",
        badge="PHYSIQUE",
        sort_order=4
    )
    c_270gsm = Collection(
        title="270 GSM Lowers",
        slug="270gsm-lowers",
        description="Breathable lightweight loopback French terry lowers designed for agility, cardio days, and Indian training climates.",
        image="/images/product-denim.jpg",
        badge="270 GSM",
        sort_order=5
    )
    c_350gsm = Collection(
        title="350 GSM Lowers",
        slug="350gsm-lowers",
        description="Ultra-heavyweight structured fleece gym lowers built for brutal leg days and powerlifting workouts.",
        image="/images/product-overcoat.jpg",
        badge="350 GSM HEAVY",
        sort_order=6
    )
    c_compressions = Collection(
        title="Compressions",
        slug="compressions",
        description="Complete compression tier system: Basic 4-way stretch foundation and Pro-Armor graduated compression tops.",
        image="/images/product-bomber.jpg",
        badge="2 TIERS",
        sort_order=7
    )
    c_bottoms = Collection(
        title="Bottoms",
        slug="bottoms",
        description="Heavyweight GSM series: 270GSM lightweight daily lowers and 350GSM structured fleece powerlifting lowers.",
        image="/images/product-overcoat.jpg",
        badge="GSM SERIES",
        sort_order=8
    )
    c_aw26 = Collection(
        title="Strength Series '26",
        slug="autumn-winter-26",
        description="High-performance Indian gymwear & strength apparel engineered for peak athletic output.",
        image="/images/campaign-hero.jpg",
        badge="NEW DROP",
        sort_order=9
    )

    db.add_all([c_tank_tops, c_basic_compressions, c_premium_compressions, c_ribbed_vests, c_270gsm, c_350gsm, c_compressions, c_bottoms, c_aw26])
    db.commit()

    # 2. Gymwear Products (INR Pricing)
    p1 = Product(
        title="350GSM Ultra-Heavyweight Structured Gym Lower",
        slug="350gsm-ultra-heavyweight-gym-lower",
        description="Custom-milled 350GSM ultra-dense organic French terry cotton engineered for heavy leg days and powerlifting. Features reinforced knee gussets, deep zip utility phone pockets, and thick heavy-duty drawstrings.",
        short_summary="350GSM heavyweight structured fleece gym lower with zip pockets and tapered ankle cuffs.",
        category="Bottoms",
        price=3499.0,
        compare_at_price=4499.0,
        details="• 350GSM Dense Organic Combed Cotton Terry\n• Deep concealed anti-slip phone zip pockets\n• Reinforced inner-thigh stretch paneling\n• Heavy 1.5-inch ribbed waistband with brass-tipped cords\n• Engineered and knitted in India",
        fabric_care="Machine wash cold inside out. Hang dry to maintain 350GSM fleece density. Do not bleach.",
        fit_info="Athletic taper. Generous quad and glute room tapering into snug ribbed ankle cuffs.",
        is_new=True,
        is_bestseller=True,
        is_sale=True,
        is_featured=True,
        cover_image="/images/product-overcoat.jpg",
        hover_image="/images/campaign-hero.jpg"
    )

    p2 = Product(
        title="Pro-Armor Seamless Premium Compression Shirt",
        slug="pro-armor-premium-compression-shirt",
        description="High-tensile graduated compression top designed to accelerate blood flow and stabilize deltoid and pectoral muscles during maximal output. Built with ergonomic body-mapped mesh ventilation and anti-chafing flatlock seams.",
        short_summary="High-tensile graduated compression top with body-mapped ventilation zones.",
        category="Compressions",
        price=2499.0,
        compare_at_price=2999.0,
        details="• 82% Technical Nylon, 18% Elastane High-Tension Weave\n• Graduated muscle stabilization zones\n• Flatlock 4-needle 6-thread zero-chafe stitching\n• Antimicrobial and sweat-wicking dry-touch finish\n• Made in India",
        fabric_care="Gentle cycle cold. Line dry in shade. Avoid iron directly on compression fibers.",
        fit_info="True second-skin compression. Locks down firmly to the torso and arms.",
        is_new=True,
        is_bestseller=True,
        is_sale=False,
        is_featured=True,
        cover_image="/images/product-hoodie.jpg",
        hover_image="/images/lookbook-campaign.jpg"
    )

    p3 = Product(
        title="Core Four-Way Stretch Basic Compression Tee",
        slug="core-stretch-basic-compression-tee",
        description="The everyday workout foundation. Lightweight, ultra-flexible four-way stretch compression that offers supportive contouring without restrictive tightness. Engineered for high-rep pump sessions and daily cardio.",
        short_summary="Essential four-way stretch moisture-wicking basic compression training tee.",
        category="Compressions",
        price=1599.0,
        compare_at_price=1999.0,
        details="• 88% Poly-Elastane Hydrophilic Microfiber\n• Four-way multi-directional stretch recovery\n• Ultra-breathable underarm laser cut vents\n• Reflective YoungIN logo on rear neck\n• Made in India",
        fabric_care="Quick cold wash. Dries in under 30 minutes.",
        fit_info="Fitted athletic compression cut.",
        is_new=False,
        is_bestseller=True,
        is_sale=True,
        is_featured=True,
        cover_image="/images/product-sweater.jpg",
        hover_image="/images/editorial-split.jpg"
    )

    p4 = Product(
        title="Artisanal Heavy-Ribbed Athletic Training Vest",
        slug="heavy-ribbed-athletic-training-vest",
        description="Constructed from premium 2x2 cotton rib with 5% Lycra recovery. Features deep cut armholes, reinforced bound neckline, and a contoured physique cut that accentuates back width and chest fullness.",
        short_summary="2x2 heavy cotton-stretch ribbed training vest tailored to accentuate physique lines.",
        category="Ribbed Vests",
        price=1399.0,
        compare_at_price=1799.0,
        details="• 95% Organic Cotton, 5% Lycra 2x2 Heavy Rib\n• Bound scoop neck and deep armholes\n• Physique-accentuating silhouette that holds shape wash after wash\n• Pre-shrunk with enzyme wash\n• Crafted in India",
        fabric_care="Cold wash. Dry flat or tumble low.",
        fit_info="Snug athletic fit through the chest with a natural drape at the waist.",
        is_new=True,
        is_bestseller=True,
        is_sale=False,
        is_featured=True,
        cover_image="/images/product-bomber.jpg",
        hover_image="/images/lookbook-campaign.jpg"
    )

    p5 = Product(
        title="Raw-Edge Drop-Armhole Muscle Tank Top",
        slug="raw-edge-muscle-tank-top",
        description="Ultra-lightweight 220GSM combed jersey cotton muscle tank with dropped raw-cut armholes for full lat spread visibility and zero shoulder resistance during heavy pressing and pull days.",
        short_summary="Raw-cut drop-armhole 220GSM combed jersey tank built for lifters.",
        category="Tank Tops",
        price=1499.0,
        compare_at_price=1899.0,
        details="• 220GSM 100% Combed Compact Jersey Cotton\n• Dropped deep armhole cut\n• Screenprinted tonal YoungIN emblem on chest\n• Pre-washed for zero post-wash shrinkage\n• Made in India",
        fabric_care="Machine wash cold. Tumble dry delicate.",
        fit_info="Relaxed athletic fit with maximum chest and lat exposure.",
        is_new=True,
        is_bestseller=False,
        is_sale=False,
        is_featured=False,
        cover_image="/images/product-denim.jpg",
        hover_image="/images/campaign-hero.jpg"
    )

    p6 = Product(
        title="270GSM Breathable Daily Training Lower",
        slug="270gsm-breathable-daily-training-lower",
        description="Medium-weight 270GSM loopback cotton French terry lowers built for agility drills, running, and warm Indian gym climates. Features zippered side pockets and flexible stretch ankle cuffs.",
        short_summary="270GSM lightweight breathable French terry daily gym lower.",
        category="Bottoms",
        price=2799.0,
        compare_at_price=3299.0,
        details="• 270GSM Breathable Loopback Terry Cotton\n• Quick-access phone pocket with YKK zip\n• Elastic waistband with external drawcord\n• Ribbed calf taper that stays in place\n• Crafted in India",
        fabric_care="Machine wash cold with similar darks.",
        fit_info="Streamlined athletic taper.",
        is_new=False,
        is_bestseller=True,
        is_sale=False,
        is_featured=True,
        cover_image="/images/product-boots.jpg",
        hover_image="/images/editorial-split.jpg"
    )

    p7 = Product(
        title="350GSM Stealth Powerlifting Heavy Lower",
        slug="350gsm-stealth-powerlifting-lower",
        description="Heavyweight 350GSM cotton lower finished in deep campaign crimson with double-stitched barbell abrasion guards on the shins. Engineered to survive chalk, knurling friction, and heavy lifting sessions.",
        short_summary="350GSM heavy powerlifting lower with shin knurling guards in campaign crimson.",
        category="Bottoms",
        price=3699.0,
        compare_at_price=4699.0,
        details="• 350GSM Ultra-Dense Combed Cotton Fleece\n• Shin knurling abrasion-resistant paneling\n• Heavy 2-inch waistband with flat braided cords\n• Deep zip storage pockets\n• Engineered in India",
        fabric_care="Machine wash cold inside out. Hang dry only.",
        fit_info="Generous squat fit through thighs with clean taper at ankle.",
        is_new=True,
        is_bestseller=True,
        is_sale=True,
        is_featured=False,
        cover_image="/images/product-bag.jpg",
        hover_image="/images/campaign-hero.jpg"
    )

    p8 = Product(
        title="Pro-Armor Thermal Long-Sleeve Compression Rashguard",
        slug="pro-armor-thermal-long-sleeve-compression",
        description="Long-sleeve performance armor offering full forearm and upper torso compression support. Breathable underarm mesh inserts keep skin dry through the hardest sets.",
        short_summary="Long-sleeve high-tension compression rashguard with thermal regulation.",
        category="Compressions",
        price=2899.0,
        compare_at_price=None,
        details="• High-tension four-way technical compression weave\n• Ergonomic thumbhole cuffs for zero ride-up\n• UV protective and anti-odor treated\n• Built in India",
        fabric_care="Cold gentle wash. Dries quickly.",
        fit_info="Second skin compression.",
        is_new=False,
        is_bestseller=False,
        is_sale=False,
        is_featured=False,
        cover_image="/images/product-hoodie.jpg",
        hover_image="/images/product-sweater.jpg"
    )

    products = [p1, p2, p3, p4, p5, p6, p7, p8]
    db.add_all(products)
    db.commit()

    # 3. Product Variants
    # p1 (350GSM Lower)
    for color, code in [("Midnight Black", "#0A0A0A"), ("Heather Charcoal", "#2B2B2B")]:
        for size in ["S", "M", "L", "XL"]:
            db.add(ProductVariant(
                product_id=p1.id,
                sku=f"YIN-350-{color[:3].upper()}-{size}",
                color=color,
                color_code=code,
                size=size,
                price=3499.0,
                compare_at_price=4499.0,
                available_quantity=20 if size != "XL" else 8
            ))

    # p2 (Pro-Armor Compression)
    for color, code in [("Carbon Black", "#1A1A1A"), ("Stealth Grey", "#333333")]:
        for size in ["S", "M", "L", "XL"]:
            db.add(ProductVariant(
                product_id=p2.id,
                sku=f"YIN-CMP-PRM-{color[:3].upper()}-{size}",
                color=color,
                color_code=code,
                size=size,
                price=2499.0,
                compare_at_price=2999.0,
                available_quantity=18
            ))

    # p3 (Basic Compression)
    for color, code in [("Washed Charcoal", "#2B2B2B"), ("True Black", "#0A0A0A")]:
        for size in ["S", "M", "L", "XL"]:
            db.add(ProductVariant(
                product_id=p3.id,
                sku=f"YIN-CMP-BSC-{color[:3].upper()}-{size}",
                color=color,
                color_code=code,
                size=size,
                price=1599.0,
                compare_at_price=1999.0,
                available_quantity=25
            ))

    # p4 (Ribbed Vest)
    for color, code in [("Raw Chalk White", "#F5F5F0"), ("Pitch Black", "#0A0A0A")]:
        for size in ["S", "M", "L", "XL"]:
            db.add(ProductVariant(
                product_id=p4.id,
                sku=f"YIN-RIB-{color[:3].upper()}-{size}",
                color=color,
                color_code=code,
                size=size,
                price=1399.0,
                compare_at_price=1799.0,
                available_quantity=22
            ))

    # p5 (Muscle Tank)
    for color, code in [("Deep Crimson", "#B51224"), ("Midnight Black", "#0A0A0A")]:
        for size in ["S", "M", "L", "XL"]:
            db.add(ProductVariant(
                product_id=p5.id,
                sku=f"YIN-TNK-{color[:3].upper()}-{size}",
                color=color,
                color_code=code,
                size=size,
                price=1499.0,
                compare_at_price=1899.0,
                available_quantity=15
            ))

    # p6 (270GSM Lower)
    for color, code in [("Graphite Grey", "#222222"), ("Navy Shadow", "#151B26")]:
        for size in ["S", "M", "L", "XL"]:
            db.add(ProductVariant(
                product_id=p6.id,
                sku=f"YIN-270-{color[:3].upper()}-{size}",
                color=color,
                color_code=code,
                size=size,
                price=2799.0,
                compare_at_price=3299.0,
                available_quantity=18
            ))

    # p7 (350GSM Powerlifting)
    for color, code in [("Campaign Crimson", "#B51224"), ("Matte Black", "#0A0A0A")]:
        for size in ["S", "M", "L", "XL"]:
            db.add(ProductVariant(
                product_id=p7.id,
                sku=f"YIN-PWR-350-{color[:3].upper()}-{size}",
                color=color,
                color_code=code,
                size=size,
                price=3699.0,
                compare_at_price=4699.0,
                available_quantity=12
            ))

    # p8 (Long-Sleeve Rashguard)
    db.add(ProductVariant(
        product_id=p8.id,
        sku="YIN-CMP-LS-M",
        color="Midnight Black",
        color_code="#0A0A0A",
        size="M",
        price=2899.0,
        available_quantity=25
    ))

    db.commit()

    # 4. Attach Products to Collections
    collection_mappings = [
        (c_tank_tops, [p5]),
        (c_basic_compressions, [p3]),
        (c_premium_compressions, [p2, p8]),
        (c_ribbed_vests, [p4]),
        (c_270gsm, [p6]),
        (c_350gsm, [p1, p7]),
        (c_compressions, [p2, p3, p8]),
        (c_bottoms, [p1, p6, p7]),
        (c_aw26, [p1, p2, p3, p4, p5, p6, p7, p8])
    ]
    for coll, prods in collection_mappings:
        for idx, p in enumerate(prods):
            db.add(CollectionProduct(collection_id=coll.id, product_id=p.id, position=idx))
    db.commit()

    # 5. Lookbook Hotspots
    h1 = LookbookHotspot(
        x_percent=49.0,
        y_percent=32.0,
        product_id=p2.id,
        title="Pro-Armor Seamless Premium Compression Shirt",
        price=2499.0,
        tag="Upper Compression"
    )
    h2 = LookbookHotspot(
        x_percent=51.5,
        y_percent=62.0,
        product_id=p1.id,
        title="350GSM Ultra-Heavyweight Structured Gym Lower",
        price=3499.0,
        tag="Heavy Lower"
    )
    h3 = LookbookHotspot(
        x_percent=45.5,
        y_percent=91.0,
        product_id=p6.id,
        title="270GSM Breathable Daily Training Lower",
        price=2799.0,
        tag="Daily Training"
    )
    db.add_all([h1, h2, h3])
    db.commit()

    # 6. Promo Discount Codes (INR Rupee Values)
    d1 = Discount(
        code="RADIAN15",
        discount_type="percentage",
        value=15.0,
        minimum_order_value=2000.0,
        active=True
    )
    d2 = Discount(
        code="YOUNGIN500",
        discount_type="fixed",
        value=500.0,
        minimum_order_value=2500.0,
        active=True
    )
    d3 = Discount(
        code="FIRST10",
        discount_type="percentage",
        value=10.0,
        minimum_order_value=0.0,
        active=True
    )
    db.add_all([d1, d2, d3])
    db.commit()

    # 7. Initial CMS Blocks (Gymwear & India focused)
    cms_announcement = CMSContent(
        section_key="announcement",
        title="FREE PAN-INDIA EXPRESS SHIPPING ON ORDERS OVER ₹1,999 • USE CODE: FIRST10 FOR 10% OFF • 350GSM HEAVYWEIGHT LOWERS & MULTI-TIER COMPRESSIONS LIVE • HIGH-PERFORMANCE GYMWEAR CRAFTED IN INDIA • 7-DAY EASY SIZE SWAP",
        meta_json={"ticker_speed": 28, "allow_pause": True}
    )
    cms_hero = CMSContent(
        section_key="hero",
        title="BUILT FOR STRENGTH",
        subtitle="Heavyweight 350GSM lowers, four-way stretch compressions, and sculpted ribbed vests engineered in India for peak physical discipline.",
        cta_text="EXPLORE 350GSM LOWERS",
        cta_link="/collections/350gsm-lowers",
        image_url="/images/campaign-hero.jpg",
        meta_json={"season": "STRENGTH '26", "campaign_code": "YOUNGIN-PRO-01"}
    )
    cms_editorial_split = CMSContent(
        section_key="editorial_split",
        title="UNCOMPROMISING FABRIC WEIGHT",
        subtitle="Every lower is crafted from custom-knit 350GSM and 270GSM dense cotton terry that holds its shape through hundreds of heavy squat sessions and washes.",
        cta_text="EXPLORE LOWERS",
        cta_link="/collections/350gsm-lowers",
        image_url="/images/editorial-split.jpg",
        meta_json={"quote": "Discipline in training requires discipline in craft."}
    )
    cms_curated = CMSContent(
        section_key="curated_feature",
        title="THE STRENGTH UNIFORM",
        subtitle="Pro-Armor compression base layer paired with 350GSM heavy lowers and raw-cut muscle tank.",
        cta_text="SHOP COMPRESSIONS",
        cta_link="/collections/premium-compressions",
        image_url="/images/product-overcoat.jpg"
    )
    cms_brand_manifesto = CMSContent(
        section_key="brand_manifesto",
        title="YOUNG IN",
        subtitle="High-performance gymwear and strength apparel engineered in India with zero compromise.",
        cta_text="OUR MANIFESTO",
        cta_link="/about"
    )
    db.add_all([cms_announcement, cms_hero, cms_editorial_split, cms_curated, cms_brand_manifesto])
    db.commit()
