# Site documentation: `index.html` and theming

This covers how the page shell in [index.html](index.html) is put together and how the color-theme switcher works. For deployment and rebuild steps, see [README.md](README.md).

## 1. How the page loads

The site is a built React + Vite + Tailwind single-page app hosted on GitHub Pages. `index.html` is only a shell. All visible content is rendered into `<div id="root">` by the bundle `assets/index-C1UOuWts.js`.

Load order inside `<head>`:

| Order | File | Purpose |
|---|---|---|
| 1 | `fonts/fonts.css` | Self-hosted Inter, Space Grotesk and IBM Plex Mono (no Google Fonts) |
| 2 | `theme.css` | Color variables for every theme, plus the theme-picker styles |
| 3 | inline `<style>` | Paints the page background early so there is no flash before the main CSS arrives |
| 4 | `framebust.js` | Clickjacking protection (GitHub Pages cannot send frame headers) |
| 5 | `theme.js` | Applies the saved theme immediately, then builds the picker button |
| 6 | `assets/index-mqbPu1-u.css?v=2` | Compiled Tailwind CSS (colors are CSS variables) |
| 7 | `assets/index-C1UOuWts.js` | The React bundle (`type="module"`) |

`theme.js` runs before the bundle so the correct theme is set before first paint.

## 2. What `index.html` contains

- **SEO:** `<title>`, description, keywords, canonical URL, `robots` (index, follow).
- **Social previews:** Open Graph and Twitter Card tags. The preview image is `img/og.jpg` (1200×630).
- **Structured data:** a JSON-LD block (schema.org `WebSite` and `Person`) describing Visal Son, the employer, location and schools.
- **Browser UI:** `theme-color` and `color-scheme` meta tags. `theme.js` updates both when the theme changes.
- **Security policy:** a Content-Security-Policy meta tag (see section 5).
- **`<noscript>` fallback:** a short text profile for visitors without JavaScript.

## 3. Theme system

### Variables

Colors are CSS custom properties holding space-separated RGB channels, so Tailwind-style opacity still works, for example `rgb(var(--signal) / .8)`.

| Variable | Used for |
|---|---|
| `--ink` | Page background |
| `--panel` | Card and panel background |
| `--paper` | Main text color |
| `--dim` | Secondary text |
| `--signal` | Accent: buttons, links, borders, highlights |
| `--signal-dark` | Accent hover state |

Themes are defined in [theme.css](theme.css). Forest is the default and lives on `:root`. The others are `[data-theme="..."]` blocks.

| Theme | Accent | Background |
|---|---|---|
| Forest (default) | green `#2d5a27` | light |
| Ocean | blue `#1d4ed8` | light |
| Violet | purple `#6d28d9` | light |
| Sunset | orange `#c2410c` | light |
| Dark | green `#4ab156` | dark `#0f1419` |

A few inline SVG shapes in the bundle use fixed colors (for example `stroke="#2D5A27"`). `theme.css` overrides them with attribute selectors such as `svg [stroke="#2D5A27"]` so they follow the theme. The amber dot in the hero diagram (`#E8A33D`) is deliberately left fixed.

### Picker behavior ([theme.js](theme.js))

1. On load it reads `localStorage["theme"]`. If the value is not one of the five known names, it falls back to Dark when the device prefers dark mode, otherwise Forest.
2. It sets `data-theme` on `<html>` (Forest removes the attribute), then updates the `theme-color` and `color-scheme` meta tags.
3. When the page is ready it adds a fixed palette button at the bottom-right. Clicking it opens a row of swatches. Clicking a swatch applies the theme and saves it. Clicking outside the picker or pressing Escape closes it.
4. All `localStorage` access is wrapped in `try/catch`, so the site works when storage is blocked. The theme then just doesn't persist.

### Adding or changing a theme

1. In `theme.css`, add a block with all six variables:
   ```css
   [data-theme=rose]{--ink:253 247 248;--panel:250 235 238;--paper:50 20 28;--dim:112 85 92;--signal:190 24 93;--signal-dark:131 24 67}
   ```
2. In `theme.js`, add a line to `THEMES`: `['rose', 'Rose', '#be185d', '#fdf7f8']`. The fields are id, label, accent color (swatch) and background color (swatch and `theme-color`).
3. Bump the `?v=` number on the CSS link in `index.html` if you also change the bundle CSS, so browsers don't serve a cached copy.

### Rebuild warning

The source project is not in this repo. The conversion of hardcoded colors to variables was made directly in `assets/index-mqbPu1-u.css`, so **a rebuild from source will overwrite it** and the themes will stop working for the bundle's own styles. To keep it, make the same change in the source project's Tailwind config: define the colors as `rgb(var(--ink) / <alpha-value>)` and so on. Also keep the `theme.css` and `theme.js` links in the source `index.html`.

## 4. Other files at the repo root

| File | Purpose |
|---|---|
| `404.html` | Not-found page |
| `robots.txt`, `sitemap.xml` | Crawler rules and sitemap |
| `favicon.svg` | Site icon |
| `img/banner.webp`, `img/og.jpg` | Hero banner and link-preview image |
| `fonts/` | Font files, their licenses and `fonts.css` |
| `tech_flow.md` | Separate note on a Vue + Spring Boot deployment plan; not part of this site |

## 5. Security notes

- **CSP:** `default-src 'self'`, `script-src 'self'`, `font-src 'self'`, `img-src 'self' data:`, `connect-src 'self'`, `object-src 'none'`, `base-uri 'none'`, `form-action 'none'`. Style allows `'unsafe-inline'`, which the inline background rule and the picker's swatch styling rely on.
- **Consequence for new code:** scripts must be separate files served from this site. Inline `<script>` blocks, other than the JSON-LD data block, and third-party CDNs will be blocked.
- **Theme input:** the only external input to the picker is the saved `localStorage` value. It is checked against the fixed list of theme names before use.
- **Clickjacking:** handled by `framebust.js`.

## 6. Local testing

The site is static, so any static file server works (browsers block some features on `file://`):

```bash
npx serve .
```

Open the page at laptop width (about 1366px) and mobile width (about 390px). Check that nothing scrolls sideways, that each theme looks right, and that the chosen theme survives a reload.
