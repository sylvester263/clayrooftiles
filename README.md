# Clay Roof Tiles — storefront (clayrooftiles.com.pk)

Front end only. It reads the **same Supabase database** as pakclay.com, and all content is managed in the
**pakclay.com admin** (any `/admin` URL on this site forwards there). Products, categories, lifestyle tiles,
trending tiles, blog posts and videos added in that admin show up here automatically.

## Design
- Home page modeled on stile.com.pk: full-screen hero slider under a transparent header, royal-blue
  "Explore Spaces" band, edge-to-edge category panels, dark "Our Collections" carousel, showrooms,
  smart tools, blue "Guides & Downloads" band.
- Inner pages modeled on rhoback.com: navy announcement bar, white sticky header, column mega menu,
  uppercase page titles, subcategory photo tiles, sticky Filter/Sort toolbar with a collapsible filter
  sidebar, quiet product cards, product page with option boxes and a full-width "Get a Sample" button,
  footer trust strip.
- Palette (src/index.css :root): royal blue #0A4595, navy ink #1B2540, clay accent #B5532E.
- Fonts: Google Sans (body/UI), Gilroy ExtraBold (big home headlines).

## Run
    npm install
    npm run dev        # http://localhost:5173
    npm run build && npm start   # production (Express server in server/, serves AI chat too)

`.env` uses the same Supabase URL/keys as pakclay.com. Set `SITE_URL=https://clayrooftiles.com.pk`
on the host so canonical URLs, sitemap and robots.txt use this domain.
