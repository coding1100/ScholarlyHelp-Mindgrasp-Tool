# CSS Used on "/" (Home) Page

This document lists **Tailwind utilities**, **custom CSS classes**, and **responsive breakpoints** used by components that render on the home route.

**Tailwind config:** `tailwind.config.ts` `content` uses globs so the CSS bundle includes styles for "/" and all listed routes: `./app/(pages)/**/*.{tsx,jsx}` (every (pages) route and local components) and `./app/components/**/*.{tsx,jsx}` (LandingPage, AiLandingPage, AiTools, Hero, OtherLandingPages, Auth, Form, Footer, etc.). AiLandingPage and AiTools live under `app/components/`, not `app/(pages)/`.

---

## 1. Components on "/"

| Source | Components |
|--------|------------|
| **Layout** | `layout.tsx`, `MainLayout.tsx`, `page.tsx` |
| **Above fold** | `HeroSection`, `HeroLead`, `HeroRight`, `HeroForm`, `Header` (AppNav) |
| **Below fold** | `BelowFoldLanding`, `Ratings`, `CardCarousel`, `Description`, `GuaranteedBlock`, `WhySlider`, `CustomerReviews`, `ProcessSection`, `Success`, `AcademicPartners`, `GetQoute`, `Faq` |
| **Shell** | `Footer`, `WhatsApp`, `CookieBanner`, `AuthProvider` |

---

## 2. Tailwind Utility Classes (by category)

### Layout & display
- `flex`, `hidden`, `block`, `grid`
- `flex-col`, `flex-row`, `flex-wrap`, `items-start`, `items-center`, `items-end`, `justify-center`, `justify-between`, `justify-around`
- `grid-cols-1`, `grid-cols-2`, `grid-cols-3`, `grid-cols-12`
- `md:grid-cols-12`, `mid:col-span-3`, `mid:col-span-4`, `mid:col-span-5`, `md:col-span-6`
- `relative`, `absolute`, `fixed`, `sticky`
- `inset-0`, `inset-x-0`, `top-0`, `top-full`, `bottom-0`, `left-0`, `right-0`, `-left-[80px]`, `-top-10`, `-top-20`, `top-[130px]`, `top-[300px]`, `left-28`, `right-[50px]`, `top-[15px]`
- `z-0`, `z-[9]`, `z-10`, `z-20`, `z-40`, `z-50`, `z-[99]`, `z-[999]`, `z-[9999]`, `-z-[1]`, `-z-[999]`
- `overflow-auto`, `overflow-hidden`, `overflow-visible`
- `mx-auto`, `self-start`, `self-end`, `md:self-end`

### Spacing
- `gap-1`, `gap-2`, `gap-3`, `gap-4`, `gap-5`, `gap-6`, `gap-8`, `gap-10`, `gap-12`
- `space-x-1`, `space-x-2`, `space-y-1`
- `p-3`, `p-4`, `p-5`, `p-6`, `px-4`, `px-6`, `px-8`, `px-10`, `py-2`, `py-3`, `py-4`, `py-5`, `py-6`, `py-10`, `py-14`, `pt-2`, `pt-3`, `pt-9`, `pb-2`, `pb-3`, `pb-4`, `pb-14`, `pl-3`, `pr-3`, `mr-1`, `ml-2`, `ml-8`, `ml-10`
- `m-0`, `mx-auto`, `my-2`, `my-6`, `my-10`, `mt-1`, `mt-2`, `mt-3`, `mt-4`, `mt-6`, `mt-8`, `mt-10`, `mb-2`, `mb-3`, `mb-4`, `mb-8`, `mb-9`, `mb-10`, `mb-11`, `mb-12`
- `max-[768px]:px-3`, `max-[768px]:px-6`, `max-[1320px]:px-8`, `!pt-[30px]`, `!pt-[100px]`, `pb-[100px]`, `py-[30px]`, `px-[24px]`, `px-[25px]`, etc.

