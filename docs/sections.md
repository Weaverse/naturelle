# Naturélle section guide

This guide explains how to compose Naturélle pages in Weaverse Studio. It is
written for merchants, implementers, and developers who do not work on the
theme every day.

The registry in `app/weaverse/components.ts` and the schemas in `app/sections`
are the technical source of truth. In this guide, **required** means required
for a useful published result, even if Studio allows an empty value. Settings
not listed as required are optional or have a usable preset/default.

## Quick start in Weaverse Studio

1. Open the correct page or template before adding sections. Template-bound
   sections only work with their matching Shopify route data.
2. Add the top-level section first, then add or reorder blocks inside it. A
   Slide, Hotspot item, Timer, FAQ item, or Product item is not a standalone
   page section.
3. Start from the Naturélle preset, select Shopify resources, and replace all
   placeholder content and media.
4. Preview at approximately **390–430 px**, **768–834 px**, and **1440 px**.
5. Test every link, slider, filter, hotspot, form, and product action in the
   storefront preview before publishing.

Studio publishing and code deployment are separate. Studio publishes content
for the current `WEAVERSE_PROJECT_ID`; a code or schema change must also be
deployed to the storefront.

## Content and media standards

Naturélle uses responsive Shopify images. The sizes below are recommendations,
not upload validation rules. Match the source ratio to the selected Studio
ratio and use the largest clean source available.

| Use | Recommended source | Guidance |
| --- | --- | --- |
| Image hero or slideshow | 2400 × 1600 px, 3:2 | The same image is cropped across viewports. Keep faces, products, and text-safe space near the center. |
| Video hero | 1920 × 1080 px, 16:9 | MP4/WebM is preferred. Keep essential copy in Studio blocks, not burned into video frames. |
| Promotion grid | 1600 × 900 px, 16:9 | Both collection images should share color treatment and subject scale. |
| Collection or product square | 1600 × 1600 px, 1:1 | Use a consistent background, crop, and product scale across a grid. |
| Portrait card | 1200 × 1600 px, 3:4 | Best for editorial portraits and tall product photography. |
| Landscape/editorial card | 1600 × 1200 px, 4:3 | Suitable for blog cards, image-with-text, stores, and brand stories. |
| Before/after pair | Matching 1600 × 1200 px files, 4:3 | Use identical dimensions, crop, camera position, lighting, and subject scale. |
| Hotspot image | 1800 × 1800 px, 1:1 | Mobile renders the image square. Keep tagged products away from the outer 10% of the frame. |
| Testimonial background | 1600 × 2000 px, 4:5 | Provide enough negative space for the review panel and rating overlay. |
| Instagram tile | 1200 × 1200 px, 1:1 | Use a consistent visual grade; links should point to the matching post. |
| Icon | Optimized SVG or transparent PNG | Keep icons simple and legible at approximately 40–80 px. |

Copy recommendations:

- Use one message per section. Headings should normally fit in one or two
  desktop lines and no more than three mobile lines.
- Keep campaign headings to roughly 3–10 words, supporting copy to 15–40 words,
  and CTA labels to 1–3 words.
- Use a short eyebrow/subheading for context, not as a second headline.
- Describe a customer benefit, routine, ingredient, or outcome instead of
  repeating the product or collection title.
- Use substantiated language for clinical results and before/after claims.
- Add meaningful alt text to Shopify media. Do not place essential text inside
  an image or video.
- Use real destinations. Do not publish placeholder links, `#`, or demo copy.

## Section usage overview

