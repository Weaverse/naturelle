# Naturélle setup and usage guide

This guide is the operational reference for developers, interns, and merchants
working on Naturélle. It covers a fresh local setup, Shopify and Weaverse
connections, customization, and deployment to Shopify Oxygen.

## 1. What Naturélle is

Naturélle is a Shopify Hydrogen theme for beauty, skincare, cosmetics, and
editorial-led commerce stores. It has two customization layers:

1. **Code:** developers maintain React Router routes, Hydrogen commerce logic,
   reusable components, and Weaverse section schemas in this repository.
2. **Weaverse Studio:** merchants compose pages, reorder sections, select
   Shopify resources, edit content, and change global theme settings without
   editing code.

Shopify is the source of truth for products, collections, markets, customers,
menus, checkout, and orders. Weaverse is the source of truth for page
composition and theme-setting values.

## 2. Prerequisites

Install or obtain:

- Node.js **22.12.0 or newer** (`node --version`)
- npm, included with Node.js (`npm --version`)
- Git (`git --version`)
- access to a Shopify store with the Hydrogen or Headless sales channel
- access to the corresponding Weaverse project
- Shopify CLI authentication when linking, pulling environment values, or
  deploying

Naturélle tracks `package-lock.json`; use npm and `npm ci` for reproducible
installs. Do not add a second lockfile.

Oxygen is available through Shopify's Hydrogen sales channel. A Shopify
development store can be used for development, but its Oxygen URLs may require
a store login.

## 3. Install and run locally

```bash
git clone <repository-url> naturelle
cd naturelle
npm ci
cp .env.example .env
```

Generate a unique session secret for your machine:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Put the generated value in `SESSION_SECRET` in `.env`. Do not reuse a
production session secret locally.

Populate the four minimum values below, then start the app:

```bash
npm run dev
```

Open <http://localhost:3456>. The command generates React Router types, runs
Shopify GraphQL codegen, and starts Hydrogen's local MiniOxygen runtime.

### Minimum values needed to render

```env
SESSION_SECRET="<random-64-character-hex-string>"
PUBLIC_STORE_DOMAIN="<store>.myshopify.com"
PUBLIC_STOREFRONT_API_TOKEN="<public-storefront-token>"
WEAVERSE_PROJECT_ID="<weaverse-project-id>"
```

These values are enough for Shopify catalog data and published Weaverse
content. Checkout, customer accounts, analytics, and optional integrations
need the additional variables described below.

## 4. Environment variables

### Security and environment model

- `.env` is for local development only and is ignored by Git.
- `.env.example` contains variable names and placeholders only. Never add a
  usable credential to it.
- Oxygen variables are configured separately for **Preview**, **Production**,
  and any custom environments. A local `.env` is not uploaded by a Git push.
- A `PUBLIC_*` variable is allowed in storefront/browser configuration. It is
  not a Shopify Admin API credential and should still be shared only where
  needed.
- Private Storefront, Weaverse, Judge.me, and Klaviyo tokens are server-only.
  Never add `PUBLIC_` to a private or admin token to make it available in
  browser code.
- Naturélle does not need a Shopify Admin API token to render the storefront.
- Project, storefront, shop, and public client IDs are identifiers rather than
  passwords. `WEAVERSE_API_KEY` is a private credential.
- If a private token is exposed, rotate it at the provider and update every
  affected Oxygen environment.

### Core Shopify and Weaverse variables

| Variable | Required | Exposure | Placeholder | Purpose/source |
| --- | --- | --- | --- | --- |
| `SESSION_SECRET` | Yes | **Private** | `<random-64-character-hex-string>` | Signs Hydrogen session cookies. Generate a different value for local, Preview, and Production. |
| `PUBLIC_STORE_DOMAIN` | Yes | Public identifier | `<store>.myshopify.com` | Shopify store domain from the Hydrogen/Headless channel. Do not use the custom storefront domain here. |
| `PUBLIC_STOREFRONT_API_TOKEN` | Yes | Public token | `<public-storefront-token>` | Public Storefront API token created by Shopify. This is not an Admin API token. |
| `PRIVATE_STOREFRONT_API_TOKEN` | Recommended in production | **Private** | `<private-storefront-token>` | Server-side Storefront API token. Oxygen normally provisions it. Never expose it in browser code. |
| `WEAVERSE_PROJECT_ID` | Yes | Public identifier | `<weaverse-project-id>` | Weaverse Studio project settings, project URL, or setup prompt. |
| `WEAVERSE_API_KEY` | No for normal rendering | **Private** | `<weaverse-api-key>` | Authenticated Weaverse API or automation operations. Not required for Studio editing. |
| `WEAVERSE_HOST` | No | Configuration | `https://studio.weaverse.io` | Set only for an approved custom/staging Weaverse host; otherwise omit it. |
| `WEAVERSE_API_BASE` | No | Configuration | `https://api.weaverse.io` | Optional custom Weaverse API base; omit for normal Studio use. |