### Sizing
- `w-full`, `w-5`, `w-6`, `w-8`, `min-w-[22px]`, `min-w-[28px]`, `min-w-[29px]`, `min-w-[32px]`, `min-w-[44px]`, `min-w-[142px]`, `max-w-xs`, `max-w-7xl`, `max-w-[32px]`, `max-w-[50px]`, `max-w-[58px]`, `max-w-[70px]`, `max-w-[142px]`, `max-w-[260px]`, `max-w-[300px]`, `max-w-[372px]`, `max-w-[450px]`, `max-w-[600px]`, `max-w-[740px]`, `max-w-3xl`, `max-w-32`
- `h-5`, `h-6`, `h-7`, `h-8`, `h-12`, `h-[20px]`, `h-[22px]`, `h-[32px]`, `h-[40px]`, `h-[50px]`, `h-[54px]`, `h-[65px]`, `h-[150px]`, `h-[330px]`, `h-[350px]`, `h-[400px]`, `min-h-[44px]`, `min-h-[64px]`, `min-h-[100px]`, `min-h-[150px]`, `max-h-[70px]`, `max-h-[400px]`, `max-h-fit`, `max-h-0`
- `sm:h-8`, `sm:w-8`, `sm:h-18`, `md:h-[32px]`, `md:min-w-[32px]`, `md:w-10`, `md:max-w-[70px]`, etc.
- `max-[430px]:w-[130px]`, `max-[430px]:h-[130px]`, `max-[768px]:w-[373px]`, `max-[768px]:h-[385px]`, `max-[768px]:h-[50px]`, etc.

### Typography
- `text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`, `text-3xl`, `text-[12px]`, `text-[14px]`, `text-[15px]`, `text-[16px]`, `text-[19px]`, `text-[21px]`, `text-[30px]`, `text-[42px]`
- `font-light`, `font-medium`, `font-semibold`, `font-bold`
- `leading-5`, `leading-6`, `leading-[1.5]`, `leading-[1.1]`
- `text-center`, `text-start`
- `text-black`, `text-white`, `text-gray-600`, `text-gray-700`, `text-gray-800`, `text-gray-900`, `text-primary-400`, `text-primary-600`, `text-[#1E1E1E]`, `text-[#263238]`, `text-[#555B66]`, `text-[#6A6F7A]`, `text-[#6B7280]`, `text-[#7d7d7d]`, `text-[#111318]`, `text-[#171717]`, `text-[#1e1e1e]`, etc.
- `uppercase`, `tracking-wider`, `tracking-[4px]`
- `placeholder:text-[#6B7280]`, `placeholder:text-[#9CA3AF]`, `placeholder-[#9CA3AF]`

### Backgrounds & borders
- `bg-white`, `bg-gray-100`, `bg-gray-200`, `bg-primary-200`, `bg-primary-500`, `bg-secondary-500`, `bg-[#F5F6FA]`, `bg-[#EDEFFE]`, `bg-[#F2F3F8]`, `bg-[#F9FBFF]`, `bg-[#D3D4F7]`, `bg-[#9F92EC1A]`, `bg-transparent`, `bg-white/80`
- `border`, `border-2`, `border-l`, `border-t`, `border-transparent`, `border-[#E9E9F1]`, `border-[#E3E5F3]`, `border-[#DCDCDC]`, `border-[#c7c7c7]`, `border-gray-200`, `border-secondary-500`
- `rounded-full`, `rounded-md`, `rounded-lg`, `rounded-[5px]`, `rounded-xl`
- `shadow-sm`, `shadow-lg`, `shadow-[0px_0px_31.8px_0px_#00000012]`

### Effects & transitions
- `opacity-50`, `opacity-0`
- `transition`, `transition-all`, `transition-colors`, `transition-transform`, `transition-opacity`, `duration-200`, `duration-300`, `duration-500`, `ease-in-out`
- `hover:bg-white`, `hover:text-[#ff641a]`, `hover:border-[#ff641a]`, `hover:bg-[#F9FBFF]`, `hover:bg-blue-600`, `hover:underline`, `hover:font-normal`
- `disabled:bg-gray-300`, `disabled:text-gray-500`, `disabled:cursor-not-allowed`, `group-open:rotate-180`, `group-open:max-h-fit`
- `focus:border-[#ff641a]`, `focus-visible:outline`, `focus-visible:outline-2`, etc.
- `object-contain`, `object-cover`
- `-translate-x-1/2`, `-rotate-90`, `rotate-180`

### Responsive (breakpoint prefixes)
- **sm:** – `sm:text-[15px]`, `sm:text-[16px]`, `sm:h-8`, `sm:w-8`, `sm:text-lg`, `sm:h-18`, etc.
- **md:** – `md:flex`, `md:grid-cols-12`, `md:gap-12`, `md:py-14`, `md:col-span-6`, `md:hidden`, `md:block`, `md:flex`, `md:container`, `md:w-10`, `md:text-3xl`, `md:max-w-[70px]`, etc.
- **mid:** – `mid:col-span-3`, `mid:col-span-4`, `mid:col-span-5`
- **lg:** – `lg:text-5xl`, `lg:order-1`, `lg:order-3`, etc.
- **max-[...]:** – `max-[430px]:...`, `max-[450px]:...`, `max-[768px]:...`, `max-[1025px]:...`, `max-[1320px]:...`, `max-[1500px]:...`
- **min-[...]:** – `min-[768px]:hidden`, `min-[768px]:flex-col`, `min-[768px]:min-h-[150px]`, `min-[1000px]:...`, `min-[1100px]:...`, `min-[1150px]:...`, `min-[1200px]:...`, `min-[450px]:...`

