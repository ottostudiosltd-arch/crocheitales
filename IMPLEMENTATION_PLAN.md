# Crochie Tales - Implementation Plan

## 1. Project Overview & Objective
Build a complete, responsive, production-oriented crochet e-commerce website for **Crochie Tales** featuring:
- Seamless product browsing, catalog filtering, and collections.
- Temporary cart persistence and server-validated checkout.
- Customer accounts, authentication, address book, and order tracking.
- Crochet workshop discovery and capacity-guarded registration.
- Full Admin Management Panel for catalog, orders, workshops, and review moderation.
- Supabase PostgreSQL backend with Row Level Security (RLS) and Storage.
- Server-side Shiprocket integration for automated shipping fulfillment and tracking.

---

## 2. Technical Stack & Architecture

- **Frontend:** React 18/19, Vite, TypeScript, Tailwind CSS, shadcn/ui components (Radix primitives), Lucide React icons.
- **Routing:** React Router v6/v7.
- **State Management:** Zustand (for lightweight, reactive cart, notification, and filter state).
- **Forms & Validation:** React Hook Form + Zod.
- **Backend & Database:** Supabase PostgreSQL, Supabase Auth, Supabase Storage, Supabase Edge Functions.
- **Security Policy:**
  - Row Level Security (RLS) on all user and business tables.
  - No client-side price trust; recalculation on backend.
  - Zero sensitive secrets exposed to browser bundles.
  - Shiprocket API credentials isolated strictly in backend/Edge Functions.
- **Shipping Integration:** Shiprocket API (order creation, pickup requests, AWB generation, and webhook/tracking queries).
- **Deployment:** Vercel (Frontend), Supabase (Database & Functions), Custom Domain `crochietales.in`.

---

## 3. Phase Breakdown & Execution Sequence

### Phase 0: Repository Audit and Project Foundation (Current)
- **Goal:** Understand existing project, establish tracking docs, audit environment and client assets.
- **Deliverables:** `PROJECT_STATUS.md`, `IMPLEMENTATION_PLAN.md`, `REQUIREMENTS_CHECKLIST.md`, `CHANGELOG.md`, `DECISIONS.md`.
- **Criteria:** Clean repository baseline, toolchain verified, all master requirements recorded.

### Phase 1: Brand System and UI Design
- **Goal:** Build design tokens and component foundations matching the provided mockups.
- **Key Tasks:**
  - Extract and configure exact brand palette:
    - Deep Burgundy: `#79002F` (primary brand, text headings, footer, primary buttons)
    - Dusty Rose: `#C77D91`
    - Blush Pink: `#F2B8C5` / Soft Pink `#FBE0E6`
    - Warm Cream: `#F8F1E5` / Light Peach Background `#FEEFEA`
    - White: `#FFFFFF`
  - Typography setup: Serif headline styling (Playfair Display / Fraunces / Recoleta aesthetic) + clean legible sans-serif body (Plus Jakarta Sans / Inter).
  - Setup logo assets: Save high-res client logo (`crochei tales` with yarn heart needle) in vector/optimized format.
  - Build reusable UI primitives: Buttons (burgundy pill, outline, ghost), Badges, Cards, Modals, Section Headings with flourishes, Decorative hearts and flower accents.

### Phase 2: Frontend Foundation and Navigation
- **Goal:** Set up Vite + React + TypeScript + Tailwind project, configure layout shells and complete route map.
- **Key Routes:**
  - Storefront: `/`, `/shop`, `/categories`, `/categories/:slug`, `/collections`, `/collections/:slug`, `/products/:slug`
  - Shopping: `/cart`, `/checkout`
  - Workshops: `/workshops`, `/workshops/:slug`
  - Customer Account: `/profile`, `/orders`, `/orders/:id`, `/wishlist`
  - Information: `/about`, `/contact`, `/shipping-policy`, `/terms`, `/privacy`
  - Management: `/admin`, `/admin/products`, `/admin/orders`, `/admin/workshops`, `/admin/reviews`
