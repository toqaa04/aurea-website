# AUREA Advisory Group — Website

A static homepage built with plain HTML, CSS and JavaScript. It needs no frameworks and no build step.

## Files

| File / folder | What it is |
|---|---|
| `index.html` | The homepage: header, hero, disciplines & services (tabs), about us, contact, footer |
| `styles.css` | All styling: AUREA colours, Fraunces/Archivo type scale, layout, mobile breakpoints |
| `script.js` | Interactions: mobile menu, "Our services" dropdown, discipline tabs, contact form |
| `images/` | Logos, photos, partner and membership logos |
| `fonts/` | Fraunces and Archivo (SIL Open Font License), self-hosted, so no Google Fonts requests |

## Preview locally

Double-click `index.html`, or run a small local server in this folder:

```
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Go live

Upload the whole folder to your web host's public directory (often `public_html` or `htdocs`), or drag it into a static host such as Netlify. Point aurea-advisory.de at it.

## Before launch: still to do

1. **Contact form backend.** `script.js` (search for `TODO (go-live)`) shows a thank-you message but does not send anything yet. Connect it to a PHP mail script on your host or to a form service.
2. **Imprint and Privacy Policy pages.** These are legally required in Germany. The footer links currently point to the top of the page.
3. **Privacy consent text** in the contact form: replace `[Privacy consent text — to be supplied]`.
4. **Street address** and **map** in the contact section: replace `[Street address]` and the map placeholder. A static map image avoids needing cookie consent.
5. **Auditi platform link** in the Audit tab: the button currently has `href="#"`.
6. **Careers**: the menu item is a placeholder button with no page yet.
7. Optional: higher-resolution versions of the Auditi and membership logos (the current ones were cut from screenshots).

## Editing tips

- Brand colours appear as hex values in `styles.css`: Navy `#1C2E52`, Gold `#FFB800`, Midnight `#2E3F60`, Paper `#F6F1E7`, Mist `#DDE1EC`, Ink `#2A2A36`, Royal `#3857AA`, Bronze `#8A5F00`.
- Each discipline's content is a `<div class="tab-panel" data-panel="…">` block in `index.html`; edit the text there.
- Section markers such as `<!-- ==================== CONTACT ==================== -->` help you find each part of the page.