### Shopify checkout, accounts, and analytics

| Variable | Required | Exposure | Placeholder | Purpose/source |
| --- | --- | --- | --- | --- |
| `PUBLIC_CHECKOUT_DOMAIN` | For checkout/consent | Public identifier | `<store>.myshopify.com` | Checkout domain from the same connected storefront. Usually provisioned by Hydrogen. |
| `PUBLIC_STOREFRONT_ID` | For complete analytics | Public identifier | `<hydrogen-storefront-id>` | Numeric Hydrogen storefront ID used by Shopify analytics. |
| `PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID` | For `/account` | Public client ID | `<customer-account-client-id>` | Customer Account API settings in the Hydrogen/Headless channel. |
| `PUBLIC_CUSTOMER_ACCOUNT_API_URL` | For custom account configuration | Public URL | `https://shopify.com/<shop-id>/account/customer/api` | Normally provisioned by Shopify; keep the pulled value. |
| `SHOP_ID` | For customer accounts | Public identifier | `<shop-id>` | Shopify shop identifier used by Hydrogen's Customer Account client. |
| `PUBLIC_GOOGLE_GTM_ID` | No | Public identifier | `GTM-XXXXXXX` | Optional Google Tag Manager container ID. |

### Optional Naturélle integrations and content

| Variable | Exposure | Placeholder | Feature |
| --- | --- | --- | --- |
| `JUDGEME_PRIVATE_API_TOKEN` | **Private** | `<judgeme-private-api-token>` | Judge.me product ratings, reviews, and review submission. |
| `KLAVIYO_PRIVATE_API_TOKEN` | **Private** | `<klaviyo-private-api-token>` | Newsletter and back-in-stock APIs. |
| `KLAVIYO_NEWSLETTER_LIST_ID` | Server configuration | `<klaviyo-newsletter-list-id>` | Klaviyo list that receives newsletter subscriptions. |
| `PRODUCT_CUSTOM_DATA_METAFIELD` | Configuration | `<namespace.key>` | Product metafield read by product storytelling and hotspot sections; defaults to `custom.details` in code. |
| `METAOBJECT_COLORS_TYPE` | Configuration | `<shopify-metaobject-type>` | Shopify metaobject type used for color/image swatches. |

See [Third-party integrations](integrations.md) for provider scopes, setup, and
feature-specific behavior. Keep all real credentials in `.env`, Oxygen, or the
team's secret manager.

## 5. Connect Naturélle to Shopify

### Recommended: Hydrogen sales channel and Shopify CLI

Use this path for stores that deploy to Oxygen.

