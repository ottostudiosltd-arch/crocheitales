# Crochie Tales - Architectural Decision Records (ADR)

This document records key architectural, design, and security decisions made during the lifecycle of the Crochie Tales project.

---

## ADR-001: Version Control Isolation
- **Date:** 2026-10-12
- **Status:** Approved
- **Decision:** Initialize a dedicated, independent Git repository inside `c:\Users\Tausif Shaikh\Desktop\CrochieTales` with branch `main`.
- **Rationale:** Prevents unintended tracking from parent desktop directories, ensuring clean, isolated commits and straightforward deployment pipelines.
- **Alternatives Considered:** Relying on parent repository tracking (rejected due to noise, untracked files, and accidental leakage).

---

## ADR-002: Frontend Framework & UI Engine
- **Date:** 2026-10-12
- **Status:** Approved
- **Decision:** Use **React (Vite) + TypeScript + Tailwind CSS** with **Lucide React** and **shadcn/ui** (Radix primitives) styling.
- **Rationale:**
  - Provides blazing fast HMR and bundle optimization with Vite.
  - TypeScript guarantees strict type safety across catalog, cart, and order models.
  - Tailwind CSS enables rapid implementation of custom design tokens matching the client's warm, feminine, boutique aesthetic.
  - Radix primitives ensure accessible dialogs, dropdowns, and drawers without visual bloat.
- **Alternatives Considered:** Next.js (good for SSR, but client requirement specifically designated React + Vite + Supabase + Vercel).

---

## ADR-003: Brand Token Architecture & Exact Logo Preservation
- **Date:** 2026-10-12
- **Status:** Approved
- **Decision:**
  - Use exact client-uploaded logo asset (`crochei tales` with yarn heart needle). Never re-draw or distort it.
  - Centralize brand colors into custom Tailwind tokens:
    - Primary Burgundy: `#79002F`
    - Dusty Rose: `#C77D91`
    - Blush Pink: `#F2B8C5`
    - Soft Pink: `#FBE0E6`
    - Warm Cream / Peach: `#F8F1E5` / `#FEEFEA`
- **Rationale:** Guarantees strict visual alignment with client expectations across desktop and mobile screens.

---

## ADR-004: Monetary Values as Integer Minor Units
- **Date:** 2026-10-12
- **Status:** Approved
- **Decision:** Store all monetary prices and subtotals in minor currency units (paise for INR, e.g. ₹899 = `89900`).
- **Rationale:** Completely eliminates floating-point rounding errors in order totals, discount calculations, and shipping charges.

---

## ADR-005: Zero-Trust Client Pricing & Server-Side Order Validation
- **Date:** 2026-10-12
- **Status:** Approved
- **Decision:** All prices submitted from the client browser during checkout are treated as untrusted hints. The backend (Supabase Edge Function / RPC) recalculates prices directly from the live database catalog before order persistence.
- **Rationale:** Prevents client-side price tampering and guarantees transactional integrity.

---

## ADR-006: Shiprocket Isolation & Security Boundary
- **Date:** 2026-10-12
- **Status:** Approved
- **Decision:** Shiprocket credentials will strictly reside in server-side environment variables / Supabase Edge Functions. No Shiprocket API keys will ever be bundled or accessible to the browser client.
- **Rationale:** Strict adherence to project security guidelines and prevents unauthorized shipping order creation or token theft.