| Studio section | Purpose | Primary data/blocks | Recommended pages |
| --- | --- | --- | --- |
| Image banner | Static campaign or brand hero | Background image, overlay, text, CTA | Home, landing, editorial |
| Video banner | Motion-led hero | Video, overlay, text, CTA | Home or campaign landing |
| Slide show banner | Multiple campaign messages in one hero | Slide blocks | Home or campaign landing |
| Slides | Split-image brand or education carousel | Slide → heading/paragraph | Home, PDP support, editorial |
| Collections | Curated collection carousel | Selected Shopify collections | Home or landing |
| Featured products | Product carousel/list | Heading, Featured products list | Home, landing, PDP cross-sell |
| Product grid | One collection feature plus product grid | Heading, Product grid list | Home or collection campaign |
| Product placement | Manually composed shop-the-look products | Copy, Items → Product | Home, editorial, landing |
| Promotion grid | Two collection campaign cards | Two Shopify collections | Home or landing |
| Single product | Standalone purchasable product feature | Product, optional Judge.me summary | Home, editorial, landing |
| Hotspots | Shoppable image with product markers | Image hotspots → Hotspot item | Home, routine or editorial page |
| Image with text | Brand, ingredient, or routine story | Content and Image blocks | Any content page |
| Product details | Long-form product education | Benefits, story, ingredients, use, results, badges | PDP, product campaign |
| Before & after | Visual result comparison | Heading and Slider | PDP support, results landing |
| Testimonials | Social proof with product/review context | Product, background image, Judge.me data | Home, landing, PDP support |
| Highlights | Three or four concise benefits | Heading, List items → Highlight | Home, service, collection |
| FAQs | Customer-service card and FAQ links/items | FAQ item blocks | Home, FAQ, service page |
| Countdown | Genuine time-limited promotion | Text, Timer, CTA | Home or campaign landing |
| Scrolling Text | Short announcement/value ticker | Text and motion settings | Home or campaign landing |
| Instagram | Social proof/gallery rail | Instagram post blocks | Home or editorial |
| Newsletter | Email acquisition | Icon, heading, paragraph, input | Home, landing, editorial |
| Map | Store/location information | Map item blocks | Store or contact content |
| Blogs | Feed from a selected Shopify blog | Blog selector and heading | Home, landing, editorial index |
| Spacer | Deliberate spacing or separator | Responsive height | Any composed page |
| Collection banner | Current collection introduction | Collection data or overrides | Collection template only |
| Collection filters | Filter, sort, and product results | Current Shopify collection | Collection template only |
| Collection list | Shopify collection index | Collection list block | Collection-list template only |
| All products | Paginated all-products grid | Current all-products data | All-products template only |
| Product information | Complete PDP purchase area | Current Shopify product | Product template only |
| Judge.me Reviews | Full review list and submission form | Review index block | Product template only |
| Blog post | Current Shopify article body | Current article | Article template only |
| Related articles | More content from the current blog | Current article/blog | Article template only |
| Page | Native Shopify page body | Current page | Page template only |
| Search results | Search/filter result grid | Current search query | Custom search page only |
| Contact us | Weaverse mail-backed contact form | Heading, fields, submit button | Homepage/`INDEX` only in current schema |
| Style guide | Internal visual test component | Test text | Development only; do not publish |

## Shared and structural blocks

Add these through their parent section's block list. Do not insert structural
blocks as standalone page content.

