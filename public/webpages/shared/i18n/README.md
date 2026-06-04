# Delight Pack — Internationalization (i18n)

Shared **react-i18next** resources for all React apps under `public/webpages/`.

## Folder structure

```
shared/i18n/
├── settings.ts          # Locales, RTL config, storage keys
├── routing.ts           # URL locale helpers for Next.js middleware
├── resources.ts         # Aggregated JSON bundles for i18next
├── locales/
│   ├── en/
│   │   ├── common.json
│   │   ├── navigation.json
│   │   └── tally.json
│   ├── ml/              # Malayalam
│   └── ar/              # Arabic (RTL)
└── README.md

shared/components/
├── LanguageSwitcher.tsx # Dropdown + localStorage + cookie
└── LocaleHtmlSync.tsx   # Sets <html lang dir> for RTL
```

## Supported locales

| Code | Language   | Direction |
|------|------------|-----------|
| `en` | English    | LTR       |
| `ml` | Malayalam  | LTR       |
| `ar` | Arabic     | RTL       |

## Routing

- URLs are prefixed: `/en/transactions`, `/ml/products`, `/ar/`
- `src/middleware.ts` in each Next.js app redirects `/` → preferred locale (cookie → `Accept-Language` → `en`).
- Use `useLocalizedPath().href('/transactions')` for locale-aware `Link` targets.

## Adding translations

1. Add keys to `locales/en/<namespace>.json`.
2. Mirror keys in `ml/` and `ar/`.
3. Register new namespaces in `settings.ts` (`I18N_NAMESPACES`) and `I18nProvider` init.

## RTL (Arabic)

- `LocaleHtmlSync` sets `dir="rtl"` on `<html>`.
- Prefer Tailwind **logical** utilities: `ms-*`, `me-*`, `ps-*`, `pe-*`, `text-start`, `text-end`, `border-s`, `border-e`.
- Optional variants: `rtl:…` / `ltr:…` when needed.

## Language switcher

`<LanguageSwitcher />` persists to:

- `localStorage` key: `delight-pack-locale`
- Cookie: `delight-pack-locale` (for SSR/middleware)
