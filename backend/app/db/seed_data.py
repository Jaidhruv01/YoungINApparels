from sqlalchemy.orm import Session
from app.db.models import (
    Product, ProductVariant, ProductImage, Collection, CollectionProduct,
    Discount, LookbookHotspot, CMSContent
)

def seed_database(db: Session):
    # Check if already seeded
    if db.query(Product).count() > 0:
        return

    # 1. Collections
    c_aw26 = Collection(
        title="Autumn / Winter '26",
        slug="autumn-winter-26",
        description="Brutalist architectural silhouettes, deep crimson accents, and heavyweight outerwear for the seasonal shift.",
        image="/images/campaign-hero.jpg",
        badge="NEW DROP",
        sort_order=1
    )
    c_outerwear = Collection(
        title="Outerwear & Tailoring",
        slug="outerwear",
        description="Structured wool overcoats, MA-1 modular bombers, and tailored blazers crafted with exacting precision.",
        image="/images/product-overcoat.jpg",
        badge="ARCHIVE",
        sort_order=2
    )
    c_fleece = Collection(
        title="Heavyweight Fleece",
        slug="fleece-hoodies",
        description="500GSM French terry and custom heavyweight fleece with relaxed, drop-shoulder silhouettes.",
        image="/images/product-hoodie.jpg",
        badge="CORE",
        sort_order=3
    )
    c_denim = Collection(
        title="Japanese Selvedge Denim",
        slug="denim",
        description="14oz raw selvedge denim woven on vintage shuttle looms in Okayama, Japan. Unwashed and enduring.",
        image="/images/product-denim.jpg",
        badge="LIMITED",
        sort_order=4
    )
    c_knitwear = Collection(
        title="Knitwear & Accents",
        slug="knitwear",
        description="100% merino wool ribbing and rich crimson silks tailored for dramatic warmth.",
        image="/images/product-sweater.jpg",
        badge="PREMIUM",
        sort_order=5
    )
    c_accessories = Collection(
        title="Modular Leather Goods",
        slug="accessories",
        description="Full grain calfskin, cobra buckle hardware, and handcrafted footwear.",
        image="/images/product-bag.jpg",
        badge="ESSENTIALS",
        sort_order=6
    )

    db.add_all([c_aw26, c_outerwear, c_fleece, c_denim, c_knitwear, c_accessories])
    db.commit()

    # 2. Products (INR Pricing)
    p1 = Product(
        title="The Oversized Double-Breasted Wool Overcoat",
        slug="oversized-double-breasted-wool-overcoat",
        description="Engineered from 850GSM Italian Melton wool with a touch of cashmere. Features razor-sharp peak lapels, deep vented back, unstructured dropped shoulders, and natural horn buttons. Designed to be layered over our heavyweight knitwear.",
        short_summary="850GSM Italian Melton wool overcoat with horn buttons and dropped shoulder tailoring.",
        category="Outerwear",
        price=24999.0,
        compare_at_price=32000.0,
        details="• 850GSM 90% Virgin Wool, 10% Cashmere\n• Full cupro lining with internal welt pockets\n• Hand-finished buttonholes and peak lapels\n• Dry clean only\n• Atelier crafted in Milan",
        fabric_care="Dry clean only with hydrocarbon solvents. Cool iron with pressing cloth.",
        fit_info="Intentionally oversized boxy fit. Take your normal size for the editorial silhouette, or size down for a conventional fit. Model is 6'2\" (188cm) wearing size L.",
        is_new=True,
        is_bestseller=True,
        is_sale=True,
        is_featured=True,
        cover_image="/images/product-overcoat.jpg",
        hover_image="/images/campaign-hero.jpg"
    )

    p2 = Product(
        title="500GSM Raw-Hem Heavyweight Hoodie",
        slug="500gsm-raw-hem-heavyweight-hoodie",
        description="A masterclass in weight and silhouette. Custom-knit 500GSM ultra-dense organic cotton French terry. Garment-dyed and stone-washed for subtle vintage distressing. Features double-layered hood without drawstrings, kangaroo pocket with raw edges, and ribbed gusseting.",
        short_summary="500GSM vintage washed French terry fleece hoodie with double-layered hood.",
        category="Tops",
        price=7999.0,
        compare_at_price=9999.0,
        details="• 500GSM 100% Organic Cotton French Terry\n• Custom cold-dye pigment wash\n• Pre-shrunk and stone washed\n• Blind-stitched raw hem details\n• Crafted in Portugal",
        fabric_care="Machine wash cold inside out with like colors. Hang dry in shade. Do not tumble dry.",
        fit_info="Boxy, dropped shoulders with cropped body length. Boxy fit through chest. Model is 6'1\" (185cm) wearing size M.",
        is_new=True,
        is_bestseller=True,
        is_sale=False,
        is_featured=True,
        cover_image="/images/product-hoodie.jpg",
        hover_image="/images/lookbook-campaign.jpg"
    )

    p3 = Product(
        title="MA-1 Tactical Modular Flight Bomber",
        slug="ma1-tactical-modular-flight-bomber",
        description="A brutalist reinterpretation of military flight jackets. Heavy-duty Japanese memory nylon shell with custom crimson satin diamond-quilted lining. Heavy gauge gunmetal double-ended Riri zippers, modular snap utility pockets, and reinforced rib collar.",
        short_summary="Memory nylon flight bomber with crimson quilted lining and gunmetal Riri hardware.",
        category="Outerwear",
        price=18499.0,
        compare_at_price=None,
        details="• 100% High-Density Japanese Memory Nylon\n• Crimson 100% Cupro Quilted Lining with 120g Primaloft fill\n• Two-way custom matte gunmetal zipper\n• Exterior storm flap and utility sleeve pocket\n• Water and wind resistant finish",
        fabric_care="Wipe clean with damp cloth or professional dry clean only.",
        fit_info="Relaxed silhouette with rounded barrel sleeves. True to size.",
        is_new=True,
        is_bestseller=False,
        is_sale=False,
        is_featured=True,
        cover_image="/images/product-bomber.jpg",
        hover_image="/images/editorial-split.jpg"
    )

    p4 = Product(
        title="14oz Japanese Raw Selvedge Denim Trouser",
        slug="14oz-japanese-raw-selvedge-denim-trouser",
        description="Woven on original Toyoda Type G shuttle looms in Okayama, Japan. 14oz unwashed right-hand twill selvedge denim with pink and white ticker. Features a wide straight-leg cut, custom debossed YoungIN hardware, hidden coin pocket selvedge, and vegetable-tanned leather patch.",
        short_summary="14oz unwashed Okayama selvedge denim with wide straight leg and custom hardware.",
        category="Bottoms",
        price=11999.0,
        compare_at_price=None,
        details="• 14oz 100% Zimbabwe Long-Staple Cotton\n• Red & white selvedge ID line\n• Button fly with custom blackened brass donut buttons\n• Reinforced back pockets with hidden rivets\n• Crafted in Kojima, Okayama",
        fabric_care="Wear for 6 months before first wash. When washing, soak inside out in cold water with minimal detergent. Hang dry.",
        fit_info="High-rise with relaxed straight leg. Will stretch roughly 0.5 inches in waistband after initial break-in.",
        is_new=False,
        is_bestseller=True,
        is_sale=False,
        is_featured=True,
        cover_image="/images/product-denim.jpg",
        hover_image="/images/lookbook-campaign.jpg"
    )

    p5 = Product(
        title="Chunky Lug-Sole Italian Chelsea Boots",
        slug="chunky-lug-sole-italian-chelsea-boots",
        description="Sculpted from full-grain French calfskin with a waxed finish. Mounted onto an exaggerated Vibram commando lug sole via 360-degree Goodyear welt construction. Elastic side gussets and heavy webbing pull tabs provide effortless entry.",
        short_summary="Waxed French calfskin chelsea boots on exaggerated Vibram commando sole.",
        category="Footwear",
        price=19999.0,
        compare_at_price=24999.0,
        details="• 100% Full-grain French calf leather\n• Custom Vibram rubber lugged outsole (50mm height)\n• Hand-lasted Goodyear welt construction\n• Calfskin lining with shock-absorbing memory foam footbed\n• Handcrafted in Tuscany",
        fabric_care="Apply neutral leather balm monthly. Brush with horsehair brush after wear.",
        fit_info="True to European sizing. If between sizes, we recommend sizing down.",
        is_new=True,
        is_bestseller=True,
        is_sale=True,
        is_featured=True,
        cover_image="/images/product-boots.jpg",
        hover_image="/images/campaign-hero.jpg"
    )

    p6 = Product(
        title="Heavy Ribbed Merino Turtleneck",
        slug="heavy-ribbed-merino-turtleneck",
        description="Crafted from 100% extrafine Australian merino wool in an ultra-thick 5-gauge fisherman rib. Features a generous fold-over rollneck, saddle shoulders, and elongated cuffs. The deep crimson dye evokes the signature YoungINApparels campaign palette.",
        short_summary="5-gauge extrafine Australian merino wool fisherman rib turtleneck in rich crimson.",
        category="Tops",
        price=12499.0,
        compare_at_price=None,
        details="• 100% Extra-Fine 19.5-Micron Merino Wool\n• 5-Gauge English Rib Knit\n• Saddle shoulder construction for anatomical drape\n• Seamless circular knit body\n• Spun and knitted in Biella, Italy",
        fabric_care="Hand wash cold with wool detergent. Dry flat on towel. Never hang knitwear.",
        fit_info="Subtly relaxed fit. Fits true to size.",
        is_new=True,
        is_bestseller=False,
        is_sale=False,
        is_featured=False,
        cover_image="/images/product-sweater.jpg",
        hover_image="/images/editorial-split.jpg"
    )

    p7 = Product(
        title="Grained Calfskin Cobra Crossbody Bag",
        slug="grained-calfskin-cobra-crossbody-bag",
        description="A functional luxury accessory engineered from structured pebbled calfskin. Features an authentic AustriaAlpin Cobra quick-release buckle, waterproof matte YKK Excella zippers, internal microfiber tablet sleeve, and adjustable mil-spec nylon webbing strap.",
        short_summary="Pebbled calfskin utility messenger bag with matte gunmetal Cobra buckle.",
        category="Accessories",
        price=14299.0,
        compare_at_price=16999.0,
        details="• Full-grain pebbled calf leather\n• Genuine AustriaAlpin Cobra quick-release aluminum buckle\n• YKK Excella matte black zips\n• Magnetic rear quick-access pocket\n• Dimensions: 24cm x 18cm x 7cm",
        fabric_care="Store in supplied dustbag. Condition with leather balm.",
        fit_info="One size. Strap extends from 85cm to 145cm.",
        is_new=False,
        is_bestseller=True,
        is_sale=True,
        is_featured=False,
        cover_image="/images/product-bag.jpg",
        hover_image="/images/campaign-hero.jpg"
    )

    p8 = Product(
        title="Crimson Raw Silk Editorial Scarf",
        slug="crimson-raw-silk-editorial-scarf",
        description="100% heavy mulberry silk twill printed in deep campaign crimson with hand-rolled hems. Sized generously at 110cm x 110cm to be draped under tailored lapels or worn draped over outerwear.",
        short_summary="110cm hand-rolled Mulberry silk twill scarf in signature campaign crimson.",
        category="Accessories",
        price=5999.0,
        compare_at_price=None,
        details="• 100% 18mm Mulberry Silk Twill\n• Hand-rolled and hand-stitched edges\n• Tone-on-tone jacquard YoungIN monogram\n• Made in Como, Italy",
        fabric_care="Dry clean only. Store folded.",
        fit_info="110cm x 110cm square format.",
        is_new=True,
        is_bestseller=False,
        is_sale=False,
        is_featured=False,
        cover_image="/images/editorial-split.jpg",
        hover_image="/images/campaign-hero.jpg"
    )

    products = [p1, p2, p3, p4, p5, p6, p7, p8]
    db.add_all(products)
    db.commit()

    # 3. Product Variants
    # Overcoat variants
    for color, code in [("Midnight Black", "#0A0A0A"), ("Deep Charcoal", "#2B2B2B")]:
        for size in ["S", "M", "L", "XL"]:
            db.add(ProductVariant(
                product_id=p1.id,
                sku=f"YIN-OVC-{color[:3].upper()}-{size}",
                color=color,
                color_code=code,
                size=size,
                price=24999.0,
                compare_at_price=32000.0,
                available_quantity=15 if size != "XL" else 3
            ))

    # Hoodie variants
    for color, code in [("Washed Charcoal", "#373737"), ("Deep Onyx", "#111111"), ("Campaign Crimson", "#B51224")]:
        for size in ["XS", "S", "M", "L", "XL"]:
            db.add(ProductVariant(
                product_id=p2.id,
                sku=f"YIN-HOD-{color[:3].upper()}-{size}",
                color=color,
                color_code=code,
                size=size,
                price=7999.0,
                compare_at_price=9999.0,
                available_quantity=20 if size != "XS" else 4
            ))

    # Bomber variants
    for color, code in [("Matte Black", "#0A0A0A"), ("Olive Drab", "#3A4035")]:
        for size in ["S", "M", "L", "XL"]:
            db.add(ProductVariant(
                product_id=p3.id,
                sku=f"YIN-BMB-{color[:3].upper()}-{size}",
                color=color,
                color_code=code,
                size=size,
                price=18499.0,
                available_quantity=8
            ))

    # Denim variants
    for color, code in [("Raw Dark Indigo", "#1B2A3D")]:
        for size in ["28", "30", "32", "34", "36"]:
            db.add(ProductVariant(
                product_id=p4.id,
                sku=f"YIN-DNM-{size}",
                color=color,
                color_code=code,
                size=size,
                price=11999.0,
                available_quantity=12
            ))

    # Boots variants
    for color, code in [("Polished Nero", "#0A0A0A")]:
        for size in ["EU 40", "EU 41", "EU 42", "EU 43", "EU 44", "EU 45"]:
            db.add(ProductVariant(
                product_id=p5.id,
                sku=f"YIN-BOT-{size.replace(' ', '')}",
                color=color,
                color_code=code,
                size=size,
                price=19999.0,
                compare_at_price=24999.0,
                available_quantity=7
            ))

    # Turtleneck variants
    for color, code in [("Campaign Crimson", "#B51224"), ("Onyx Black", "#0A0A0A")]:
        for size in ["S", "M", "L", "XL"]:
            db.add(ProductVariant(
                product_id=p6.id,
                sku=f"YIN-SWT-{color[:3].upper()}-{size}",
                color=color,
                color_code=code,
                size=size,
                price=12499.0,
                available_quantity=10
            ))

    # Bag variants
    db.add(ProductVariant(
        product_id=p7.id,
        sku="YIN-BAG-BLK-OS",
        color="Matte Black",
        color_code="#0A0A0A",
        size="ONE-SIZE",
        price=14299.0,
        compare_at_price=16999.0,
        available_quantity=18
    ))

    # Scarf variants
    db.add(ProductVariant(
        product_id=p8.id,
        sku="YIN-SCF-CRM-OS",
        color="Campaign Crimson",
        color_code="#B51224",
        size="ONE-SIZE",
        price=5999.0,
        available_quantity=25
    ))

    db.commit()

    # 4. Attach Products to Collections
    collection_mappings = [
        (c_aw26, [p1, p2, p3, p4, p5, p6, p7, p8]),
        (c_outerwear, [p1, p3]),
        (c_fleece, [p2]),
        (c_denim, [p4]),
        (c_knitwear, [p6, p8]),
        (c_accessories, [p7, p8, p5])
    ]
    for coll, prods in collection_mappings:
        for idx, p in enumerate(prods):
            db.add(CollectionProduct(collection_id=coll.id, product_id=p.id, position=idx))
    db.commit()

    # 5. Lookbook Hotspots (coordinates on lookbook-campaign.jpg with INR pricing)
    h1 = LookbookHotspot(
        x_percent=49.0,
        y_percent=32.0,
        product_id=p2.id,
        title="500GSM Raw-Hem Heavyweight Hoodie",
        price=7999.0,
        tag="Upper Layer"
    )
    h2 = LookbookHotspot(
        x_percent=51.5,
        y_percent=62.0,
        product_id=p4.id,
        title="14oz Japanese Raw Selvedge Denim Trouser",
        price=11999.0,
        tag="Trousers"
    )
    h3 = LookbookHotspot(
        x_percent=45.5,
        y_percent=91.0,
        product_id=p5.id,
        title="Chunky Lug-Sole Italian Chelsea Boots",
        price=19999.0,
        tag="Footwear"
    )
    db.add_all([h1, h2, h3])
    db.commit()

    # 6. Promo Discount Codes (INR Rupee Values)
    d1 = Discount(
        code="RADIAN15",
        discount_type="percentage",
        value=15.0,
        minimum_order_value=3000.0,
        active=True
    )
    d2 = Discount(
        code="YOUNGIN1000",
        discount_type="fixed",
        value=1000.0,
        minimum_order_value=5000.0,
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

    # 7. Initial CMS Blocks
    cms_announcement = CMSContent(
        section_key="announcement",
        title="COMPLIMENTARY EXPRESS SHIPPING ON ALL ORDERS OVER ₹5,000 • AUTUMN/WINTER ARCHIVE 2026 NOW LIVE",
        meta_json={"ticker_speed": 28, "allow_pause": True}
    )
    cms_hero = CMSContent(
        section_key="hero",
        title="THE WINTER ARCHIVE",
        subtitle="Brutalist architectural silhouettes crafted in 850GSM Italian wool, 14oz Okayama raw selvedge denim, and deep campaign crimson.",
        cta_text="DISCOVER COLLECTION",
        cta_link="/collections/autumn-winter-26",
        image_url="/images/campaign-hero.jpg",
        meta_json={"season": "AW '26", "campaign_code": "RADIAN-REF-01"}
    )
    cms_editorial_split = CMSContent(
        section_key="editorial_split",
        title="UNCOMPROMISING TAILORING",
        subtitle="Structured drapery engineered for contemporary volume. Every piece is cut from ethically sourced European virgin wool and custom Japanese shuttle looms.",
        cta_text="EXPLORE THE ATELIER",
        cta_link="/about",
        image_url="/images/editorial-split.jpg",
        meta_json={"quote": "A balance between brutalist structure and sensual movement."}
    )
    cms_curated = CMSContent(
        section_key="curated_feature",
        title="CURATED CAPSULE 01",
        subtitle="The essential uniform: Oversized double-breasted overcoat, 500GSM fleece, and lugged Italian footwear.",
        cta_text="SHOP THE CAPSULE",
        cta_link="/collections/outerwear",
        image_url="/images/product-overcoat.jpg"
    )
    cms_brand_manifesto = CMSContent(
        section_key="brand_manifesto",
        title="YOUNGIN APPARELS",
        subtitle="Founded in the intersection of contemporary high fashion and industrial brutalism. Designed with timeless restraint.",
        cta_text="READ MANIFESTO",
        cta_link="/about"
    )
    db.add_all([cms_announcement, cms_hero, cms_editorial_split, cms_curated, cms_brand_manifesto])
    db.commit()