| Block | Parent | Purpose and important settings |
| --- | --- | --- |
| Heading | Many sections | Semantic heading content, HTML level, responsive size, weight, color, alignment. Keep one page-level `h1`. |
| Subheading | Banner, countdown, image-with-text, product placement | Short eyebrow/context label; configure tag, size, weight, color, and alignment. |
| Paragraph | Many sections | Supporting content, HTML tag, width, size, color, and alignment. |
| Button | Banners and content groups | CTA text, URL, target, variant, shape, and optional custom/hover colors. |
| Slide show Slide | Slide show banner | Background image/fit/position, overlay, content position, layout, and text/CTA children. |
| Slides Slide | Slides | Split-layout background image, image/text alignment, colors, icon, animation, and heading/paragraph children. |
| Image | Image with text | Image, ratio, width, radius, and object fit. |
| Content | Image with text | Alignment and padding; contains subheading, heading, paragraph, and button. |
| Featured products list | Featured products | Product collection/list, item count, ratings, price, detail link, arrows, and numbering. |
| Product grid list | Product grid | Collection, campaign eyebrow/heading/CTA, product badges, ratings, and count. |
| Product placement Items | Product placement | Products per row, thumbnail ratio, gap; becomes a one-item-at-a-time slider on mobile. |
| Product placement Product | Product placement Items | Required manual image and Shopify product selection. |
| Image hotspots | Hotspots | Required lifestyle image and ratio; accepts Hotspot item blocks. |
| Hotspot item | Image hotspots | X/Y position, icon, copy, required product, badge/rating/price/detail-link settings. |
| Highlight List items | Highlights | Items per row, gap, and border color; contains Highlight blocks. |
| Highlight | List items | Mobile visibility, icon color, heading, and paragraph. |
| Before/after Slider | Before & after | Required matching before/after images, separator, arrows, and desktop/mobile heights. |
| Instagram post | Instagram | Required image; post link is strongly recommended. |
| Map item | Map | Title, full map-searchable address, and opening-hours/contact paragraph. |
| FAQ item | FAQs | Question or paragraph mode, display text, and target link. |
| Timer | Countdown | Required end date/time and timer text color. |
| Newsletter icon | Newsletter | Optional icon image and display size. |
| Newsletter input | Newsletter | Placeholder, submit label, and button style. |
| Judge.me summary | Product information or Single product | Displays rating/review count when Judge.me is configured; no editable settings. |
| Judge.me Review index | Judge.me Reviews | Review list position, headings, form copy, button text, and empty state. |
| Collection list block | Collection list | Collections per row and image lazy loading. |
| Product detail Benefits | Product details | Heading and concise benefits description. |
| Product detail Story | Product details | Eyebrow, heading, rich text, image, and image position. |
| Product detail Key ingredients | Product details | Heading/description and ingredient name/description entries. |
| Product detail How to use | Product details | Heading and three short ordered steps. |
| Product detail Clinical results | Product details | Three result/statistic entries defined in the block. |
| Product detail Product badges | Product details | Up to three short product claims/badges. |

### Parent and child composition map

```text
Image banner
└── Subheading / Heading / Paragraph / Button

Slide show banner
└── Slide
    └── Subheading / Heading / Paragraph / Button

Slides
└── Slide
    └── Slides Heading / Slides Paragraph

Image with text
├── Content
│   └── Subheading / Heading / Paragraph / Button
└── Image

Featured products
├── Heading
└── Featured products list

Product grid
├── Heading
└── Product grid list

Product placement
├── Subheading / Heading / Paragraph
└── Items
    └── Product

Hotspots
└── Image hotspots (maximum 2)
    └── Hotspot item

Highlights
├── Heading
└── List items
    └── Highlight

Before & after
├── Heading
└── Slider

Countdown
└── Heading / Subheading / Timer / Button

Newsletter
└── Icon / Heading / Paragraph / Input

FAQs / Instagram / Map
└── FAQ item / Instagram post / Map item

Product details
└── Benefits / Story / Key ingredients / How to use /
    Clinical results / Product badges

Judge.me Reviews
└── Heading / Paragraph / Judge.me Review index
```

## Section guidance

### Campaign, hero, and motion sections

| Section | Required and optional settings | Media/copy guidance | Mobile and usage notes |
| --- | --- | --- | --- |
| **Image banner** | Required: background image and useful text. Optional: height, background fit/position, overlay, content position, padding, CTA. | Use a high-resolution 3:2 image with centered focal content. Add an overlay whenever text contrast changes across the crop. Use one heading, one short paragraph, and one CTA. | Uses the same image on mobile and desktop; `cover` can crop both sides heavily. Check every focal point at 390 px. Best as the first section, normally once per page. |
| **Video banner** | Required: uploaded video or external URL. Optional: preset/custom desktop and mobile heights, overlay, spacing, text/CTA blocks. The text URL takes priority over the uploaded video field. | Prefer 16:9 muted, loop-safe video without embedded essential copy. Keep the clip short and compress it for web delivery. | Autoplays muted and plays inline; it expands/crops to fill the chosen height. Use a stronger overlay for bright/mixed footage and provide meaningful nearby copy. Avoid stacking it with another autoplay hero. |
| **Slide show banner** | Required: at least one Slide with background media. Optional: height, autoplay interval, loop, arrows, dots, colors/positions. Each Slide controls its own image, crop, overlay, content position, and CTA. | Use two or three slides with the same source ratio and visual tone. Each slide should communicate one campaign only. | Height changes by viewport. Test text against every slide crop. Do not rely on autoplay alone: keep dots or arrows when there is more than one slide. |
| **Slides** | Required: Slide blocks with image and useful text. Optional: section height/width, icons, image alignment, text alignment/colors, icon, image animation. | Use square or 4:3 editorial images and short educational copy. This is for storytelling, not a primary hero. | Image and content stack as square panels on mobile and become a split layout from tablet widths. Keep all slides similar in length to avoid layout jumps. |
| **Countdown** | Required: Timer end date/time. Optional: heading, subheading, CTA, width, layout, alignment, radius, gap, padding, colors. | State the actual event and terms: launch date, sale end, or registration deadline. Avoid false scarcity. | Complex horizontal layouts collapse/center on smaller screens. Remove or update expired campaigns immediately. Keep the CTA reachable without waiting for the timer. |
| **Scrolling Text** | Required: short text. Optional: mobile visibility, size/colors, width, padding/margin, speed, gap. | Use one short repeatable phrase, shipping message, or campaign label. Avoid paragraphs and legal terms. | Can be hidden on mobile. Excessive speed harms readability; test reduced-motion behavior and avoid placing beside another moving section. |