- **Navigation Components:**
  - Desktop Header: Announcement bar, Logo, Navigation links, Search bar/modal, Account dropdown, Cart trigger with live count badge.
  - Mobile Bottom Navigation Bar: Fixed bar with Home, Shop, Collections, Workshops, Profile.
  - Graceful handling of viewport padding so bottom nav never obscures checkout or cart buttons.

### Phase 3: Homepage and Shopping UI
- **Goal:** Faithfully implement desktop and mobile layouts based on the uploaded visual mockups.
- **Key Sections:**
  - Top Announcement Bar (Configurable shipping and promotion ticker).
  - Hero Section:
    - Desktop: Split layout with centered messaging, "Little Threads Big Happiness", "Shop Now ->", crochet tulip bouquet showcase.
    - Mobile: Double polaroid framed crochet photos ("Handmade ♡", "Made with love ♡").
  - Benefits Bar: 4 guarantee cards (Free Shipping above ₹999, Handmade with love, Perfect for Gifting, Custom Orders).
  - Featured Products: Cards with Bestseller tags, pricing in ₹, ratings, wishlist heart toggle, quick add-to-cart.
  - Shop by Category: Hair Accessories, Keychains, Flower Bouquets, Wearables, Plushies, Other Things.
  - Shop by Collection: Best Sellers, Sale Finds, Gift Ideas, Gifts for Him, Gifts for Her.
  - Workshops Promotion Banner: "Crochet Workshops - Learn • Create • Have Fun" with CTA.
  - Scalloped wave border transition into Deep Burgundy Footer with logo, quick links, policies, and "Let's stay connected".
  - Shop listing page with category filters, sorting (price, popularity, newest), and search bar.
  - Product details page with image gallery, zoom, stock indicator, quantity selector, add-to-cart, description, and specifications.

### Phase 4: Supabase Setup and Database Design
- **Goal:** Establish a robust PostgreSQL database schema with migration scripts and strict RLS.
- **Tables:**
  - `profiles` (auth link, role, name, phone, timestamps)
  - `addresses` (customer shipping & billing addresses)
  - `categories` (name, slug, image_url, sort_order, is_active)
  - `collections` (name, slug, banner_url, description, is_active)
  - `products` (title, slug, sku, price_minor, compare_at_price_minor, stock_quantity, category_id, is_featured, is_active, tags)
  - `product_images` (product_id, image_url, alt_text, sort_order)
  - `collection_products` (collection_id, product_id)
  - `orders` (customer_id, order_number, status, payment_method, total_amount_minor, shipping_amount_minor, shipping_address_snapshot, idempotency_key)
  - `order_items` (order_id, product_id, title_snapshot, price_snapshot, quantity)
  - `order_status_history` (order_id, status, notes, created_at)
  - `shipping_shipments` (order_id, shiprocket_order_id, shiprocket_shipment_id, awb_code, courier_name, tracking_status, label_url)
  - `workshops` (title, slug, description, format, price_minor, venue_or_link, is_active)
  - `workshop_sessions` (workshop_id, start_time, end_time, capacity, booked_count)
  - `workshop_registrations` (session_id, user_id, attendee_name, attendee_email, attendee_phone, status, payment_status)
  - `reviews` (product_id, user_id, rating, comment, is_approved)
  - `wishlists` & `wishlist_items`
  - `admin_audit_logs` (admin_id, action, target_type, target_id, payload)
- **Database Rules:** Integer minor units (e.g. ₹899 = `89900` paise), RLS enforced for anonymous, authenticated, and admin access.

### Phase 5: Authentication, Profiles, and Authorization
- **Goal:** Secure customer signup, login, session retention, password recovery, and role-based admin guard.
- **Key Implementations:**
  - Supabase Auth integration (Email/Password, Magic Link / Google OAuth optional).
  - Profile auto-creation trigger on user signup.
  - Role check (`role = 'admin'`) via database security claim or secure function (preventing client-side privilege escalation).
  - Protected route wrappers: `<CustomerRoute />` and `<AdminRoute />`.

