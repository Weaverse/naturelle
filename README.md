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

Efficient deployment options:
- [Deploy directly to Shopify Oxygen](https://weaverse.io/docs/deployment/oxygen)
- [Deploy using Vercel](https://wvse.cc/deploy-pilot-to-vercel)

## Getting Started

**Prerequisites:**
- Ensure you have Node.js version 22.12.0 or higher installed.

**Setup Instructions:**
1. Download [Weaverse Hydrogen](https://apps.shopify.com/weaverse) from the Shopify App Store.
2. Launch a new Hydrogen storefront within Weaverse.
3. Use the `@weaverse/cli` to initialize the project and start a local development server as guided in the Weaverse editor.
   ![Init Weaverse Storefront](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/New_storefront.png?v=1699244454)
4. Dive into the Weaverse editor to personalize and enhance your storefront to meet your brand needs.

## Local Development

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

## Verification

Before submitting changes, run the same core checks used by the project:

```bash
npm run biome
npm run codegen
npm run typecheck
npm run routes-check
npm run build
```

## Documentation and Resources

For more detailed guidance:
- [Weaverse Documentation](https://weaverse.io/docs)
- [Hydrogen Documentation](https://shopify.dev/custom-storefronts/hydrogen)
- [React Router documentation](https://reactrouter.com/)
- [Biome documentation](https://biomejs.dev/)
- [Tailwind CSS documentation](https://tailwindcss.com/)