### Merchandising and shoppable sections

| Section | Required and optional settings | Media/content guidance | Mobile and usage notes |
| --- | --- | --- | --- |
| **Collections** | Required: selected collections. Optional: heading, arrow/count visibility, 3–4 columns, image ratio, gap, background. | Shopify collection images should all match the chosen 1:1, 4:3, or 3:4 ratio. Use a discovery-oriented heading such as "Shop by concern." | Navigation controls move below the cards on mobile. Keep the set focused—normally 4–8 collections. |
| **Featured products** | Required: Featured products list with a selected collection/product source. Optional: total count, ratings, prices, details link, arrows, numbering, heading. | Merchandising order should be intentional. Product images should use one crop/background style. | The carousel/list adapts by viewport; test with the exact item count. Do not show ratings unless the provider is configured and data is populated. |
| **Product grid** | Required: Product grid list with a selected collection. Optional: campaign eyebrow/heading/button and badge/rating/count toggles. | The selected collection's feature image becomes a large campaign card; use a high-quality lifestyle/collection image and short CTA copy. | Renders a two-column campaign/product layout from tablet widths; product cards remain a two-column grid within their panel. Check long product titles on mobile. |
| **Product placement** | Required: Items block; each Product needs an image and Shopify product. Optional: intro copy, products per row, ratio, gap. | Use manual editorial images when the product's catalog image is not the desired composition. Keep 2–4 items with one ratio. | Desktop uses a grid; mobile becomes a one-item Swiper with pagination. Avoid more than four items or very long product names. |
| **Promotion grid** | Required: first and second collections. Optional: independent headings and shared button label. | Uses each collection image in a fixed 16:9 card. Prepare paired 1600 × 900 images and benefit-led headings. | Stacks to one column on mobile and becomes two columns at tablet width. Missing collections produce missing cards outside design mode. |
| **Single product** | Required: selected Shopify product. Optional: button labels, vendor/price/details/policies/back-in-stock, unavailable-option behavior, ratio, media direction, thumbnails/counter, zoom, Judge.me summary. | Use on non-PDP pages for one hero SKU or routine anchor. Shopify product media is the source; keep variants and policy links accurate. | Purchase information stacks below media on mobile and becomes two columns on tablet. Do not use as a replacement for Product information on the actual PDP template. |
| **Hotspots** | Required: Image hotspots block with image; every Hotspot item needs a product and safe X/Y coordinates. Optional: width, gap, padding, icon, badge/rating/price/detail link, overlay. | Use a square, product-rich lifestyle scene. Keep markers separated and within the inner 80% of the image. | Image is square on mobile and pairs with a product-detail panel on desktop. Test every marker by touch; avoid tiny icons and edge positions. |

### Brand, education, service, and social sections