### Phase 6: Product Management and Storage
- **Goal:** Connect public shop to live Supabase backend and enable admin catalog management.
- **Key Tasks:**
  - Supabase Storage buckets for product images and workshop banners.
  - Admin product creation and editing UI with multi-image upload and drag-and-drop ordering.
  - Real-time catalog query hooks with caching.

### Phase 7: Cart, Checkout, and Order Creation
- **Goal:** High-conversion, tamper-proof checkout flow.
- **Key Tasks:**
  - Zustand cart store persisted in `localStorage` for customer convenience.
  - Checkout form: Full address capture, pincode validation, phone validation.
  - Payment methods: Cash on Delivery (COD) supported out of the box; online gateway architecture ready.
  - Secure order placement: Server-side price recalculation (Edge Function or database RPC) ensuring client cannot tamper with prices.
  - Idempotency control to prevent double-charging or duplicate order creation.

### Phase 8: Secure Shiprocket Integration
- **Goal:** Connect validated orders to Shiprocket without exposing credentials to frontend.
- **Key Tasks:**
  - Secure Supabase Edge Function: `create-shiprocket-order`.
  - Shiprocket authentication with token caching.
  - Payload transformation from internal order to Shiprocket order format.
  - AWB generation, pickup request generation, and tracking webhook/endpoint.
  - Separate internal `order_status` from Shiprocket `shipment_status`.
  - Admin controls for re-triggering failed shipments.

### Phase 9: Workshop Management and Registration
- **Goal:** Enable users to discover and book live/offline crochet workshops.
- **Key Tasks:**
  - Public listing and detail pages for workshops.
  - Registration modal / checkout with atomic seat booking (preventing race-condition overbooking).
  - Admin view of attendee rosters and session capacity controls.

### Phase 10: Reviews, Wishlist, and Customer Account
- **Goal:** Deliver delightful customer self-service.
- **Key Tasks:**
  - Wishlist toggle and synchronized database storage for logged-in users.
  - Customer order history with live status timeline and Shiprocket tracking links.
  - Review submission system with admin moderation queue.
  - Address book management (add, edit, set default).

### Phase 11: Admin Dashboard
- **Goal:** Modern boutique management dashboard for the client.
- **Key Tasks:**
  - Summary metrics: Revenue, orders pending fulfillment, active workshops, customer count.
  - Order management with fulfillment status toggles and Shiprocket sync.
  - Product catalog manager.
  - Workshop session scheduler.
  - Review approval / moderation panel.

### Phase 12: Quality Assurance, Security, and Performance
- **Goal:** Rigorous testing before release.
- **Key Tasks:**
  - TypeScript strict type checks (`tsc --noEmit`).
  - Unit and integration tests with Vitest.
  - End-to-end verification of cart, checkout, and admin flows.
  - Mobile responsiveness audit on small, medium, and tablet screens.
  - Accessibility and lighthouse performance audit.

### Phase 13: Deployment and Domain Configuration
- **Goal:** Safe deployment to Vercel and domain linking (`crochietales.in`).
- **Key Tasks:**
  - Production build verification.
  - Environment variable setup on Vercel.
  - Supabase production database migration verification.
  - DNS guidance and HTTPS setup for `crochietales.in`.

### Phase 14: Launch Readiness and Handover
- **Goal:** Complete handover and documentation for the client.
- **Key Tasks:**
  - Admin user guide with screenshots and step-by-step instructions.
  - Operations guide for Shiprocket order processing.
  - Final requirements verification against `REQUIREMENTS_CHECKLIST.md`.

---

## 4. Acceptance Criteria & Definition of Done
Every phase must be tested and documented before proceeding. No mock code will be presented as completed backend features.
