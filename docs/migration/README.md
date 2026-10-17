# DukaanSense Migration & Technical Specification Hub

Welcome to the comprehensive, read-only migration documentation package for **DukaanSense** (DukaanSystem).

This suite provides complete architectural clarity, source-verified specifications, schema DDLs, financial math equations, and technical debt audits for teams planning to migrate, rebuild, or scale the platform into a decoupled standalone production deployment.

---

## 📚 Document Index

| # | Document | Primary Contents |
|---|---|---|
| 01 | [**MASTER_MANIFEST.md**](file:///c:/Users/Mark/Desktop/dukanSense/docs/migration/MASTER_MANIFEST.md) | Inspection date, evidence taxonomy, registry, and the 12 unresolved questions. |
| 02 | [**PROJECT_OVERVIEW.md**](file:///c:/Users/Mark/Desktop/dukanSense/docs/migration/PROJECT_OVERVIEW.md) | Target merchant personas (Kirana shopkeepers), problems solved, core value propositions. |
| 03 | [**FEATURE_INVENTORY.md**](file:///c:/Users/Mark/Desktop/dukanSense/docs/migration/FEATURE_INVENTORY.md) | Functional matrix across all 7 operational modules. |
| 04 | [**UI_DESIGN_SPEC.md**](file:///c:/Users/Mark/Desktop/dukanSense/docs/migration/UI_DESIGN_SPEC.md) | Exact design tokens (Forest Green, Warm Cream), typography scales, layout geometry. |
| 05 | [**DATABASE_SCHEMA.md**](file:///c:/Users/Mark/Desktop/dukanSense/docs/migration/DATABASE_SCHEMA.md) | 19 relational entities field-by-field, DDL types, foreign keys, and indexes. |
| 06 | [**BUSINESS_LOGIC.md**](file:///c:/Users/Mark/Desktop/dukanSense/docs/migration/BUSINESS_LOGIC.md) | 13 business functions, period boundaries, money formulas, and worked examples. |
| 07 | [**BACKEND_API_SPEC.md**](file:///c:/Users/Mark/Desktop/dukanSense/docs/migration/BACKEND_API_SPEC.md) | REST contract, endpoints, JSON request/response schemas, error status codes. |
| 08 | [**AUTH_SECURITY_SPEC.md**](file:///c:/Users/Mark/Desktop/dukanSense/docs/migration/AUTH_SECURITY_SPEC.md) | Tenant isolation via Row-Level Security, RBAC matrix, financial audit logging. |
| 09 | [**AI_COPILOT_SPEC.md**](file:///c:/Users/Mark/Desktop/dukanSense/docs/migration/AI_COPILOT_SPEC.md) | Gemini 2.5 Flash SDK integration, structured schemas, retry ceilings, and fallbacks. |
| 10 | [**STANDALONE_ARCHITECTURE.md**](file:///c:/Users/Mark/Desktop/dukanSense/docs/migration/STANDALONE_ARCHITECTURE.md) | Target decoupled cloud architecture (PostgreSQL, Redis, TypeScript, Docker). |
| 11 | [**TEST_PLAN.md**](file:///c:/Users/Mark/Desktop/dukanSense/docs/migration/TEST_PLAN.md) | Quality assurance matrix, money math edge cases, fractional rounding tests. |
| 12 | [**MIGRATION_GAPS.md**](file:///c:/Users/Mark/Desktop/dukanSense/docs/migration/MIGRATION_GAPS.md) | 7 critical technical gaps identified from prototype code with production fixes. |

---

## 🔍 Evidence Labels Legend
- `[VERIFIED]`: Confirmed directly by inspecting active code in `c:\Users\Mark\Desktop\dukanSense`.
- `[OBSERVED]`: Confirmed from the visual UI prototypes and screenshots.
- `[INFERRED]`: Deductive architectural necessity for database integrity or Indian retail compliance.
- `[UNKNOWN]`: Platform-managed blackbox internals flagged in [MASTER_MANIFEST.md](file:///c:/Users/Mark/Desktop/dukanSense/docs/migration/MASTER_MANIFEST.md).
