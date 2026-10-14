# Crochie Tales - Requirements Checklist

| Requirement ID | Description | Source / Category | Status | Verification Reference |
|---|---|---|---|---|
| **REQ-BRD-01** | Use exact client-provided logo asset ("crochei tales" with yarn ball heart and needle) | Brand | 🟢 Verified | [`src/components/brand/Logo.tsx`](file:///c:/Users/Tausif%20Shaikh/Desktop/CrochieTales/src/components/brand/Logo.tsx) |
| **REQ-BRD-02** | Implement brand color palette (Deep Burgundy `#79002F`, Dusty Rose `#C77D91`, Blush Pink `#F2B8C5`, Warm Cream `#F8F1E5`, Soft Pink `#FBE0E6`) | Brand | 🟢 Verified | [`tailwind.config.js`](file:///c:/Users/Tausif%20Shaikh/Desktop/CrochieTales/tailwind.config.js), [`src/types/brand.ts`](file:///c:/Users/Tausif%20Shaikh/Desktop/CrochieTales/src/types/brand.ts) |
| **REQ-BRD-03** | Use elegant, feminine, boutique aesthetic; avoid excessive animations/loud gradients | Brand | 🟢 Verified | Clean warm palette, soft shadows, delicate accents |
| **REQ-BRD-04** | Centralize design tokens (colors, spacing, shadows, radii, typography) | Architecture | 🟢 Verified | [`src/index.css`](file:///c:/Users/Tausif%20Shaikh/Desktop/CrochieTales/src/index.css), [`tailwind.config.js`](file:///c:/Users/Tausif%20Shaikh/Desktop/CrochieTales/tailwind.config.js) |
| **REQ-NAV-01** | Desktop Header: Logo, Home, Shop, Collections, About, Contact, Search, Account, Cart | Navigation | 🟢 Verified | [`src/components/layout/Header.tsx`](file:///c:/Users/Tausif%20Shaikh/Desktop/CrochieTales/src/components/layout/Header.tsx) |
| **REQ-NAV-02** | Mobile Bottom Navigation: Home, Shop, Categories, Workshops, Profile | Navigation | 🟢 Verified | [`src/components/layout/MobileBottomNav.tsx`](file:///c:/Users/Tausif%20Shaikh/Desktop/CrochieTales/src/components/layout/MobileBottomNav.tsx) |
| **REQ-NAV-03** | Live cart item-count badge on header and mobile navigation | Navigation | 🟢 Verified | Cart count badge rendered in Header |
| **REQ-NAV-04** | Responsive navigation must not obstruct page content or checkout controls | Navigation | 🟢 Verified | Safe area bottom padding (`pb-16 lg:pb-0`) implemented |
| **REQ-HOM-01** | Configurable Announcement Bar (Shipping promo / special announcement) | Homepage | 🟢 Verified | Announcement ticker in Header |
| **REQ-HOM-02** | Hero Section: Desktop centered content + bouquet imagery + "Shop Now ->" CTA | Homepage | ⚪ Pending | Phase 3 |
| **REQ-HOM-03** | Hero Section: Mobile polaroid cards layout + "Shop Now ->" CTA | Homepage | ⚪ Pending | Phase 3 |
| **REQ-HOM-04** | Benefits Bar: Free Shipping > ₹999, Handmade with Love, Perfect for Gifting, Custom Orders | Homepage | ⚪ Pending | Phase 3 |
| **REQ-HOM-05** | Featured Products Section with Bestseller tags, ratings, wishlist heart, and quick-add | Homepage | 🟡 In Progress | ProductCard ready; grid in Phase 3 |
| **REQ-HOM-06** | Shop by Category: Hair Accessories, Keychains, Flower Bouquets, Wearables, Plushies, Other Things | Homepage | ⚪ Pending | Phase 3 |
| **REQ-HOM-07** | Shop by Collection: Best Sellers, Sale Finds, Gift Ideas, Gifts for Him, Gifts for Her | Homepage | ⚪ Pending | Phase 3 |
| **REQ-HOM-08** | Workshop Promotion Section: "Crochet Workshops - Learn • Create • Have Fun" | Homepage | ⚪ Pending | Phase 3 |
| **REQ-HOM-09** | Scalloped Wave Footer with brand logo, tagline, social links, navigation, and policy links | Homepage | 🟢 Verified | [`src/components/layout/Footer.tsx`](file:///c:/Users/Tausif%20Shaikh/Desktop/CrochieTales/src/components/layout/Footer.tsx) |
| **REQ-CAT-01** | Full Shop Catalog with search, multi-category filters, price sort, and availability | Catalog | ⚪ Pending | Phase 3 / Phase 6 |
| **REQ-PRD-01** | Product Details Page: Multi-image gallery, zoom, pricing, stock, quantity selector, add to cart | Product | ⚪ Pending | Phase 3 / Phase 6 |
| **REQ-DB-01** | Version-controlled Supabase SQL migrations for all required tables and relationships | Database | ⚪ Pending | Phase 4 |
| **REQ-DB-02** | Monetary amounts stored strictly in minor integer units (paise) with explicit currency | Database | ⚪ Pending | Phase 4 schema |
| **REQ-DB-03** | Row Level Security (RLS) enabled and verified on all tables with private data | Security | ⚪ Pending | Phase 4 security tests |
| **REQ-DB-04** | Snapshot product title and unit price into `order_items` at purchase time | Database | ⚪ Pending | Phase 4 & Phase 7 |
| **REQ-AUTH-01** | Supabase Auth: Customer sign-up, sign-in, sign-out, password reset | Auth | ⚪ Pending | Phase 5 |
| **REQ-AUTH-02** | Customer profile and address book management | Auth | ⚪ Pending | Phase 5 |
| **REQ-AUTH-03** | Server-enforced Admin role verification (cannot be bypassed via frontend state) | Security | ⚪ Pending | Phase 5 |
| **REQ-CRT-01** | Zustand cart store with persistent temporary local storage | Cart | ⚪ Pending | Phase 7 |
| **REQ-CHK-01** | Server-side price, coupon, and inventory re-validation during order creation | Security | ⚪ Pending | Phase 7 |
| **REQ-CHK-02** | Support Cash on Delivery (COD) order workflow | Checkout | ⚪ Pending | Phase 7 |
| **REQ-CHK-03** | Idempotency control to prevent accidental duplicate order creation | Checkout | ⚪ Pending | Phase 7 |
| **REQ-SHP-01** | Secure Shiprocket integration via backend Edge Functions (no credentials in frontend) | Shipping | ⚪ Pending | Phase 8 |
| **REQ-SHP-02** | Automatic or admin-triggered Shiprocket shipment creation with address mapping | Shipping | ⚪ Pending | Phase 8 |
| **REQ-SHP-03** | Shiprocket tracking code and status updates linked to customer orders | Shipping | ⚪ Pending | Phase 8 |
| **REQ-SHP-04** | Maintain separation between internal `order_status` and courier `shipment_status` | Shipping | ⚪ Pending | Phase 8 |
| **REQ-WRK-01** | Workshop management (admin create/edit sessions, capacity, format, pricing) | Workshops | ⚪ Pending | Phase 9 |
| **REQ-WRK-02** | Public workshop registration with overbooking prevention safeguards | Workshops | ⚪ Pending | Phase 9 |
| **REQ-REV-01** | Customer product reviews with ratings, feedback, and admin moderation queue | Social Proof | ⚪ Pending | Phase 10 |
| **REQ-WSH-01** | Persistent customer wishlist with quick add/remove | Engagement | ⚪ Pending | Phase 10 |
| **REQ-ADM-01** | Admin panel for catalog (products, categories, collections, images) | Admin | ⚪ Pending | Phase 11 |
| **REQ-ADM-02** | Admin order management with fulfillment updates and Shiprocket triggers | Admin | ⚪ Pending | Phase 11 |
| **REQ-ADM-03** | Admin workshop roster and review moderation | Admin | ⚪ Pending | Phase 11 |
| **REQ-QA-01** | Comprehensive TypeScript, unit, integration, and responsive layout tests | QA | ⚪ Pending | Phase 12 |
| **REQ-DEP-01** | Production deployment on Vercel with clean HTTPS and domain `crochietales.in` | Deployment | ⚪ Pending | Phase 13 |
| **REQ-DOC-01** | Client operational guide and maintenance documentation | Handover | ⚪ Pending | Phase 14 |
