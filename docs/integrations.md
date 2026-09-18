# Third-party integrations

This guide describes Naturelle's integration surfaces, credential boundaries,
and local/Oxygen setup. It separates features already implemented in Naturelle
from providers that still require an adapter.

> A Shopify theme app embed or Liquid snippet does not automatically run in a
> Hydrogen storefront. Install the Shopify app to create its Shopify-side data,
> then use a Hydrogen-compatible API, SDK, or Naturelle adapter to render it.

## Support matrix

| Category | Provider | Naturelle status | Storefront surface |
| --- | --- | --- | --- |
| Reviews | Judge.me | **Built in** | Product rating, review form/list, standalone **Judgeme Reviews**, and product-backed **Testimonials** |
| Reviews | Yotpo, Okendo, Loox | **Adapter required** | Replace or extend the review loader, route, and renderer |
| Email marketing | Klaviyo | **Built in** | Footer and **Newsletter** section |
| Back in stock | Klaviyo | **Built in** | Product information, Single product, and quick view |
| SMS | Attentive and other SMS providers | **Adapter required** | Dedicated consent UI and server action |
| Purchase subscriptions | Recharge, Skio, Appstle, and other Shopify subscription apps | **Shopify selling-plan compatible** | Product information, Single product, quick view, and cart |
| Provider portals and advanced subscription features | Recharge, Skio, Appstle | **Adapter required** | Customer portal, payment-method changes, bundles, migrations, and provider-only data |
| Wishlist | Swym, Growave, Wishlist Plus, and other apps | **Not included by design** | None today; see Wishlist and loyalty apps |
| Loyalty/referrals | Yotpo Loyalty, Smile, ReferralCandy, and other apps | **Not included by design** | None today; see Wishlist and loyalty apps |
| Search/filter | Shopify Storefront API + Search & Discovery | **Built in** | Search, predictive search, and collection filters |
| Search/merchandising | External providers | **Adapter required** | Search and collection route loaders and result components |
| Analytics | Hydrogen Analytics + GTM bridge | **Built-in foundation** | Root analytics provider and standard storefront events |
| Analytics/pixels | GA4, Meta, Google Ads, and other pixels | **Configuration or adapter required** | GTM tags and, when required, server event routes |

“Adapter required” means that adding an environment variable alone does
nothing. Code must be added to call the provider and render or forward its
data.

## Credential and environment rules

### Public versus private

Use `PUBLIC_` only when a value is intentionally sent to the browser.

| Credential type | Browser-safe? | Naturelle handling |
| --- | --- | --- |
| Store/widget ID, public app key, public storefront token | Usually, but only when the provider documents it as public | May use `PUBLIC_`; restrict scopes and origins where supported |
| Private API key, app secret, admin token, webhook signing secret | **No** | Server environment only; never return it from a loader/action |
| Customer access token, email, phone, order/customer data | **No** | Keep server-side or in the provider's approved client flow; never log raw values |

