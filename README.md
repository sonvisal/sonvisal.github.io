# sonvisal.github.io

Personal portfolio of **Visal Son** — Manager BA, payments & banking systems, Phnom Penh, Cambodia.

Live site: https://sonvisal.github.io/

## What this repository is

This repo contains the **built, deployable output** of a React single-page app, served by GitHub Pages from the repository root. It does **not** contain the source code.

```
.
├── index.html          # HTML shell: SEO/Open Graph meta, fonts, mounts #root
├── robots.txt, sitemap.xml, 404.html   # SEO files
├── favicon.svg         # site icon
├── img/                # banner.webp (page banner), og.jpg (1200x630 link preview)
├── framebust.js        # clickjacking mitigation (GitHub Pages cannot send frame headers)
├── fonts/              # self-hosted Inter, Space Grotesk, IBM Plex Mono (latin, 400/500/600) + fonts.css
└── assets/
    ├── index-*.js      # compiled React bundle (all content lives here)
    └── index-*.css     # compiled Tailwind CSS
```

The app was built with React, Vite and Tailwind CSS. All page content (profile, experience, skills, education, contact) is data inside the JavaScript bundle.

## Editing content

Edit the **source project** (the Vite project that has `src/`), then rebuild and copy the output here. Do not hand-edit the files in `assets/` for lasting changes: the filenames contain content hashes and every rebuild overwrites them.

Keep these `index.html` customisations in the source project's root `index.html` so a rebuild does not lose them:

- Title, description, canonical, robots, Open Graph and Twitter tags, and the JSON-LD (schema.org Person/WebSite) block
- `theme-color` / `color-scheme` and the inline background colour (prevents a flash before the CSS loads)
- Content-Security-Policy meta tag (no third-party origins are allowed)
- Self-hosted fonts: `fonts/fonts.css` link and font preload (no Google Fonts)
- SVG favicon link and the `<noscript>` fallback

Also set `base: './'` in `vite.config` so asset paths stay relative.

## Deploying

1. Build the source project (`npm run build`).
2. Replace `index.html` and `assets/` in this repo with the new build output (keep `favicon.svg`, or put it in the source project's `public/` folder).
3. Commit and push to the default branch. GitHub Pages publishes it.

## Icons

Icons are inlined [Bootstrap Icons](https://icons.getbootstrap.com/) (v1.13.2) SVGs, so no icon font or extra request is needed. In the source project, install `bootstrap-icons` and use it instead of `lucide-react`.

## Review notes

Known points to address in the source project:

- **No source in this repo.** Content changes made directly to the bundle are lost on the next build.
- **Single-page, JS-only rendering.** Crawlers that do not run JavaScript only see the `<noscript>` text. Prerendering would improve SEO and link previews.
- **No `og:image`.** Add a 1200×630 image and tag so shared links show a preview.
- **Stale wording.** The Profile paragraph still describes a "senior software engineer", and the Senior Software Engineer role has no end date.
- **Contact details are public** (email and phone in the bundle). Remove them if you do not want that.

## SEO

- `robots.txt` and `sitemap.xml` are at the site root; update `lastmod` in the sitemap when content changes.
- After the site is live, add it in Google Search Console (and Bing Webmaster Tools), verify ownership, and submit `https://sonvisal.github.io/sitemap.xml`. Ownership verification needs a token only you can get.
- Email and phone are deliberately left out of the structured data.

## Security notes

- A CSP meta tag restricts the page to same-origin scripts, fonts and images. If you add an external service or link target, update the policy in `index.html`.
- Any link that opens in a new tab must use `rel="noopener noreferrer"`.
- Run `npm audit` in the source project and rebuild when dependency fixes land (the bundle uses React 18.3.1).
- Email and phone are public by design; the bundle splits them into pieces to deter simple scrapers, which does not stop determined ones.

## License

© Visal Son. All rights reserved.
