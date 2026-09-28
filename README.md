<h1 align="center">Naturelle - Shopify Hydrogen Theme</h1>

_Naturelle is a state-of-the-art Shopify theme, crafted specifically for beauty brands. Leveraging Hydrogen's robust architecture and integrated with React Router 7 and Weaverse, it provides a foundation for building ultra-fast, high-performing online storefronts. Our theme makes it effortless to deliver a seamless shopping experience._

## Demo

Explore Naturelle in action:
- [Live store demo](https://naturelle.weaverse.dev)
- Experiment with customizations on the [Weaverse Playground](https://studio.weaverse.io/demo?theme=naturelle)

![Naturelle demo](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/beauty_preview_desktop.png)

## Features

What you get with Naturelle:
- **Core Technologies**: Hydrogen, React Router 7, and Oxygen for unmatched performance.
- **Development Tools**: Shopify CLI and Biome for linting and formatting.
- **Programming**: Support for both TypeScript and JavaScript.
- **Styling**: Tailwind CSS v4 with its first-party Vite plugin.
- **Rich Components**: A comprehensive set of pre-designed components and routes.
- **Customization**: Fully adaptable through [Weaverse](https://weaverse.io).

## Deployment

Shopify Oxygen is the documented production target for this repository:

- [Naturélle Oxygen deployment steps](docs/setup.md#9-deploy-to-shopify-oxygen)
- [Weaverse Oxygen deployment guide](https://weaverse.io/docs/guides/deployment/oxygen)

## Getting Started

For complete local setup, Shopify and Weaverse connection, environment
variables, theme customization, Oxygen deployment, and troubleshooting, see
the [Naturélle setup and usage guide](docs/setup.md).

**Prerequisites:**
- Ensure you have Node.js version 22.12.0 or higher installed.
- Use the npm package manager included with Node.js.

**Setup overview:**

1. Clone this repository and run commands from the `naturelle/` directory.
2. Install the [Hydrogen sales channel](https://apps.shopify.com/hydrogen) and
   [Weaverse Hydrogen Customizer](https://apps.shopify.com/weaverse) on the
   target Shopify store.
3. Link the project with `npx shopify hydrogen link`, then pull
   Shopify-managed values with `npx shopify hydrogen env pull`.
4. Add `WEAVERSE_PROJECT_ID`, a local `SESSION_SECRET`, and any enabled
   integration credentials to `.env`.
5. Run `npm run dev`, register `http://localhost:3456` as a Weaverse preview
   URL, and open the storefront through Weaverse Studio.

The repository is already initialized; do not scaffold a second Hydrogen or
Weaverse project over this checkout.

## Local Development

Install dependencies and start the development server:

```bash
cp .env.example .env
npm ci
npm run dev
```

Before starting the server, replace the required placeholders in `.env` as
described in the [setup guide](docs/setup.md). The local storefront runs at
<http://localhost:3456>.

## Verification

Before submitting changes, run the same core checks used by the project:

```bash
npm run biome
npm run codegen
npm run typecheck
npm test
npm run routes-check
npm run build
```

## Documentation and Resources

For more detailed guidance:
- [Section usage and page composition guide](docs/sections.md)
- [Third-party integrations](docs/integrations.md)
- [Weaverse Documentation](https://weaverse.io/docs)
- [Hydrogen Documentation](https://shopify.dev/custom-storefronts/hydrogen)
- [React Router documentation](https://reactrouter.com/)
- [Biome documentation](https://biomejs.dev/)
- [Tailwind CSS documentation](https://tailwindcss.com/)