| Section | Required and optional settings | Media/content guidance | Mobile and usage notes |
| --- | --- | --- | --- |
| **Image with text** | Required: one Content block and one Image block. Optional: image position, content alignment/padding, image ratio/width/radius/fit, text/CTA blocks. | Use 4:3 or 3:4 imagery for ingredients, founders, routines, or sourcing. Keep copy to one idea and one CTA. | Content and image stack on mobile and share the row on desktop. Check that the reading order still makes sense when image position changes. |
| **Product details** | Required: only the blocks relevant to the product story. Optional: text/background colors. | Benefits should be concise; Story may use one 4:3 image; ingredients need plain-language descriptions; usage steps should start with verbs; clinical results need evidence; badges should be short claims. | Blocks are stacked and individually responsive; Story becomes two columns on tablet. Do not duplicate information already present in Product information or add unsupported claims. |
| **Before & after** | Required: Slider with both images. Optional: heading, separator/arrows/colors, independent desktop/mobile height. | Images must match exactly in crop, pose, dimensions, and lighting. Add context and substantiated time frame in surrounding copy. | Uses separate mobile and desktop height settings. Verify the drag handle with touch and never use mismatched subjects or deceptive crops. |
| **Testimonials** | Required: useful review data and background image; select a product when product-specific Judge.me data is expected. Optional: number shown, review position, rating copy/link, colors, overlay, desktop padding. | Use an authentic review set and a 4:5 lifestyle image with negative space. Keep rating CTA copy factual. | Desktop uses a split/full-height presentation; mobile uses a 420 px image followed by the review panel. Verify contrast on both layers. |
| **Highlights** | Required: List items with Highlight blocks. Optional: heading, columns, gap, border/icon colors, per-item mobile visibility. | Use 3–4 parallel benefits such as vegan, dermatologist tested, refillable, or free shipping. Keep heading length consistent. | Items reflow by viewport and can be hidden individually on mobile. Do not hide information that is necessary for purchase or compliance. |
| **FAQs** | Required: FAQ items or service links. Optional: card image/overlay, alt text, card eyebrow/heading/body/CTA, FAQ eyebrow/heading. | Use a 4:5 service image and concise question labels. Current FAQ items link to answers/pages rather than storing long accordion answers. | Two-column desktop layout stacks on mobile. Ensure each link resolves and avoid promising support hours or policies that are not current. |
| **Instagram** | Required: Instagram post blocks with images. Strongly recommended: profile URL and post links. Optional: heading/handle, width, desktop count, speed, autoplay, mobile visibility. | Use consistent 1:1 tiles and the real account handle. This section is manually curated; it does not fetch a live Instagram feed. | Can auto-scroll or be hidden on mobile. Test links and keep animation slow enough to inspect each tile. |
| **Newsletter** | Required: Newsletter input block and useful consent/context copy. Optional: icon, heading, paragraph, placeholder, button label/style. | Explain what subscribers receive; keep the promise specific. Configure Klaviyo variables before publishing. | Blocks stack naturally. Test success, invalid email, duplicate subscription, and provider failure states on the storefront. |
| **Map** | Required: at least one Map item with a complete geocodable address. Optional: map side, heading, CTA/link/target, item title and paragraph. | Use the public store name, full postal address, current hours, and a directions CTA. | Media and content stack/reverse on mobile depending on map position, then become side-by-side. Verify the embedded location, not just the text address. |
| **Blogs** | Required: selected Shopify blog. Optional: heading, gap/separator, read-more text, image ratio, responsive heading typography. | Use a consistent featured-image ratio and concise article titles/excerpts. Choose one relevant blog rather than mixing unrelated feeds. | Grid grows from one to two, three, then four columns. Check cards without images and long titles at each breakpoint. |
| **Spacer** | No content required. Configure mobile/desktop height, optional background, separator/color. | No media or copy. Prefer parent-section padding for ordinary rhythm. | Has independent mobile and desktop heights. Use sparingly; repeated large spacers create unpredictable pages. |

### Shopify template sections

