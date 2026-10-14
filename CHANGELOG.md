# Crochie Tales - Changelog

All notable changes, architectural milestones, and verification runs will be recorded chronologically in this file.

---

## [Phase 3: Homepage and Shopping UI] - 2026-10-12

### Changed & Added
- **Full-Bleed Hero Section Reconstruction:**
  - Integrated client's `src/assets/hero.png` edge-to-edge as a natural background without card container boxing, unwanted border margins, or rounded container borders.
  - Positioned authentic handwriting elements (`Handmade ♡`, `Made with love ♡`) over polaroid displays.
  - Implemented crisp central HTML typography:
    - Eyebrow: `Little Threads, Big Happiness ♡`
    - Heading: `Handmade Crochet Pieces for Brighter Days`
    - Subtitle: `Hair accessories, keychains, bouquets, wearables and more — crafted with love.`
  - Added real interactive burgundy pill button (`Shop Now →`) routed to `/shop`.
  - Replaced all brand spelling occurrences across files to **Crochei Tales**.
- **Visual Design Parity:**
  - Integrated 6 curated category cards with client mockup photography (`Hair Accessories`, `Keychains`, `Flower Bouquets`, `Wearables`, `Plushies`, `Other Things`).
  - Integrated 5 curated collection cards (`Best Sellers`, `Sale Finds`, `Gift Ideas`, `Gifts for Him`, `Gifts for Her`).
  - Rebuilt desktop header with integrated inline search pill (`🔍 Search handmade treasures...`) and Workshops navigation.
- **Contact & Footer Enhancements:**
  - Updated primary store & WhatsApp contact phone number to `+91 744 724 6150` across all components (`HomePage.tsx`, `ContactPage.tsx`, `CheckoutPage.tsx`, `ProfilePage.tsx`).
  - Implemented route-aware footer: rendered full rich boutique footer exclusively on the Home page (`/`), while serving a minimal copyright & handmade dedication footer strip on secondary pages (`/shop`, `/workshops`, `/cart`, `/profile`, etc.).

### Tests & Verification
- `tsc -b`: Clean TypeScript check with 0 errors.
- `vite build`: Successful production build completed in 20.88s.

---

### Added
- **Complete Route Architecture:** Configured all 17 storefront, shopping, workshop, account, and administrative routes with `react-router-dom`:
  - `/` (Home page)
  - `/shop` (Shop catalog with category filters and sort)
  - `/categories` & `/categories/:slug` (Category catalog & filtered views)
  - `/collections` & `/collections/:slug` (Collections catalog & curated views)
  - `/products/:slug` (Product detail view with thumbnail gallery, rating, quantity counter, and Add to Bag)
  - `/cart` (Cart management with free shipping progress threshold)
  - `/checkout` (Full checkout form with COD & Online payment selectors)
  - `/workshops` & `/workshops/:slug` (Workshop discovery & registration)
  - `/profile` (Customer account overview)
  - `/orders` (Customer order history with Shiprocket tracking link)
  - `/about` & `/contact` (Brand story & contact inquiry form)
  - `/admin` (Boutique manager dashboard overview)
  - `/design-system` (Live design system playground)
  - `*` (Boutique 404 Not Found "Lost a stitch? ♡" page)
- **Interactive Global Navigation Shells:**
  - `SearchModal.tsx`: Search dialog with quick-category shortcuts.
  - `CartDrawer.tsx`: Slide-over shopping bag drawer with free delivery progress calculation.
  - Connected `Header.tsx` triggers (`onOpenSearch`, `onOpenCart`) in `AppLayout.tsx`.
- **Reusable Lifecycle States:**
  - `LoadingSpinner.tsx`: Boutique yarn loading spinner.
  - `EmptyState.tsx`: Empty cart/results state with actionable button.
  - `ErrorState.tsx`: Friendly retryable error display.
- **Viewport Safe-Area Convention:** Added `pb-20 lg:pb-0` to `<main>` in `AppLayout.tsx` so the fixed mobile navigation bar never covers checkout buttons or footer contents.

### Tests & Verification
- `tsc -b`: Clean TypeScript compilation with strict type safety across all pages.
- `vite build`: Production build succeeded in 11.4s generating optimized assets.
- Route navigation and modal triggers verified.

---

## [Phase 1: Brand System and UI Design] - 2026-10-12

### Added
- **Project Scaffolding:** Configured React 18, Vite 6, TypeScript, Tailwind CSS, Lucide React, and Zustand.
- **Design Tokens:** Centralized color variables in `tailwind.config.js` and `src/index.css` (`#79002F`, `#C77D91`, `#F2B8C5`, `#F8F1E5`, `#FBE0E6`, `#FEEFEA`).
- **Typography Scale:** Configured `DM Serif Display` / `Playfair Display` for headings, `Plus Jakarta Sans` for body, and `Caveat` for cursive accents.
- **Brand Logo Asset:** Integrated authentic client yarn ball heart and crochet needle vector logo (`src/components/brand/Logo.tsx`) with light and dark mode variants.
- **Component Primitives:** `Button.tsx`, `Badge.tsx`, `Card.tsx`, `SectionHeading.tsx`, `ProductCard.tsx`.
- **Navigation Shells:** `Header.tsx`, `Footer.tsx`, `MobileBottomNav.tsx`.

---

## [Phase 0: Repository Audit and Project Foundation] - 2026-10-12

### Added
- Initialized isolated Git repository (`main` branch) in `c:\Users\Tausif Shaikh\Desktop\CrochieTales`.
- Audited system environment: Node.js `v22.18.0`, pnpm `11.22.0`, npm `11.5.2`.
- Cataloged client-provided visual design references.
- Established persistent project management documentation (`PROJECT_STATUS.md`, `IMPLEMENTATION_PLAN.md`, `REQUIREMENTS_CHECKLIST.md`, `CHANGELOG.md`, `DECISIONS.md`).