Do not put private values in Git, Weaverse section settings, theme settings,
client bundles, `window`, HTML attributes, screenshots, or support tickets.
Prefer a server loader/action that returns only the fields required by the UI.
[Weaverse loaders support server-side third-party fetching and Hydrogen
caching](https://docs.weaverse.io/features/why-weaverse-for-hydrogen).

### Local and Oxygen setup

Local development reads `.env` in the repository root. Keep `.env` untracked,
use placeholder-only values in `.env.example`, and restart the dev server after
changing a value.

Production and preview deployments read variables from Shopify admin:

1. Open **Hydrogen > Storefronts > Naturelle > Environments and variables**.
2. Add each value to the correct Preview and/or Production environment.
3. Redeploy that environment after changing a variable.
4. Use independent credentials for staging and production when the provider
   supports separate apps, sites, lists, or workspaces.

See [Weaverse's Oxygen deployment guide](https://docs.weaverse.io/oxygen-deployment)
for the global deployment workflow.

### Environment examples

These are placeholders, not working credentials:

```dotenv
# Implemented by Naturelle
JUDGEME_PRIVATE_API_TOKEN="<judgeme-private-api-token>"
KLAVIYO_PRIVATE_API_TOKEN="<klaviyo-private-api-token>"
KLAVIYO_NEWSLETTER_LIST_ID="<klaviyo-newsletter-list-id>"
PUBLIC_GOOGLE_GTM_ID="GTM-XXXXXXX"

# Adapter examples only — Naturelle does not read these names today
PUBLIC_YOTPO_APP_KEY="<yotpo-public-app-key>"
YOTPO_APP_SECRET="<yotpo-private-app-secret>"
OKENDO_USER_ID="<okendo-user-id>"
OKENDO_API_KEY="<okendo-private-api-key>"
PUBLIC_LOOX_STORE_ID="<loox-public-store-id>"
LOOX_MERCHANT_API_KEY="<loox-private-merchant-api-key>"
ATTENTIVE_API_KEY="<attentive-private-api-key>"
ATTENTIVE_SIGNUP_SOURCE_ID="<attentive-sign-up-source-id>"
RECHARGE_STOREFRONT_TOKEN="<recharge-scoped-storefront-token>"
RECHARGE_ADMIN_TOKEN="<recharge-private-admin-token>"
```

Do not invent a `PUBLIC_` variable for a provider until its selected API or SDK
explicitly classifies that credential as browser-safe.

## Reviews

### Judge.me — built in

**Where it appears**

- Product information and Single product can show the rating summary and
  embedded review component.
- The standalone **Judgeme Reviews** section renders the review summary, list,
  pagination, and submission form.
- The **Testimonials** section can load reviews for its selected product.
- Review data is loaded through `app/utils/judgeme.ts` and
  `/api/review/:productHandle`. The private token is never returned to the
  browser.

**Setup**

1. In Judge.me, open **Settings > Integrations > View API tokens**.
2. Copy the **private** API token into `JUDGEME_PRIVATE_API_TOKEN` locally and
   in each Oxygen environment.
3. Confirm `PUBLIC_STORE_DOMAIN` is the matching Shopify store domain.
4. Restart or redeploy, then open a product with reviews and add or enable the
   desired Judge.me surface in Weaverse Studio.

Official reference: [Judge.me API tokens](https://judge.me/help/en/articles/8409180-using-judge-me-api).

Naturelle applies request timeouts and returns an empty review state when
Judge.me is missing or unavailable. Review writes are sent through a
same-origin server action; the private token stays server-side.

**Test**

- Configured: rating, count, pagination, and submission work on a reviewed
  product; confirm the token is absent from page source and response bodies.
- Empty product: the no-reviews state renders without blocking purchase.
- Unconfigured or unavailable: Judge.me surfaces hide or degrade safely.
- Avoid placing both the embedded product review block and the standalone
  section on the same PDP unless duplicate review UIs are intentional.

### Yotpo, Okendo, and Loox — adapter required

Do not reuse `JUDGEME_PRIVATE_API_TOKEN` or expose another provider's secret to
the browser. Implement a provider adapter that:

1. maps Shopify product IDs or handles to the provider's product identifier;
2. fetches public review data through an approved client SDK or a Naturelle
   server loader;
3. normalizes rating, count, pagination, and review fields for the existing UI
   or renders a provider-specific section;
4. keeps moderation and review-write credentials server-only; and
5. adds only verified provider hosts to `app/weaverse/csp.ts`.

**Yotpo** — the App Key/Store ID may be used as public widget configuration
only when Yotpo documents that usage; the Secret Key is server-only. Both are
listed under **Account Settings > General Settings**; generating a secret
requires an authorized account.

**Okendo** — Okendo documents a Widget Plus installation for Hydrogen/headless
storefronts. For a custom server integration, get the Merchant API User ID and
API Key from Okendo integration settings and keep the API key server-only; do
not call the Merchant REST API directly from the browser. Choose Widget Plus or
a Naturelle server loader — do not load both.

**Loox** — the Storefront API uses a public Store ID for public review data;
the Merchant API key is private and must stay in a Naturelle server
loader/action. Obtain both from Loox **Settings > API Keys**.

References:

- [Find the Yotpo App Key and Secret Key](https://support.yotpo.com/docs/finding-your-yotpo-app-key-and-secret-key-4)
- [Yotpo custom storefront integration](https://support.yotpo.com/v1/docs/generic-other-platforms-installing-yotpo-reviews-v3)
- [Okendo headless Widget Plus](https://docs.okendo.io/on-site/advanced-widget-installs/installing-widget-plus-on-headless-instances)
- [Okendo merchant API credentials](https://docs.okendo.io/merchant-rest-api/quick-start)
- [Loox APIs and key boundaries](https://help.loox.io/support/solutions/articles/501000356871-loox-reviews-api-and-webhooks)
- [Loox with Shopify headless commerce](https://help.loox.io/support/solutions/articles/501000162379-integrating-loox-with-shopify-headless-commerce)

For every review adapter, test reviews present/absent, invalid product mapping,
rate limiting, timeout, provider outage, and missing credentials. Use a short
cache for public reads; never cache writes.

## Email, consent, and back in stock

### Klaviyo — built in

Naturelle uses the server-side Klaviyo API revision declared in
`app/utils/klaviyo.server.ts`. Keep the integration on a supported revision and
review Klaviyo's changelog before changing it.

Create a Klaviyo private API key with the minimum required scopes. Never add a
`PUBLIC_` prefix or expose the key from root data.

| Naturelle surface | Route | Required configuration | Purpose/scopes |
| --- | --- | --- | --- |
| Footer and **Newsletter** section | `/api/klaviyo` | `KLAVIYO_PRIVATE_API_TOKEN` + `KLAVIYO_NEWSLETTER_LIST_ID` | Bulk subscribe a profile to email marketing and the configured list: `lists:write`, `profiles:write`, and `subscriptions:write` |
| Product information, Single product, and quick-view back-in-stock form | `/api/back-in-stock` | `KLAVIYO_PRIVATE_API_TOKEN` | Create a back-in-stock subscription; catalog and profile write scopes required by Klaviyo |

The root loader exposes only configured booleans. It never exposes the token or
list ID. Newsletter UI is hidden in the storefront when either newsletter
variable is missing; Studio displays a configuration placeholder. Back-in-stock
requires only the private token and has a separate configured state.

#### Newsletter setup

1. Create or select the newsletter list in Klaviyo and copy its list ID.
2. Set `KLAVIYO_PRIVATE_API_TOKEN` and `KLAVIYO_NEWSLETTER_LIST_ID` locally and
   in the relevant Oxygen environments.
3. Configure the newsletter description/help text with the consent disclosure
   required for the merchant's regions and program.
4. Submit a new email and verify the profile's list membership and email
   marketing consent in Klaviyo.
5. If the list uses double opt-in, verify the confirmation message and do not
   promise immediate subscription before the visitor confirms.

The Klaviyo bulk-subscribe endpoint is asynchronous. Naturelle reports that the
subscription request was received; final consent/list state remains subject to
the configured Klaviyo opt-in rules.

#### Back-in-stock setup

1. Connect Shopify to Klaviyo and wait for the catalog sync.
2. Create and activate a Klaviyo Back in Stock flow.
3. Disable **Continue selling when out of stock** for variants that should show
   the form.
4. Enable **Show back-in-stock form** in Product information or Single product.
   Quick view uses the same configured integration automatically.

The form remains hidden when the selected variant is available, the setting is
off, the variant ID is missing, or Klaviyo is unconfigured. A
`variant_not_found` response normally indicates that catalog sync or Shopify ID
mapping is not ready.

Test invalid and duplicate emails, a sold-out variant, a missing list ID, a
missing/insufficient-scope token, provider timeout, and catalog sync failure.

References:

- [Create a Klaviyo private API key](https://help.klaviyo.com/hc/en-us/articles/7423954176283)
- [Collect email and SMS consent via API](https://developers.klaviyo.com/en/docs/collect_email_and_sms_consent_via_api)
- [Create a back-in-stock subscription](https://developers.klaviyo.com/en/reference/create_back_in_stock_subscription)
- [Klaviyo API versioning and deprecation](https://developers.klaviyo.com/en/docs/api_versioning_and_deprecation_policy)

### Attentive and other SMS providers — adapter required

SMS consent must not reuse a generic email checkbox. Add a dedicated phone
field and consent control with the exact disclosure approved for the program,
then POST to a Naturelle server action. Validate origin, phone format, consent,
and provider response; keep email and SMS consent records separate.

Test valid opt-in, invalid phone, duplicate subscriber, unchecked consent,
missing configuration, and provider failure. Ask the provider or merchant's
legal team to review the final disclosure before launch.

## Subscriptions

### Shopify selling-plan purchase flow — built in

Naturelle reads Shopify `sellingPlanGroups` with the product query, matching the
lightweight purchase flow used by Maison. The selector and price preview use
the plan's first product-level price adjustment; changing variants does not run
an additional selling-plan request or show a loading state.

This integration does not validate variant-level `sellingPlanAllocations` in
the storefront. Merchants should assign each exposed plan consistently across
the product variants on which it can be purchased, and verify the final cart
and checkout behavior before launch.

The purchase flow:

- renders one-time and configured subscription choices on Product information,
  Single product, and quick view;
- defaults subscription-only products to the first configured selling plan;
- validates a requested `selling_plan` URL parameter against the product's
  queried selling plans;
- sends `sellingPlanId` when adding the line to cart;
- keeps optimistic one-time and subscription cart lines distinct; and
- displays the Shopify `sellingPlanAllocation` name in cart.

The Headless channel or custom app must include
`unauthenticated_read_selling_plans`. See Shopify's [selling-plan storefront
guide](https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/products-collections/subscriptions).

Recharge, Skio, Appstle, and other Shopify subscription apps can provide the
plans as long as they create standard Shopify selling plans and assign them to
the appropriate products or variants. Naturelle's purchase selector requires
no provider token: query current plan IDs from Shopify and never persist them
in Weaverse settings or source code.

| Provider | Purchase selector | Portal and provider-only features |
| --- | --- | --- |
| Recharge | Uses standard Shopify selling plans | Use Recharge's Storefront SDK/API or a server adapter |
| Skio | Uses standard Shopify selling plans | Follow Skio's approved Hydrogen/App Proxy portal flow |
| Appstle | Uses standard Shopify selling plans | Use Appstle customer-facing App Proxy APIs or a server adapter |

Provider references:

- [Recharge Storefront API and JS SDK](https://docs.getrecharge.com/docs/storefront-api-and-js-sdk)
- [Skio Hydrogen integration](https://help.skio.com/docs/onboarding-integrating-on-hydrogen-remix)
- [Appstle subscription APIs](https://developers.subscription.appstle.com/)

Test one-time purchase, every configured frequency, every variant that exposes
a plan, a subscription-only product, quick view, cart updates, checkout,
missing Storefront scope, and a provider-created plan with prepaid pricing.
With no plan assigned, an optional-subscription product must retain the normal
one-time purchase flow.

## Wishlist and loyalty apps

Naturélle deliberately ships without wishlist and loyalty/referral surfaces;
they are not part of the theme design today (this differs from Aspen, which
has a native wishlist and LoyaltyLion support). Do not add provider scripts,
app embeds, or sections ad hoc. If product design later approves one:

- implement it as a single shared adapter that follows the credential and
  environment rules above; provider private keys stay server-only and only
  provider-documented public keys may run in the browser;
- surface it through Weaverse sections/components rather than global script
  injection;
- add only verified provider hosts to `app/weaverse/csp.ts`; and
- pass the Integration QA checklist below — including unconfigured-state
  behavior — before publishing.

## Search, filters, and merchandising

Naturelle's default search, predictive search, and collection filters use
Shopify Storefront API data. Configure available filters in Shopify's **Search
& Discovery** app; no third-party credential is required.

For Algolia, Searchspring, Boost, Klevu, or another external provider, the
adapter should:

- query the provider from search and collection route loaders, preferably on
  the server;
- map hits to Naturelle product-card fields and canonical Shopify URLs;
- preserve locale, currency, availability, filters, sorting, pagination, and
  URL state;
- keep indexing/admin secrets server-only and use only a restricted public
  search key in the browser when required;
- define a Shopify fallback for missing configuration or provider outage; and
- add the smallest verified host set to `app/weaverse/csp.ts`.

## Analytics and pixels

Naturelle wraps the storefront with Hydrogen `Analytics.Provider`. When a
valid `PUBLIC_GOOGLE_GTM_ID` is configured, the custom adapter loads GTM only
after `canTrack()` permits tracking and either visitor intent occurs or the
fallback timer completes.

The bridge pushes these event names to `window.dataLayer`:

- `page_viewed`
- `product_viewed`
- `collection_viewed`
- `cart_viewed`
- `cart_updated`
- `add_to_cart`
- `remove_from_cart`
- `search_viewed`
- `checkout_started`

This is a foundation. It does not configure GA4 ecommerce tags, Meta Pixel or
Conversions API, Google Ads conversions, purchase tracking, or client/server
deduplication by itself.

### Credential and consent boundary

- Browser-safe identifiers include a GTM container ID, GA4 measurement ID,
  Meta Pixel ID, and Google Ads conversion ID/label.
- GA4 Measurement Protocol secrets, Meta CAPI access tokens, Google Ads OAuth
  credentials, and webhook secrets are server-only.
- Never include email, phone, customer tokens, or raw addresses in
  `dataLayer`. Hashing personal data does not remove consent requirements.
- Naturelle currently sets Hydrogen's `withPrivacyBanner` to `false`; the
  merchant must provide/configure the applicable Shopify privacy experience.
  Test consent accepted, rejected, and changed before enabling production tags.

Add client tags in GTM only for consented browser events. Server-side analytics
needs a dedicated Oxygen action with request validation, secrets kept on the
server, and stable event IDs for browser/server deduplication. Audit Shopify
checkout tracking separately because checkout runs on Shopify's domain.

Official references:

- [Hydrogen analytics and consent](https://shopify.dev/docs/storefronts/headless/hydrogen/analytics/consent)
- [Shopify Web Pixels API](https://shopify.dev/docs/api/web-pixels-api)
- [GA4 Measurement Protocol](https://developers.google.com/analytics/devguides/collection/protocol/ga4)
- [Meta Conversions API](https://developers.facebook.com/docs/marketing-api/conversions-api)

## Integration QA checklist

For every provider:

- [ ] Placeholder-only examples are committed; real credentials exist only in
      local `.env` and the correct Oxygen environments.
- [ ] Public/private classification was confirmed in current provider docs.
- [ ] Private values are absent from built assets, HTML, loader JSON, network
      responses, logs, Weaverse settings, and screenshots.
- [ ] Configured state works with production-like data.
- [ ] Missing, invalid, expired, and insufficient-scope credentials fail
      safely.
- [ ] Empty data and provider outage do not block product purchase or page
      rendering.
- [ ] Consent, privacy, data deletion, and regional requirements are tested.
- [ ] CSP allows only required production domains.
- [ ] Preview and Production Oxygen variables are configured independently and
      both deployments were tested.

## Troubleshooting

### Works locally but not on Oxygen

- Confirm every variable exists in the exact Preview/Production environment.
- Check spelling and case; private variables must not gain a `PUBLIC_` prefix.
- Redeploy after changing variables.
- Compare provider app, store, workspace, and Klaviyo list IDs between local
  and production.
- Check Oxygen logs for upstream status codes without logging tokens or PII.

### App is installed in Shopify but nothing appears

Liquid blocks and theme app embeds target Online Store themes, not Hydrogen.
Verify that the provider supports headless storefronts, then implement or
enable the Naturelle API/SDK adapter described above.

### Newsletter is hidden

Both `KLAVIYO_PRIVATE_API_TOKEN` and `KLAVIYO_NEWSLETTER_LIST_ID` are required.
Back-in-stock can still appear with only the private token because it uses a
separate Klaviyo endpoint and configuration flag.

### Subscription selector is empty

- Confirm the product has an active selling plan assigned.
- Confirm the Headless channel has `unauthenticated_read_selling_plans`.
- Confirm the product and selling plan are published to the Headless channel.
- Confirm the plan is assigned consistently to every variant that should offer
  it; Naturelle's lightweight selector does not filter by variant allocation.

### Browser reports a CSP error

Add only the verified provider origin to the appropriate directive in
`app/weaverse/csp.ts` (`scriptSrc`, `connectSrc`, `imgSrc`, or `frameSrc`). Test
Studio design mode and the production domain. Do not use `*` as a production
workaround.

### Provider returns unauthorized or forbidden

- Verify token type, scopes, site/store/list ID, environment, expiry, and API
  revision.
- Ensure private tokens are sent only by the Oxygen server.
- Rotate a token immediately if it appeared in browser tools or Git history.

### Configured integration shows empty data

- Confirm Shopify IDs, handles, GIDs, catalog sync, customer mapping, locale,
  and publication status.
- Test the provider endpoint with a known reviewed/subscribed/customer record.
- Check caching before assuming the upstream write failed.

### Studio preview differs from production

Studio can use preview data for account-dependent surfaces. Verify the real
page on a deployed preview with actual Customer Account authentication and the
Preview environment's credentials. See the project
[setup guide](./setup.md) for Studio and Oxygen connection details.

## Global references

- [Weaverse third-party server-loader pattern](https://docs.weaverse.io/features/why-weaverse-for-hydrogen)
- [Weaverse deployment overview](https://docs.weaverse.io/deployment)
- [Weaverse Oxygen deployment](https://docs.weaverse.io/oxygen-deployment)
- [Shopify Hydrogen third-party API cookbook](https://shopify.dev/docs/storefronts/headless/hydrogen/cookbook)