| Section | Required and optional settings | Content/media guidance | Mobile and usage notes |
| --- | --- | --- | --- |
| **Collection banner** | Collection page only. Uses current title/description/image unless overridden. Optional: content color, image side, background, desktop/mobile heights, content position, overlay. | Use the collection image or a 4:3 override. Keep description brief; full SEO copy belongs lower on the page. | Stacks vertically on mobile and becomes a split banner on tablet. Verify image and text order when changing image position. |
| **Collection filters** | Collection page only. Optional: expanded groups, counts, swatches, button-style filter names, item limit, checkbox shape, width/gap. | Shopify Search & Discovery filters and product data must be configured. `METAOBJECT_COLORS_TYPE` supports richer swatches. | Filters condense for small screens; test filter, sort, URL state, pagination/infinite loading, and no-results state. Add only once. |
| **Collection list** | Collection-list page only. Required: Collection list block. Optional: heading, collections per row, lazy loading, section layout. | Uses Shopify collection cards; maintain consistent collection images and useful descriptions in Shopify. | Grid count adapts by viewport. Add only once because the schema limit is one. |
| **All products** | All-products page only. Optional: heading and section layout. | Uses the route's Shopify product connection and catalog media. | Includes previous/show-more pagination. Test empty catalog and loading states. Add only once. |
| **Product information** | Product page only. Uses current product. Optional: purchase labels, vendor/price/details/policies/back-in-stock, option hiding, media ratio/direction, counter, thumbnails, gap, Judge.me summary. | Shopify title, variants, price, media, and policies must be production-ready. Configure Klaviyo before enabling back-in-stock. | Stacks on mobile and becomes a media/purchase split on tablet. This is the primary PDP purchase section; add only once. |
| **Judge.me Reviews** | Product page only. Required: Judge.me Review index and configured token. Optional: heading/paragraph, list side, review/form/empty-state copy. | Keep review copy neutral and do not imply verification that the provider does not supply. | List/form layout adapts by viewport. Test pagination and submission; omit the section when Judge.me is not configured. |
| **Blog post** | Article page only; no merchant settings. | Renders the current Shopify article body. Format headings, images, tables, and links in Shopify. | Test rich text at narrow widths, especially wide media/tables. Add only once. |
| **Related articles** | Article page only. Optional: heading, article count, excerpt/date/author/read-more toggles. | Related content comes from the current blog; use consistent featured images and metadata in Shopify. | Cards reflow responsively. Keep the count small—normally three—and avoid repeating the current article. |
| **Page** | Shopify Page template only. Optional: top/bottom padding. | Renders native Shopify page content. Maintain semantic headings and accessible links in Shopify. | Test rich text, embedded media, and tables on mobile. Add only once. |
| **Search results** | Custom search page only. Optional: expanded filters, counts, swatches, button-style filter names, item limit, checkbox shape. | Depends on the current search query and Shopify filter configuration. | Test no query, no results, filters, sort, and long queries. Do not place on an ordinary landing page. |
| **Contact us** | Currently enabled on `INDEX` only. Required: heading/subheading, button label, `WEAVERSE_HOST`, and private `WEAVERSE_API_KEY`. Optional: background, alignment, button style, padding. | Use direct, expectation-setting copy and never request sensitive personal/payment data. | Fields stack cleanly on mobile. Test real delivery and safe error messages. A developer must change the schema before this can be inserted on a dedicated Page template. |
| **Style guide** | Development-only registered component. | No production content or media. | Keep it out of merchant pages; it exists for visual/component checks. |

## Example page compositions

The structures below are starting points, not requirements. Remove sections
that do not have real content or a clear customer purpose.

### Homepage: product discovery

```text
1. Image banner or Video banner
2. Highlights
3. Collections
4. Featured products
5. Image with text — brand or ingredient story
6. Product grid or Promotion grid
7. Testimonials
8. Blogs
9. Instagram
10. Newsletter
```

Use one primary hero only. Place the first product-discovery section within the
first two or three viewport lengths, and alternate dense product areas with
editorial storytelling.

### Homepage: campaign launch

```text
1. Slide show banner — maximum 2–3 campaign messages
2. Scrolling Text — one offer or launch statement
3. Countdown — only when the deadline is real
4. Single product — hero launch SKU
5. Product details — benefits, ingredients, how to use
6. Before & after or Testimonials
7. Product placement — complete the routine
8. Newsletter
```

