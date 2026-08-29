-- ==============================================================================
-- Mirai Mart — Seed Data Migration
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. CATEGORIES & SUBCATEGORIES
-- ------------------------------------------------------------------------------
-- Parent Categories
INSERT INTO public.categories (id, name, slug, description, image_url, icon_name, display_order, is_active)
VALUES
    ('c1111111-1111-1111-1111-111111111111', 'Gift Combos', 'gift-combos', 'Curated ready-to-gift surprise sets, celebration hampers and developmental bundles.', 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop', 'Gift', 1, TRUE),
    ('c2222222-2222-2222-2222-222222222222', 'Educational Toys', 'educational-toys', 'Montessori, STEM kits, sensory puzzles, and brain-stimulating toys for growing minds.', 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=800&auto=format&fit=crop', 'GraduationCap', 2, TRUE),
    ('c3333333-3333-3333-3333-333333333333', 'Cars & Vehicles', 'cars-vehicles', 'Diecast models, RC stunt racers, magnetic speedsters, and wooden train networks.', 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?q=80&w=800&auto=format&fit=crop', 'Car', 3, TRUE),
    ('c4444444-4444-4444-4444-444444444444', 'Unique Toys', 'unique-toys', 'Whimsical kinetic art, optical illusions, magnetic marble runs, and sensory balance sets.', 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?q=80&w=800&auto=format&fit=crop', 'Sparkles', 4, TRUE),
    ('c5555555-5555-5555-5555-555555555555', 'Home Decor', 'home-decor', 'Playful ambient lamps, whimsical nursery mobiles, organizers, and cozy aesthetic accents.', 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800&auto=format&fit=crop', 'Home', 5, TRUE),
    ('c6666666-6666-6666-6666-666666666666', 'Digital Gadgets', 'digital-gadgets', 'Interactive smart toys, kids coding companions, starry projectors, and STEM electronics.', 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop', 'Cpu', 6, TRUE)
ON CONFLICT (slug) DO UPDATE 
SET name = EXCLUDED.name, description = EXCLUDED.description, image_url = EXCLUDED.image_url, is_active = EXCLUDED.is_active;

-- Subcategories under Gift Combos
INSERT INTO public.categories (id, name, slug, description, image_url, icon_name, display_order, parent_id, is_active)
VALUES
    ('c1111111-1111-1111-1111-111111111112', 'Newborn Babies', 'newborn-babies', 'Gentle organic rattles, silicone teether sets, and sensory nursery keepsakes.', 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=800&auto=format&fit=crop', 'Baby', 1, 'c1111111-1111-1111-1111-111111111111', TRUE),
    ('c1111111-1111-1111-1111-111111111113', 'Birthday Celebrations', 'birthday-babies', 'All-in-one party surprise packs, customized STEM bundles, and celebratory sets.', 'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=800&auto=format&fit=crop', 'Cake', 2, 'c1111111-1111-1111-1111-111111111111', TRUE),
    ('c1111111-1111-1111-1111-111111111114', 'Home Decor Gifts', 'home-decor-gifts', 'Warm ambient nightlights, aesthetic desktop sculptures, and wooden perpetual calendars.', 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800&auto=format&fit=crop', 'Lamp', 3, 'c1111111-1111-1111-1111-111111111111', TRUE),
    ('c1111111-1111-1111-1111-111111111115', 'Gadget Bundles', 'gadget-bundles', 'Multi-device smart exploration kits, micro robotic sets, and interactive sound generators.', 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop', 'Bot', 4, 'c1111111-1111-1111-1111-111111111111', TRUE)
ON CONFLICT (slug) DO UPDATE 
SET name = EXCLUDED.name, description = EXCLUDED.description, parent_id = EXCLUDED.parent_id;

-- ------------------------------------------------------------------------------
-- 2. PRODUCTS
-- ------------------------------------------------------------------------------
INSERT INTO public.products (id, category_id, title, slug, description, curator_notes, age_range, specs, badge, is_active, is_featured)
VALUES
    (
        'a1111111-1111-1111-1111-111111111111',
        'c2222222-2222-2222-2222-222222222222',
        'Montessori Wooden Geometry Sorting Board',
        'montessori-wooden-geometry-sorting-board',
        'Handcrafted from sustainable European beechwood, this sorting board fosters spatial reasoning, color recognition, and fine motor coordination in toddlers.',
        'We love how the velvety non-toxic water-based finish feels in little hands. A timeless centerpiece for any Montessori play space.',
        '1-3',
        '{"material": "Natural Beechwood & Non-Toxic Pigments", "dimensions": "28 x 18 x 6 cm", "weight": "620g", "safety_cert": "EN71 & ASTM F963 Certified"}'::jsonb,
        'Bestseller',
        TRUE,
        TRUE
    ),
    (
        'a2222222-2222-2222-2222-222222222222',
        'c6666666-6666-6666-6666-666666666666',
        'Astronaut Star Galaxy Planetarium Projector',
        'astronaut-star-galaxy-planetarium-projector',
        'High-definition galaxy light projector with magnetic 360° rotating head, custom nebula color flows, and soothing white noise presets.',
        'Projects crystal-clear constellations across ceilings up to 300 sq ft. The magnetic astronaut head articulates smoothly to aim anywhere in the room.',
        '3-5',
        '{"power": "USB-C 5V/2A", "lighting": "Laser + RGB LED", "coverage": "Up to 300 sq. ft.", "timer": "45 min / 90 min auto-shutoff", "remote": "Included 2.4GHz"}'::jsonb,
        '-20%',
        TRUE,
        TRUE
    ),
    (
        'a3333333-3333-3333-3333-333333333333',
        'c3333333-3333-3333-3333-333333333333',
        'Magnetic Aero Speedster Vehicle Kit',
        'magnetic-aero-speedster-vehicle-kit',
        'Interchangeable modular vehicle set with neodymium magnetic chassis, aerodynamic spoiler snap-ons, and whisper-quiet rubberized wheels.',
        'Endless build variations allow young engineers to experiment with center-of-gravity and drag physics through hands-on play.',
        '3-5',
        '{"magnets": "Encapsulated Neodymium N52", "materials": "ABS Shatter-Proof Polymer", "parts_count": "24 Modular Elements", "wheels": "Soft-Grip Silent Silicone"}'::jsonb,
        'New',
        TRUE,
        TRUE
    ),
    (
        'a4444444-4444-4444-4444-444444444444',
        'c4444444-4444-4444-4444-444444444444',
        'Kinetic Orbit Desktop Balance Sculpture',
        'kinetic-orbit-desktop-balance-sculpture',
        'Perpetual-motion inspired desktop kinetic sculpture machined from anodized aerospace aluminum and high-precision ceramic ball bearings.',
        'An entrancing visual stress-reliever for creative desks and modern living rooms. Spins smoothly for minutes with a single gentle nudge.',
        '8+',
        '{"material": "Aerospace-grade Anodized Aluminum 6061", "bearing": "Si3N4 Ceramic Hybrid", "spin_time": "Up to 8 minutes", "base": "Weighted Anti-Slip Silicone"}'::jsonb,
        'Exclusive',
        TRUE,
        TRUE
    ),
    (
        'a5555555-5555-5555-5555-555555555555',
        'c1111111-1111-1111-1111-111111111111',
        'Deluxe Newborn Organic Milestone Gift Hamper',
        'deluxe-newborn-organic-milestone-gift-hamper',
        'Complete celebratory baby gift set presented in a reusable keepsake woven cotton basket, including organic cotton swaddles, crochet rattle, and milestone wood disks.',
        'Curated with zero plastics and hypoallergenic materials. Packaged in an artisanal cotton hamper with a custom hand-lettered greeting card.',
        '0-1',
        '{"contents": "1x Organic Cotton Swaddle, 1x Handmade Crochet Bunny Rattle, 12x Month Milestone Cards, 1x Soft Boar Bristle Brush", "packaging": "Handwoven Cotton Rope Basket"}'::jsonb,
        'Bestseller',
        TRUE,
        TRUE
    ),
    (
        'a6666666-6666-6666-6666-666666666666',
        'c5555555-5555-5555-5555-555555555555',
        'Nordic Minimalist Mushroom Bedside Glow Lamp',
        'nordic-minimalist-mushroom-bedside-glow-lamp',
        'Soft dimmable ambient glow lamp with touch-capacitive base, warm 2700K LED glow, and 18-hour rechargeable lithium-ion battery life.',
        'The soft-touch frosted acrylic shade diffuses warm light evenly without harsh glare — ideal for peaceful nursery nights and reading corners.',
        'all',
        '{"battery": "2600mAh Li-Ion (18 hours runtime)", "charging": "Type-C Fast Charge", "dimming": "3-Level Capacitive Touch Step-Less", "color_temp": "2700K Warm Honey"}'::jsonb,
        '-15%',
        TRUE,
        TRUE
    )
ON CONFLICT (slug) DO UPDATE 
SET title = EXCLUDED.title, description = EXCLUDED.description, curator_notes = EXCLUDED.curator_notes, specs = EXCLUDED.specs;

-- ------------------------------------------------------------------------------
-- 3. PRODUCT VARIANTS (With Bangladeshi Taka ৳ Pricing)
-- ------------------------------------------------------------------------------
INSERT INTO public.product_variants (id, product_id, sku, title, price, compare_at_price, cost_price, stock_quantity, attributes, images, is_default)
VALUES
    -- Montessori Board Variants
    (
        'b1111111-1111-1111-1111-111111111111',
        'a1111111-1111-1111-1111-111111111111',
        'MONT-SORT-NAT',
        'Natural Wood - 4-Column Classic',
        1450.00,
        1850.00,
        750.00,
        45,
        '{"color": "Natural Beech", "edition": "Classic"}'::jsonb,
        '["https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=1200&auto=format&fit=crop", "https://images.unsplash.com/photo-1587654780291-39c9404d746b?q=80&w=1200&auto=format&fit=crop", "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=1200&auto=format&fit=crop", "https://images.unsplash.com/photo-1560859251-d563a49c5e4a?q=80&w=1200&auto=format&fit=crop"]'::jsonb,
        TRUE
    ),
    (
        'b1111111-1111-1111-1111-111111111112',
        'a1111111-1111-1111-1111-111111111111',
        'MONT-SORT-PAST',
        'Pastel Meadow - 5-Column Deluxe',
        1750.00,
        2200.00,
        900.00,
        30,
        '{"color": "Pastel Rainbow", "edition": "Deluxe"}'::jsonb,
        '["https://images.unsplash.com/photo-1587654780291-39c9404d746b?q=80&w=1200&auto=format&fit=crop", "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=1200&auto=format&fit=crop", "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=1200&auto=format&fit=crop", "https://images.unsplash.com/photo-1560859251-d563a49c5e4a?q=80&w=1200&auto=format&fit=crop"]'::jsonb,
        FALSE
    ),
    -- Astronaut Projector Variants
    (
        'b2222222-2222-2222-2222-222222222221',
        'a2222222-2222-2222-2222-222222222222',
        'ASTRO-PROJ-WHT',
        'Lunar White - Remote Edition',
        2350.00,
        2950.00,
        1300.00,
        60,
        '{"color": "Lunar White", "controls": "Wireless Remote"}'::jsonb,
        '["https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop", "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop", "https://images.unsplash.com/photo-1507499739999-097706ad8914?q=80&w=1200&auto=format&fit=crop", "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1200&auto=format&fit=crop"]'::jsonb,
        TRUE
    ),
    (
        'b2222222-2222-2222-2222-222222222222',
        'a2222222-2222-2222-2222-222222222222',
        'ASTRO-PROJ-BLK',
        'Cosmic Obsidian - Remote Edition',
        2450.00,
        3100.00,
        1350.00,
        25,
        '{"color": "Cosmic Obsidian", "controls": "Wireless Remote"}'::jsonb,
        '["https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop", "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop", "https://images.unsplash.com/photo-1507499739999-097706ad8914?q=80&w=1200&auto=format&fit=crop", "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1200&auto=format&fit=crop"]'::jsonb,
        FALSE
    ),
    -- Magnetic Speedster
    (
        'b3333333-3333-3333-3333-333333333331',
        'a3333333-3333-3333-3333-333333333333',
        'AERO-SPEED-RED',
        'Crimson Velocity 24pc Set',
        1850.00,
        2300.00,
        950.00,
        40,
        '{"color": "Crimson Red", "pieces": "24pc"}'::jsonb,
        '["https://images.unsplash.com/photo-1594787318286-3d835c1d207f?q=80&w=1200&auto=format&fit=crop", "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?q=80&w=1200&auto=format&fit=crop", "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1200&auto=format&fit=crop", "https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=1200&auto=format&fit=crop"]'::jsonb,
        TRUE
    ),
    -- Kinetic Desktop Sculpture
    (
        'b4444444-4444-4444-4444-444444444441',
        'a4444444-4444-4444-4444-444444444444',
        'KINETIC-ORB-SLV',
        'Matte Titanium Silver',
        2890.00,
        3500.00,
        1500.00,
        20,
        '{"finish": "Matte Titanium"}'::jsonb,
        '["https://images.unsplash.com/photo-1558060370-d644479cb6f7?q=80&w=1200&auto=format&fit=crop", "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=1200&auto=format&fit=crop", "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=1200&auto=format&fit=crop", "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=1200&auto=format&fit=crop"]'::jsonb,
        TRUE
    ),
    -- Milestone Gift Hamper
    (
        'b5555555-5555-5555-5555-555555555551',
        'a5555555-5555-5555-5555-555555555555',
        'GIFT-HAMP-OAT',
        'Organic Oat Cream Gift Basket',
        3850.00,
        4500.00,
        2100.00,
        18,
        '{"palette": "Oat Cream & Sage"}'::jsonb,
        '["https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1200&auto=format&fit=crop", "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=1200&auto=format&fit=crop", "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=1200&auto=format&fit=crop", "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop"]'::jsonb,
        TRUE
    ),
    -- Mushroom Bedside Lamp
    (
        'b6666666-6666-6666-6666-666666666661',
        'a6666666-6666-6666-6666-666666666666',
        'MUSH-LAMP-AMB',
        'Warm Amber Frosted Glass',
        2190.00,
        2600.00,
        1100.00,
        35,
        '{"shade": "Warm Amber Frosted"}'::jsonb,
        '["https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=1200&auto=format&fit=crop", "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=1200&auto=format&fit=crop", "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=1200&auto=format&fit=crop", "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1200&auto=format&fit=crop"]'::jsonb,
        TRUE
    )
ON CONFLICT (sku) DO UPDATE 
SET price = EXCLUDED.price, stock_quantity = EXCLUDED.stock_quantity, images = EXCLUDED.images;

-- ------------------------------------------------------------------------------
-- 4. PROMOTIONS & COUPONS
-- ------------------------------------------------------------------------------
INSERT INTO public.promotions (id, code, description, discount_type, discount_value, min_order_value, max_uses, is_active)
VALUES
    ('d0111111-1111-1111-1111-111111111111', 'MIRAI10', 'Enjoy 10% off your entire curated order.', 'percentage', 10.00, 500.00, 1000, TRUE),
    ('d0222222-2222-2222-2222-222222222222', 'FREESHIP', 'Free standard delivery across Bangladesh for orders over ৳ 999.', 'free_shipping', 0.00, 999.00, NULL, TRUE),
    ('d0333333-3333-3333-3333-333333333333', 'WELCOME200', 'Flat ৳ 200 discount for first-time account registration.', 'fixed_amount', 200.00, 1500.00, 500, TRUE)
ON CONFLICT (code) DO UPDATE 
SET discount_value = EXCLUDED.discount_value, is_active = EXCLUDED.is_active;

-- ------------------------------------------------------------------------------
-- 5. REVIEWS
-- ------------------------------------------------------------------------------
INSERT INTO public.reviews (id, product_id, reviewer_name, rating, title, comment, is_verified_purchase, is_approved)
VALUES
    (
        'e1111111-1111-1111-1111-111111111111',
        'a1111111-1111-1111-1111-111111111111',
        'Tanzil A.',
        5,
        'Exceptional quality and solid beechwood!',
        'The wood finish is velvety and the edges are rounded perfectly for my 18-month-old daughter. She plays with it daily!',
        TRUE,
        TRUE
    ),
    (
        'e2222222-2222-2222-2222-222222222222',
        'a2222222-2222-2222-2222-222222222222',
        'Farhana K.',
        5,
        'Magical starry projection',
        'Transforms the entire bedroom ceiling into a starry galaxy. The remote control timer is super convenient for bedtime.',
        TRUE,
        TRUE
    ),
    (
        'e3333333-3333-3333-3333-333333333333',
        'a5555555-5555-5555-5555-555555555555',
        'Nafis R.',
        5,
        'Best baby shower gift ever',
        'The packaging is breathtaking. The parents were delighted with how soft and pure the organic cotton items were.',
        TRUE,
        TRUE
    )
ON CONFLICT (id) DO NOTHING;
