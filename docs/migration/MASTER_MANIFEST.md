# Master Migration Manifest: DukaanSense / DukaanSystem

**Inspection Date**: 2026-10-17  
**Status**: Read-Only Architecture & Specification Baseline  
**Workspace**: `c:\Users\Mark\Desktop\dukanSense`  
**Git Remote**: `https://github.com/Gurpreetsingh1293/dukaanSYstem`  
**Target Milestone**: Standalone Production Rebuild (Full-Stack Decoupled)

---

## 1. Documentation Artifact Registry

This documentation suite constitutes a comprehensive, code-verified technical migration package for the DukaanSense Indian Kirana retail platform.

| Index | File Path | Scope & Focus | Line Count Target |
|---|---|---|---|
| 01 | [`docs/migration/MASTER_MANIFEST.md`](file:///c:/Users/Mark/Desktop/dukanSense/docs/migration/MASTER_MANIFEST.md) | Registry, methodology, evidence taxonomy, and 12 unresolved questions | ~180 lines |
| 02 | [`docs/migration/PROJECT_OVERVIEW.md`](file:///c:/Users/Mark/Desktop/dukanSense/docs/migration/PROJECT_OVERVIEW.md) | Business domain, target persona, problem statement, core value props | ~160 lines |
| 03 | [`docs/migration/FEATURE_INVENTORY.md`](file:///c:/Users/Mark/Desktop/dukanSense/docs/migration/FEATURE_INVENTORY.md) | Complete capability matrix across all 7 functional modules | ~210 lines |
| 04 | [`docs/migration/UI_DESIGN_SPEC.md`](file:///c:/Users/Mark/Desktop/dukanSense/docs/migration/UI_DESIGN_SPEC.md) | Verbatim design tokens, typography, component states, layout geometry | ~220 lines |
| 05 | [`docs/migration/DATABASE_SCHEMA.md`](file:///c:/Users/Mark/Desktop/dukanSense/docs/migration/DATABASE_SCHEMA.md) | 19 entity schemas, relational mappings, data types, indexes, isolation | ~270 lines |
| 06 | [`docs/migration/BUSINESS_LOGIC.md`](file:///c:/Users/Mark/Desktop/dukanSense/docs/migration/BUSINESS_LOGIC.md) | 13 business functions, money math formulas, and worked examples | ~240 lines |
| 07 | [`docs/migration/BACKEND_API_SPEC.md`](file:///c:/Users/Mark/Desktop/dukanSense/docs/migration/BACKEND_API_SPEC.md) | REST contract, HTTP verbs, payload schemas, query parameters, error responses | ~230 lines |
| 08 | [`docs/migration/AUTH_SECURITY_SPEC.md`](file:///c:/Users/Mark/Desktop/dukanSense/docs/migration/AUTH_SECURITY_SPEC.md) | Tenant isolation, RBAC matrix, session lifecycles, and audit logging | ~180 lines |
| 09 | [`docs/migration/AI_COPILOT_SPEC.md`](file:///c:/Users/Mark/Desktop/dukanSense/docs/migration/AI_COPILOT_SPEC.md) | Gemini SDK specs, prompts, structured output, retry ceilings, and fallbacks | ~190 lines |
| 10 | [`docs/migration/STANDALONE_ARCHITECTURE.md`](file:///c:/Users/Mark/Desktop/dukanSense/docs/migration/STANDALONE_ARCHITECTURE.md) | Target decoupled architecture (PostgreSQL, Node/Express, React/TS, Redis) | ~200 lines |
| 11 | [`docs/migration/TEST_PLAN.md`](file:///c:/Users/Mark/Desktop/dukanSense/docs/migration/TEST_PLAN.md) | Verification test matrix, regression test cases, edge cases, money rounding | ~190 lines |
| 12 | [`docs/migration/MIGRATION_GAPS.md`](file:///c:/Users/Mark/Desktop/dukanSense/docs/migration/MIGRATION_GAPS.md) | High-severity technical debts, missing constraints, race conditions & fixes | ~210 lines |
| 13 | [`docs/migration/README.md`](file:///c:/Users/Mark/Desktop/dukanSense/docs/migration/README.md) | Navigation hub, quick summary, and implementation roadmap | ~150 lines |

---

## 2. Evidence Classification Taxonomy

Throughout this migration documentation, all architectural assertions, schemas, and logic rules are tagged using the following rigorous evidence taxonomy:

- `[VERIFIED]`: Directly confirmed from the inspection of active codebase (`server.js`, `store.js`, `geminiService.js`, `routes/`, `public/`).
- `[OBSERVED]`: Confirmed from the visual UI prototypes, screenshots, and live interaction states on Base44 prototype endpoints.
- `[INFERRED]`: Deductive business necessity required to maintain domain consistency (e.g., standard Indian GST accounting, relational foreign key requirements).
- `[UNKNOWN]`: External platform dependencies, undocumented defaults, or platform-managed internals that cannot be verified locally without external access.

---

## 3. The 12 Unresolved Questions & Verification Steps

| ID | Topic | Current Understanding `[UNKNOWN]` | Verification Step Required | Impact on Rebuild |
|---|---|---|---|---|
| **UQ-01** | Platform Auth Internals | Base44 managed Supabase/Firebase OAuth tokens behind the scenes. | Inspect OAuth redirect URLs and platform webhook triggers. | Determines auth adapter choice (Supabase Auth vs NextAuth/Lucia). |
| **UQ-02** | Invite-Email Delivery | Staff invites show UI buttons, but email dispatch provider is unknown. | Check SMTP/Resend/SendGrid API bindings. | Notification service architecture for multi-staff shops. |
| **UQ-03** | Rate-Limit Thresholds | No API throttling is implemented locally on `/api/gemini/*`. | Review Google AI Studio quota tier (free 15 RPM vs pay-as-you-go). | Needs Redis token bucket rate limiting on client endpoints. |
| **UQ-04** | Data Retention & Backups | In-memory store does not retain state across server restarts. | Define retention SLA (e.g., daily automated Postgres snapshots). | Required for financial compliance and disaster recovery. |
| **UQ-05** | Expiry Look-ahead Window | Action Center checks stock level; expiry date threshold is unconfigured. | Agree with shop owner on standard shelf-life window (e.g., 30 days). | Determines SQL rule query for Action Center alerts. |
| **UQ-06** | Custom Domain & SSL | Running on `localhost:3000` and `*.base44.app`. | Check DNS provider and SSL certificate provisioning. | Production deployment routing and CORS headers. |
| **UQ-07** | Barcode Hardware Support | Barcode field exists on products, but hardware scanner wedge is unverified. | Test HID USB / Bluetooth barcode scanner keyboard emulation. | POS input handler debounce and rapid character sequence detection. |
| **UQ-08** | Cash Drawer Trigger | No ESC/POS printer drawer kick-pulse is defined. | Check receipt printer model (e.g., thermal 80mm ESC/POS via USB/Network). | Optional POS hardware integration hook. |
| **UQ-09** | GST / Non-GST Mode | Current calculation treats Gross Profit as Sales minus Cost with 0 tax. | Verify if shop is GST registered (Composite 1% vs Regular 5/12/18%). | Tax calculation engine on line items. |
| **UQ-10** | Offline PWA Capabilities | Prototype requires active HTTP connection to Express server. | Determine Kirana offline requirement during network drops. | Service Worker + IndexedDB background sync. |
| **UQ-11** | Customer Credit Ceiling | Customers have balances, but maximum allowed Udhaar credit is not enforced. | Query shop credit policies (e.g., hard stop at ₹2,000 per customer). | Validation gate in checkout pipeline. |
| **UQ-12** | Audit Deletion Restrictions | Members can reverse bills without supervisor override. | Define 4-digit Owner PIN requirement for returns/reversals. | Security authorization check in API routes. |

---

## 4. Source Evidence References

- **Backend Express Server**: [`server.js`](file:///c:/Users/Mark/Desktop/dukanSense/server.js)
- **Data Store & Seeds**: [`data/store.js`](file:///c:/Users/Mark/Desktop/dukanSense/data/store.js)
- **REST Endpoints**: [`routes/api.js`](file:///c:/Users/Mark/Desktop/dukanSense/routes/api.js)
- **Gemini Service**: [`services/geminiService.js`](file:///c:/Users/Mark/Desktop/dukanSense/services/geminiService.js)
- **Gemini Endpoints**: [`routes/gemini.js`](file:///c:/Users/Mark/Desktop/dukanSense/routes/gemini.js)
- **Frontend Single Page Layout**: [`public/index.html`](file:///c:/Users/Mark/Desktop/dukanSense/public/index.html)
- **Frontend Design System**: [`public/css/style.css`](file:///c:/Users/Mark/Desktop/dukanSense/public/css/style.css)
- **App Logic Modules**: [`public/js/`](file:///c:/Users/Mark/Desktop/dukanSense/public/js)