Avoid running a video hero, autoplay slideshow, scrolling ticker, and animated
Instagram rail in the same viewport.

### Collection page

```text
1. Collection banner
2. Collection filters
3. Image with text — optional collection story
4. Featured products or Blogs — optional supporting discovery
5. Newsletter — optional
```

Keep one Collection filters section. The banner should introduce the collection
without pushing the product grid too far below the fold.

### Product detail page

```text
1. Product information
2. Highlights — shipping, returns, or product standards
3. Product details
   - Benefits
   - Product story
   - Key ingredients
   - How to use
   - Clinical results (only with evidence)
   - Product badges
4. Before & after — optional and substantiated
5. Judge.me Reviews
6. Featured products or Product placement — complementary routine
7. FAQs — product support links
```

Do not add Single product on the PDP when Product information already provides
the purchase experience.

### Editorial or brand landing page

```text
1. Image banner
2. Image with text — brand thesis
3. Slides — sourcing, ritual, or ingredient education
4. Hotspots or Product placement — connect story to products
5. Before & after or Testimonials
6. Blogs
7. Newsletter
```

### Blog/article experience

```text
Blog landing:
1. Image banner — optional editorial introduction
2. Blogs
3. Newsletter

Article template:
1. Blog post
2. Product placement or Single product — only when editorially relevant
3. Related articles
4. Newsletter
```

### Service, FAQ, or store page

```text
1. Image banner or Image with text
2. FAQs
3. Map — when a physical location exists
4. Contact us — only on INDEX with the current schema
5. Newsletter — optional
```

For a dedicated contact Shopify Page, use native page content or ask a
developer to enable `Contact us` for the `PAGE` type before composing it.

## Common mistakes to avoid

- Adding a child block as a top-level section or moving it under the wrong
  parent.
- Using a template-bound section on an incompatible page type.
- Adding two primary heroes, two Product information sections, or duplicate
  filter/review systems to one page.
- Publishing a Shopify-backed section without selecting its product,
  collection, or blog.
- Leaving placeholder copy, placeholder images, empty CTA URLs, or `#` links.
- Mixing source ratios in one grid while forcing a single display ratio.
- Using `Adapt to image` with inconsistent image dimensions.
- Assuming Image banner has a separate mobile image; it currently uses one
  background image for all breakpoints.
- Putting copy inside imagery instead of editable Studio text blocks.
- Using low-contrast text over images/video without an overlay.
- Placing hotspots near image edges, on top of one another, or without products.
- Using mismatched before/after imagery or unsupported outcome claims.
- Leaving an expired countdown or false urgency message published.
- Showing ratings/reviews without configured, populated Judge.me data.
- Enabling newsletter/back-in-stock without Klaviyo, or Contact us without the
  Weaverse host/API key, and skipping an end-to-end delivery test.
- Treating Instagram as a live feed; its tiles and links are manually managed.
- Using many Spacer sections instead of the parent section's padding settings.
- Hiding purchase-critical or compliance content on mobile.
- Skipping keyboard, touch, error-state, and empty-state testing.

## Pre-publish checklist

- Every Shopify-backed section has valid resource data or correct route context.
- Heading order is semantic: one `h1`, followed by logical `h2`/`h3` levels.
- Images have consistent ratios, sufficient resolution, and meaningful alt text.
- Desktop, tablet, and mobile crops have been reviewed.
- Text remains readable over every image and video frame.
- Sliders work with mouse, touch, and keyboard; navigation is not shown for a
  meaningless single-item carousel.
- All CTAs, product actions, filters, pagination, forms, and external links work.
- Review, newsletter, contact, and back-in-stock integrations are configured
  and tested end to end without exposing private tokens.
- Countdown dates, store hours, prices, policies, campaign terms, and social
  links are current.
- The page does not contain duplicate purchase, filter, or review sections.

## Maintaining this guide

When a section schema changes, update this document in the same pull request.
Check the section's `settings`, `childTypes`, `presets`, route data source, and
responsive classes. Add screenshots only when an interaction or composition
cannot be explained clearly with text; label them with the section name,
scenario, and viewport width.
