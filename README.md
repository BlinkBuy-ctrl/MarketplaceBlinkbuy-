# Market Hub Malawi 🇲🇼

A modern, mobile-first marketplace for buying and selling locally across all 28 districts of Malawi — rebranded and upgraded from the original BlinkBuy codebase.

## What's new in this upgrade

- **Rebrand**: BlinkBuy → **Market Hub Malawi**, with a brand-new storefront/"MH" monogram logo (`public/icon.svg`) used across the splash screen, header, PWA icons, and metadata.
- **Pink & Black design system**: dark background (`#0F0F0F` / `#1C1C1C`), hot pink accent (`#FF2D8D`), light pink secondary (`#FF6FAE`), white text on dark — pink is reserved for highlights only (buttons, prices, active states, badges).
- **Smart search** (`src/components/SmartSearchBar.tsx`): autocomplete across products, categories, brands, and all 28 Malawi districts, plus recent searches (saved locally) and trending searches, with a lightweight "Did you mean…" correction when nothing matches. Used on both the homepage hero and the marketplace search bar.
- **Admin Dashboard** (`/admin`): overview stats, category breakdown, estimated marketplace value, a listings moderation table (feature/unfeature, remove, view), a sellers directory, and a reports tab — all running on local demo data, ready to wire up to a real backend.
- Guest-based marketplace — **no login required**, exactly as before.

## Already in the codebase

The original build already included most of the requested marketplace features: multiple images per listing, MWK pricing, condition tags, district-based locations, WhatsApp & call-seller buttons, share to WhatsApp/Facebook, save/favorite items, onboarding tour, PWA install support, and more. This upgrade focuses on branding, the new color system, smarter search, and the admin dashboard layered on top.

## Getting started

```bash
npm install
npm run dev      # local dev server
npm run build    # production build → dist/
```

## Deploying

This is a static Vite + React app — push to GitHub and deploy directly on Vercel, Netlify, or any static host (a `vercel.json` is already included).

## Project structure

```
src/
  components/   Layout, SmartSearchBar, SplashScreen, etc.
  pages/        home, marketplace, marketplace-detail, post-item, settings, admin
  lib/          mockData.ts (items, categories, districts, brands), utils.ts
public/
  icon.svg      Market Hub Malawi logo
  manifest.json PWA manifest
```

## Next steps / future ideas

- Wire the admin dashboard and listings to a real database/API.
- Add Chichewa language support alongside English.
- Add seller verification workflow and a public seller profile page.
- Hook up the report-listing button to the admin "Reports" tab.