1. Install the [Hydrogen sales channel](https://apps.shopify.com/hydrogen) in
   Shopify.
2. Create a Hydrogen storefront or connect this repository to an existing one.
3. Authenticate and link the local repository:

   ```bash
   npx shopify hydrogen link
   ```

4. Pull Shopify-managed variables:

   ```bash
   npx shopify hydrogen env pull
   ```

5. Re-add or verify `SESSION_SECRET`, `WEAVERSE_PROJECT_ID`, and optional
   integration variables after the pull. The CLI may replace `.env`; keep a
   secure backup outside Git.
6. Run `npm run codegen`, restart `npm run dev`, and verify products,
   collections, cart, and checkout.

Shopify CLI command reference:
<https://shopify.dev/docs/api/shopify-cli/hydrogen>.

### Alternative: Headless sales channel

For external hosting or a store that does not use the Hydrogen channel,
install the [Headless sales channel](https://apps.shopify.com/headless), create
Storefront API credentials, and add them manually to `.env`.

At minimum, configure:

- `PUBLIC_STORE_DOMAIN`
- `PUBLIC_STOREFRONT_API_TOKEN`
- `PRIVATE_STOREFRONT_API_TOKEN` when server-side private access is available
- the Customer Account API variables when `/account` must work

Do not put a Shopify Admin API token in a Storefront API variable. Public and
private Storefront API tokens have different exposure and permissions.

### Customer Account API in local development

Customer Account OAuth requires approved callback, origin, and logout URLs and
does not authenticate against bare `localhost`. Start the project with:

```bash
npm run dev:ca
```

Follow the Shopify CLI prompts for the development URL. If needed, expose port
3456 through a stable HTTPS tunnel and add these URLs to the Shopify Customer
Account API application:

```text
Callback: https://<development-domain>/account/authorize
Origin:   https://<development-domain>
Logout:   https://<development-domain>
```

Do not add a temporary developer URL to production account settings without
coordinating with the team.

## 6. Connect and use Weaverse Studio

1. Install the [Weaverse Hydrogen Customizer](https://apps.shopify.com/weaverse)
   and open the Naturélle project in Weaverse Studio.
2. Copy the project ID from Project settings, the project URL, or the setup
   prompt into `WEAVERSE_PROJECT_ID` in `.env`.
3. Start Naturélle with `npm run dev`.
4. In Studio, open **Project settings → Manage URLs / Preview URLs** and add:

   ```text
   http://localhost:3456
   ```

   Include the protocol, use `localhost` rather than `127.0.0.1`, and omit the
   trailing slash.
5. Select the local URL in Studio and confirm the preview connects and renders
   the current page.

If Studio cannot reach localhost, use an HTTPS tunnel and register that URL
instead. `WEAVERSE_API_KEY` is not required to edit pages in Studio or render
published content; keep it server-only when an authenticated workflow needs it.

### How Weaverse content reaches the storefront

- Routes call `context.weaverse.loadPage(...)` for a page type and handle.
- `app/weaverse/index.tsx` renders the returned Weaverse component tree.
- Available sections and blocks are registered in
  `app/weaverse/components.ts`.
- Global settings are loaded with `context.weaverse.loadThemeSettings()` and
  exposed through Weaverse's theme settings context.
- A component that is not registered cannot be inserted in Studio.

Studio publishes content for a Weaverse project. It does not deploy a new
version of the React/Hydrogen application.

## 7. Customize Naturélle

### Merchant workflow in Studio

Use Studio for content and presentation changes that should not require a code
deployment:

1. Select the page or template.
2. Add, remove, or reorder sections.
3. Select Shopify products, collections, blogs, or media.
4. Edit section content and layout settings.
5. Open **Theme settings** to change global branding, typography, colors,
   buttons, product cards, badges, forms, page width, spacing, announcement bar,
   header, and footer options.
6. Check desktop and mobile previews.
7. Publish the page/theme changes when ready.

Publishing Studio content and deploying code are separate actions. Published
content is read by the currently deployed app through `WEAVERSE_PROJECT_ID`.

### Developer workflow

| Change | Primary location |
| --- | --- |
| Global setting definitions and defaults | `app/weaverse/schema.server.ts` |
| Theme settings mapped to CSS variables | `app/weaverse/style.tsx` |
| Base fonts and global CSS | `app/styles/app.css` |
| Reusable storefront UI | `app/components/` |
| Weaverse sections, blocks, loaders, and presets | `app/sections/` |
| Component registration | `app/weaverse/components.ts` |
| Route data and actions | `app/routes/` |

When adding a section:

1. Create its component and `createSchema()` definition in `app/sections/`.
2. Pass Weaverse's root props (`...rest`) to the rendered root element.
3. Add clear groups, labels, defaults, presets, and mobile behavior.
4. Register the module in `app/weaverse/components.ts`.
5. Verify insertion, editing, and responsive preview in Studio.

## 8. Validate changes

Run focused checks while developing, then the full project checks:

```bash
npm run biome
npm run codegen
npm run typecheck
npm test
npm run routes-check
npm run build
```

For visual or interactive changes, also run:

```bash
npm run e2e
```

`npm run preview` builds and serves the production bundle locally. Use it to
catch differences between the dev server and the Oxygen build.

## 9. Deploy to Shopify Oxygen

### GitHub continuous deployment (recommended)

1. Push Naturélle to a GitHub repository.
2. In Shopify Admin → Hydrogen, create a storefront and connect the existing
   repository.
3. Shopify opens a pull request that adds the Oxygen GitHub workflow. Review
   and merge it; preserve its storefront-ID marker.
4. In **Storefront settings → Environments and variables**, configure Preview
   and Production separately.
5. Keep Shopify's read-only variables. Add `WEAVERSE_PROJECT_ID`, a unique
   `SESSION_SECRET`, and any Naturélle integration variables needed in that
   environment.
6. Run the validation commands locally and push the branch. Non-production
   branches deploy to Preview; the configured production branch deploys to
   Production.
7. Verify the Oxygen URL, catalog, cart, checkout, customer login, Studio
   content, analytics, and enabled integrations.
8. Publish the Hydrogen storefront, attach the custom domain, and register the
   production URL as a Weaverse Preview URL.

Oxygen deployment variables and their values are immutable for an existing
deployment. After adding, changing, or rotating a variable, create a new
deployment.

References:

- <https://shopify.dev/docs/storefronts/headless/hydrogen/deployments/github>
- <https://shopify.dev/docs/storefronts/headless/hydrogen/environments>
- <https://docs.weaverse.io/oxygen-deployment>

### Manual or custom CI deployment

For a linked storefront, deploy directly with:

```bash
npx shopify hydrogen deploy
```

To deploy explicitly to Preview:

```bash
npx shopify hydrogen deploy --preview
```

Custom CI must store `SHOPIFY_HYDROGEN_DEPLOYMENT_TOKEN` as a protected CI
secret. Do not put this token in `.env.example`, browser code, or a repository
file.

## 10. Troubleshooting

### `SESSION_SECRET environment variable is not set`

Generate a random value, add it to local `.env`, and restart `npm run dev`.
Configure a separate value in each Oxygen environment.

### Products, collections, or menus are empty / Storefront API returns 401

- Confirm `PUBLIC_STORE_DOMAIN` is `<store>.myshopify.com`.
- Pull fresh values with `npx shopify hydrogen env pull`.
- Confirm the Storefront API permissions include the queried resources.
- Confirm products and collections are published to the relevant sales channel.
- Restart the dev server after changing `.env`.

### GraphQL or generated TypeScript errors

Run `npm run codegen`, then `npm run typecheck`. If codegen fails, fix the
Shopify connection and credentials before changing generated `.d.ts` files.

### Port 3456 is already in use

Stop the previous Hydrogen process before starting Naturélle again. Studio is
configured for port 3456, so an automatically selected port will leave Studio
pointing to the wrong URL.

### `EMFILE: too many open files, watch`

Close duplicate development servers and other large file-watching processes,
then restart the terminal and `npm run dev`. Exclude generated/build folders
from editor watchers if the issue repeats.

### Weaverse preview is blank, disconnected, or reports `INVALID_URL`

- Confirm `WEAVERSE_PROJECT_ID` belongs to the intended Studio project.
- Use `http://localhost:3456` with a protocol and no trailing slash.
- Use `localhost`, not `127.0.0.1`.
- Confirm `npm run dev` is still running on port 3456.
- Set `WEAVERSE_HOST` only when the team uses a trusted custom host.
- Check whether browser privacy settings block iframe or websocket access.

### A section does not appear in Studio

Confirm it exports a schema and is registered in
`app/weaverse/components.ts`. Also check the schema's page-type condition and
any per-page limit.

### Studio changes do not appear on Oxygen

- Confirm Oxygen uses the same `WEAVERSE_PROJECT_ID` as Studio.
- Confirm the page/theme change was published, not only previewed.
- Add the Oxygen or custom-domain URL to Weaverse Preview URLs.
- Redeploy after changing Oxygen environment variables.

### Customer login redirects fail locally

Bare localhost is not a valid Customer Account OAuth origin. Run
`npm run dev:ca`, use the generated HTTPS development URL, and verify callback,
origin, and logout URLs in Shopify Customer Account API settings.

### Checkout does not open from localhost

Confirm the cart has a valid Shopify checkout URL and that
`PUBLIC_CHECKOUT_DOMAIN` belongs to the connected storefront. Checkout remains
hosted by Shopify and does not stay on localhost.

### Newsletter, back-in-stock, or reviews are unavailable

These integrations fail closed when their server-only variables are missing.
Configure the relevant provider token, restart locally or redeploy on Oxygen,
and inspect server logs. Never expose provider error payloads or tokens to the
browser.

### `env pull` removed Weaverse or integration values

Shopify only knows Shopify-managed values. Restore `WEAVERSE_PROJECT_ID`, the
local `SESSION_SECRET`, and integration variables from the team's secure secret
manager—never from Git history.

### Oxygen deploy succeeds but uses old configuration

Environment-variable changes do not mutate existing Oxygen deployments.
Trigger a new deployment after saving the updated variables.
