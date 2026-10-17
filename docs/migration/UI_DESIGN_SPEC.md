# UI Design Specification: DukaanSense / DukaanSystem

**Evidence Status**: `[VERIFIED]` from [`public/css/style.css`](file:///c:/Users/Mark/Desktop/dukanSense/public/css/style.css)  
**Aesthetic Style**: Warm Ivory / Forest Green / Refined Kirana Retail System

---

## 1. Verbatim Design Tokens

### Color Palette

```css
:root {
  /* Surface and Backgrounds */
  --bg-app: #f7f5ef;               /* Warm cream/ivory main canvas */
  --bg-card: #ffffff;              /* Crisp white card surface */
  --bg-sidebar: #133c2a;           /* Deep heritage forest green */
  --bg-sidebar-card: #1c4b37;      /* Sidebar shop container */
  --bg-sidebar-hover: #194632;     /* Interactive nav item hover */
  --bg-sidebar-active: #23563e;    /* Active navigation item pill */

  /* Text & Content Tokens */
  --text-main: #182620;            /* High-contrast dark charcoal */
  --text-muted: #64756c;           /* Secondary slate green for captions */
  --text-light: #ffffff;           /* Pure white text */
  --text-sidebar-muted: #95af9f;   /* Sage green for sidebar labels */

  /* Primary Brand & Accents */
  --color-primary: #1b4332;        /* Dark forest green for buttons/active states */
  --color-primary-hover: #143627;  /* Hover state for primary buttons */
  --color-accent-orange: #e07a38;  /* Brand logo & Google button accent */
  --color-accent-orange-hover: #c96728;

  /* Borders & Dividers */
  --color-border: #e8e3d7;         /* Warm subtle card border */
  --color-border-subtle: #f0ece3;  /* Inner cell and stat dividers */

  /* Semantic State Badges */
  --color-danger: #dc2626;         /* High priority alerts & reversals */
  --color-danger-bg: #fef2f2;      /* Light red badge background */
  --color-success: #15803d;        /* Completed sales & healthy stock */
  --color-success-bg: #f0fdf4;     /* Light green badge background */
  --color-warning: #b45309;        /* Medium alerts & pending Udhaar */
  --color-warning-bg: #fffbeb;     /* Light amber badge background */
  --color-ai-purple: #7e22ce;      /* Gemini AI suggestions & Co-pilot */
  --color-ai-purple-bg: #f5f3ff;   /* Lavender badge background */
}
```

---

## 2. Typography Specification

- **Primary Font Family**: `'Plus Jakarta Sans', system-ui, -apple-system, sans-serif`
- **Fallback Stack**: `Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif`

| Token | Font Size | Weight | Line Height | Usage |
|---|---|---|---|---|
| `display-title` | 1.85rem (29.6px) | 800 (Extra Bold) | 1.1 | View headers ("Dashboard", "Sales") |
| `card-title` | 1.05rem (16.8px) | 700 (Bold) | 1.3 | Panel titles ("Receipts by method", "Low stock") |
| `kpi-metric` | 1.85rem (29.6px) | 800 (Extra Bold) | 1.0 | Big numbers (`₹881`, `₹1,178`) |
| `body-normal` | 0.88rem (14.0px) | 500 (Medium) | 1.5 | General descriptions and table cells |
| `label-bold` | 0.80rem (12.8px) | 600 (Semi Bold) | 1.2 | Form labels, navigation links |
| `badge-pill` | 0.72rem (11.5px) | 700 (Bold) | 1.0 | Status pills, reorder tags, method badges |
| `micro-copy` | 0.68rem (10.8px) | 700 (Bold) | 1.0 | Section uppercase labels (`OVERVIEW`, `BUSINESS`) |

---

## 3. Elevation & Radius Scales

### Border Radii
- `--radius-sm`: `8px` — inputs, table action buttons, payment pills.
- `--radius-md`: `12px` — sidebar shop card, low-stock badges, form controls.
- `--radius-lg`: `16px` — dashboard cards, KPI cards, modals, login panel.
- `--radius-pill`: `9999px` — toggle buttons, status badges, trigger buttons.

### Box Shadows
- `--shadow-sm`: `0 1px 2px rgba(0, 0, 0, 0.04)`
- `--shadow-card`: `0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.02)`
- `--shadow-lg`: `0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)`

---

## 4. Layout Geometry & Grid Systems

```
+-----------------------------------------------------------------------------------------+
|                                    APP CONTAINER                                        |
+-------------------+---------------------------------------------------------------------+
|      SIDEBAR      |                             MAIN CONTENT                            |
|      (260px)      |                           (max-width: 1300px)                       |
|                   |                                                                     |
| [Logo: 40x40px]   | Top Status Bar: [Breadcrumbs]  ..... [Gemini Status] [Co-pilot Btn] |
| DukaanSense       |                                                                     |
| Shop/Numbers      | View Header: [H1 Title] [Subtitle] ...... [Today|7d|30d] [+ New Sale] |
|                   |                                                                     |
| [Shop Card]       | KPI Grid (repeat(4, 1fr)):                                          |
| Patel Stores      | [Sales: ₹881]  [Expenses: ₹240]  [Est. Profit: ₹123]  [Udhaar: ₹1178] |
| Gurpreet Singh    |                                                                     |
|                   | Dashboard Split (1.55fr : 1fr):                                     |
| [OVERVIEW]        | +-----------------------------------+ +-----------------------------+ |
| * Dashboard       | | Receipts by Method                | | Low Stock (Reorder Alerts)  | |
| * Action Center   | | Cash: ₹171  UPI: ₹476             | | Good Knight (3 left)        | |
|                   | | Card: ₹0    Udhaar: ₹234          | | Britannia Good Day (4 left) | |
| [BUSINESS]        | |-----------------------------------| | Dettol Antiseptic (4 left)  | |
| * New Sale        | | Bills:3 | Disc:0 | Stock:0 | -₹117| | Surf Excel 1kg (6 left)     | |
| * Sales           | +-----------------------------------+ +-----------------------------+ |
| * Products        |                                                                     |
| * Udhaar Ledger   |                                                                     |
|                   |                                                                     |
| [Log out]         |                                                                     |
+-------------------+---------------------------------------------------------------------+
```

---

## 5. Component States Matrix

| Component | Default State | Hover State | Active / Selected State | Disabled State |
|---|---|---|---|---|
| **Primary Button** | Background: `#1b4332`, White text, shadow: `0 2px 6px rgba(27,67,50,0.25)` | Background: `#143627`, `translateY(-1px)` | Background: `#0f291e`, `translateY(0)` | Opacity: 0.5, cursor: `not-allowed` |
| **Pill Filter** | Background: `#ffffff`, Border: `#e8e3d7`, Text: `#64756c` | Text: `#182620`, Border: `#d8d2c4` | Background: `#1b4332`, White text, Border: `#1b4332` | N/A |
| **Nav Item** | Transparent background, Text: `#d1ded7` | Background: `#194632`, Text: `#ffffff` | Background: `#23563e`, Text: `#ffffff`, Font-weight: 600 | N/A |
| **Table Row** | Background: `#ffffff`, Border-bottom: `#f4f0e6` | Background: `#fdfcf9` | N/A | Reversed rows: opacity 0.6, strikethrough |
| **Co-pilot Drawer**| Position: `fixed`, `right: -420px` | N/A | Class `.open`: `right: 0`, cubic-bezier slide | N/A |
| **Modal Backdrop** | Display: `none`, background: `rgba(0,0,0,0.4)` | N/A | Class `.active`: display `flex`, backdrop blur | N/A |