### Other utilities
- `cursor-pointer`, `cursor-not-allowed`
- `outline-none`, `resize-none`
- `animate-pulse`
- `flex-shrink-0`, `flex-grow`, `flex-1`
- `divide-y`, `divide-y-1`
- `snap-x`, `snap-mandatory`, `snap-start` (WhySlider)
- `no-scrollbar`, `will-change-scroll` (custom in globals.css but used as class names)

---

## 3. Custom / Global CSS

### From `app/globals.css`
| Class / selector | Purpose |
|------------------|--------|
| `:root` | `--background`, `--foreground` |
| `body` | base background, color, font |
| `*` | font-family |
| `.no-scrollbar` | hide scrollbar |
| `.no-scrollbar::-webkit-scrollbar` | hide webkit scrollbar |
| `.formtwo .cus-img` | hide in form two |
| `.formtwo .cus-div` | z-index, position |
| `.lineAdded::after` | pseudo line |
| `.will-change-scroll` | will-change: scroll-position |
| `.animate-fade-in`, `.animate-fade-in-up`, `.animate-slide-in-left`, `.animate-slide-in-right` | keyframe animations |
| `@keyframes fade-in`, `fade-in-up`, `slide-in-left`, `slide-in-right` | keyframes |
| `@font-face` (slick) | Slick carousel font |

### From `app/components/Footer/footer.css`
- Footer-specific classes (e.g. `.whatsapp-icon-footer`, `.sms-icon-footer`, `.blantershow-sms`, `.sms-chat`, etc.) – used by `Footer` and `WhatsApp`.

### From `app/components/LandingPage/CardCarousel.module.css`
| Class | Purpose |
|-------|--------|
| `.carouselRoot` | Wrapper for carousel (used as `styles.carouselRoot`) |
| `.centerCard` | Center slide purple background |
| `.nonCenterCard` | Off-center slide, hover state |
| `.carouselRoot :global(.slick-dots)` etc. | Slick slider dots/arrows styling |

### Other custom class names (Tailwind-style but custom)
- `cus-img`, `cus-div` – used in HeroForm / HeroSection (also referenced in globals `.formtwo .cus-div`).
- `whatsapp-chat`, `blantershow-chat`, `blantershow-chat2`, `whatsapp-icon-footer`, `chat-text` – WhatsApp component.
- `sms-chat`, `sms-text`, `sms-icon-footer`, `blantershow-sms`, `blantershow-sms2` – Footer / SMS.

---

## 4. CSS Modules Used on "/"

| File | Used by |
|------|--------|
| `CardCarousel.module.css` | `CardCarousel.tsx` (`styles.carouselRoot`, center/non-center card classes) |
| `footer.css` | `Footer.tsx` |
| (ThankYou uses `styles.thankYouRoot` but ThankYou is not on "/") | — |

---

## 5. Responsive Breakpoints in Tailwind Config (used on "/")

Your `tailwind.config.ts` defines:

- `sm: "576px"`
- `md: "768px"`
- `mid: "827px"`
- `lg: "992px"`
- `xl: "1200px"`
- `2xl: "1400px"`

On "/" you use: **sm**, **md**, **mid**, **lg**, plus many **arbitrary** breakpoints: `max-[430px]`, `max-[450px]`, `max-[768px]`, `max-[1025px]`, `max-[1320px]`, `max-[1500px]`, `min-[450px]`, `min-[768px]`, `min-[1000px]`, `min-[1100px]`, `min-[1150px]`, `min-[1200px]`, and `[992px]:...` (arbitrary variant).

---

## 6. Summary

- **Tailwind:** Layout (flex, grid), spacing, sizing, typography, colors, borders, shadows, opacity, transitions, and responsive variants (sm, md, mid, lg, max-[...], min-[...]) are all used on "/".
- **Custom CSS:** `globals.css` (body, no-scrollbar, will-change-scroll, animations, slick font), `footer.css`, and `CardCarousel.module.css` all apply on "/".
- **Font:** Poppins via `layout.tsx` (`className={poppins.variable}` on `<html>`).

If you want to trim the bundle for "/" only, you’d need to either:
- Restrict Tailwind `content` to only the files that render on "/", or
- Use a route-specific CSS approach (e.g. different entry or purging per route).  
Right now Tailwind purges based on all of `./app/**`, so any class used anywhere in `app` is included in the same bundle.
