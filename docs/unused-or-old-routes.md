# Unused or Old Routes

This document lists routes that are **never linked from the UI**, **referenced but have no page**, or **typos/wrong paths** in the project.

---

## 1. Routes that exist but are **never linked** (no `Link`/`href`/`push` to them)

These pages exist under `app/(pages)/` but no component in the codebase links to them. Users can only reach them via **direct URL**, **sitemap/SEO**, or **old bookmarks**.

| Route | File | Notes |
|-------|------|--------|
| `/dissertation-writing-services` | `(pages)/dissertation-writing-services/page.tsx` | Only in `metadata.ts` for sitemap; no nav or footer link. |
| `/pricing` | `(pages)/pricing/page.tsx` | Only checked in `MTSidebar` for UI logic; no link from nav/footer/tools. |
| `/class-help` | `(pages)/class-help/page.tsx` | Only in `metadata.ts`; commented in `HideLinks`; no link. |
| `/classhelpdiscount` | `(pages)/classhelpdiscount/page.tsx` | Only in `metadata.ts`; no link. |
| `/write-my-paper` | `(pages)/write-my-paper/page.tsx` | Only in `metadata.ts`; commented in `HideLinks`. Different from `/pay-for-someone-to-write-my-paper`. |
| `/tools/miles-to-millimeters` | `(pages)/tools/miles-to-millimeters/page.tsx` | Tools grid on that page is commented out; no link from `/tools` or tools sidebar. |

**Recommendation:** Either add at least one internal link (e.g. footer, nav, or tools page) if you want to keep them, or remove/redirect them if they are legacy.

---

## 2. Routes **referenced in code but no page exists** (404 / dead)

Code navigates to these paths, but there is **no** `page.tsx` (or equivalent) for them.

| Path | Where referenced | Issue |
|------|------------------|--------|
| `/otp` | `Auth/SignUpCard.tsx` → `route.push("/otp")` | No `app/(pages)/otp/page.tsx`. Sign-up flow redirects to a missing page. |
| `/tools/main-tool` | `AiTools/MTSidebar.tsx` → `href="/tools/main-tool/"`, `router.push("/tools/main-tool?start=1")` | No `app/(pages)/tools/main-tool/page.tsx`. Results in 404. |

**Recommendation:** Either add the missing pages or change the code to redirect to an existing route (e.g. `/sign-in` or `/tools`).

---

## 3. Config / path **typos or wrong route names**

| In config / code | Actual route (if different) | Notes |
|------------------|-----------------------------|--------|
| `privacy-policy` (e.g. in old tailwind `content`) | **`/privacy`** | Real page is `(pages)/privacy/page.tsx` → `/privacy`. No `privacy-policy` folder. |
| `essat-too-writing` (e.g. in old tailwind `content`) | **`/essay-writing`**? | No folder `(pages)/essat-too-writing/`. Likely typo for essay-writing. |
| `/blog` | **External only** | No `(pages)/blog/page.tsx`. Footer/NavBar link to `https://scholarlyhelp.com/blog/` (external). |
| `/faq` | **No standalone page** | No `(pages)/faq/page.tsx`. FAQ is a component used on other pages; no dedicated `/faq` route. |

---

## 4. Summary

- **Never linked (6):**  
  `dissertation-writing-services`, `pricing`, `class-help`, `classhelpdiscount`, `write-my-paper`, `tools/miles-to-millimeters`
- **Dead (2):**  
  `otp`, `tools/main-tool`
- **Typos/wrong names (2):**  
  `privacy-policy` → use `privacy`; `essat-too-writing` → likely `essay-writing` or remove.

If you want to reduce maintenance, you can remove or redirect the never-linked and dead routes, and fix the typos in config (e.g. tailwind `content`) to match the real routes above.
