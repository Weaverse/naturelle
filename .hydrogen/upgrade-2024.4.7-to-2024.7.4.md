# Hydrogen upgrade guide: 2024.4.7 to 2024.7.4

----

## Features

### Simplified creation of app context. [#2333](https://github.com/Shopify/hydrogen/pull/2333)

#### Step: 1. Create a app/lib/context file and use `createHydrogenContext` in it. [#2333](https://github.com/Shopify/hydrogen/pull/2333)

[#2333](https://github.com/Shopify/hydrogen/pull/2333)
```.ts
// in app/lib/context

import {createHydrogenContext} from '@shopify/hydrogen';

export async function createAppLoadContext(
  request: Request,
  env: Env,
  executionContext: ExecutionContext,
) {
    const hydrogenContext = createHydrogenContext({
      env,
      request,
      cache,
      waitUntil,
      session,
      i18n: {language: 'EN', country: 'US'},
      cart: {
        queryFragment: CART_QUERY_FRAGMENT,
      },
      // ensure to overwrite any options that is not using the default values from your server.ts
    });

  return {
    ...hydrogenContext,
    // declare additional Remix loader context
  };
}

```

#### Step: 2. Use `createAppLoadContext` method in server.ts Ensure to overwrite any options that is not using the default values in `createHydrogenContext` [#2333](https://github.com/Shopify/hydrogen/pull/2333)

[#2333](https://github.com/Shopify/hydrogen/pull/2333)
```diff
// in server.ts

- import {
-   createCartHandler,
-   createStorefrontClient,
-   createCustomerAccountClient,
- } from '@shopify/hydrogen';
+ import {createAppLoadContext} from '~/lib/context';

export default {
  async fetch(
    request: Request,
    env: Env,
    executionContext: ExecutionContext,
  ): Promise<Response> {

-   const {storefront} = createStorefrontClient(
-     ...
-   );

-   const customerAccount = createCustomerAccountClient(
-     ...
-   );

-   const cart = createCartHandler(
-     ...
-   );

+   const appLoadContext = await createAppLoadContext(
+      request,
+      env,
+      executionContext,
+   );

    /**
      * Create a Remix request handler and pass
      * Hydrogen's Storefront client to the loader context.
      */
    const handleRequest = createRequestHandler({
      build: remixBuild,
      mode: process.env.NODE_ENV,
-      getLoadContext: (): AppLoadContext => ({
-        session,
-        storefront,
-        customerAccount,
-        cart,
-        env,
-        waitUntil,
-      }),
+      getLoadContext: () => appLoadContext,
    });
  }
```

#### Step: 3. Use infer type for AppLoadContext in env.d.ts [#2333](https://github.com/Shopify/hydrogen/pull/2333)

[#2333](https://github.com/Shopify/hydrogen/pull/2333)
```diff
// in env.d.ts

+ import type {createAppLoadContext} from '~/lib/context';

+ interface AppLoadContext extends Awaited<ReturnType<typeof createAppLoadContext>> {
- interface AppLoadContext {
-  env: Env;
-  cart: HydrogenCart;
-  storefront: Storefront;
-  customerAccount: CustomerAccount;
-  session: AppSession;
-  waitUntil: ExecutionContext['waitUntil'];
}

```

### Optimistic variant [#2113](https://github.com/Shopify/hydrogen/pull/2113)

#### Step: 1. Example of product display page update [#2113](https://github.com/Shopify/hydrogen/pull/2113)

[#2113](https://github.com/Shopify/hydrogen/pull/2113)
```.tsx
function Product() {
  const {product, variants} = useLoaderData<typeof loader>();

  // The selectedVariant optimistically changes during page
  // transitions with one of the preloaded product variants
  const selectedVariant = useOptimisticVariant(
    product.selectedVariant,
    variants,
  );

  return <ProductMain selectedVariant={selectedVariant} />;
}
```

#### Step: 2. Optional <VariantSelector /> update [#2113](https://github.com/Shopify/hydrogen/pull/2113)

[#2113](https://github.com/Shopify/hydrogen/pull/2113)
```diff
<VariantSelector
  handle={product.handle}
  options={product.options}
+  waitForNavigation
>
  ...
</VariantSelector>
```

### [Breaking Change] New session commit pattern [#2137](https://github.com/Shopify/hydrogen/pull/2137)

#### Step: 1. Add isPending implementation in session [#2137](https://github.com/Shopify/hydrogen/pull/2137)

[#2137](https://github.com/Shopify/hydrogen/pull/2137)
```diff
// in app/lib/session.ts
export class AppSession implements HydrogenSession {
+  public isPending = false;

  get unset() {
+    this.isPending = true;
    return this.#session.unset;
  }

  get set() {
+    this.isPending = true;
    return this.#session.set;
  }

  commit() {
+    this.isPending = false;
    return this.#sessionStorage.commitSession(this.#session);
  }
}
```

#### Step: 2. update response header if `session.isPending` is true [#2137](https://github.com/Shopify/hydrogen/pull/2137)

[#2137](https://github.com/Shopify/hydrogen/pull/2137)
```diff
// in server.ts
export default {
  async fetch(request: Request): Promise<Response> {
    try {
      const response = await handleRequest(request);

+      if (session.isPending) {
+        response.headers.set('Set-Cookie', await session.commit());
+      }

      return response;
    } catch (error) {
      ...
    }
  },
};
```

#### Step: 3. remove setting cookie with `session.commit()` in routes [#2137](https://github.com/Shopify/hydrogen/pull/2137)

[#2137](https://github.com/Shopify/hydrogen/pull/2137)
```diff
// in route files
export async function loader({context}: LoaderFunctionArgs) {
  return json({},
-    {
-      headers: {
-        'Set-Cookie': await context.session.commit(),
-      },
    },
  );
}
```

----

----

## Fixes

### Fix an infinite redirect when viewing the cached version of a Hydrogen site on Google Web Cache [#2334](https://github.com/Shopify/hydrogen/pull/2334)

#### Update your entry.server.jsx file to include this check
[#2334](https://github.com/Shopify/hydrogen/pull/2334)
```diff
+ if (!window.location.origin.includes("webcache.googleusercontent.com")) {
   startTransition(() => {
     hydrateRoot(
       document,
       <StrictMode>
         <RemixBrowser />
       </StrictMode>
     );
   });
+ }
```

### Remix upgrade and use Layout component in root file. This new pattern will eliminate the use of useLoaderData in ErrorBoundary and clean up the root file of duplicate code. [#2290](https://github.com/Shopify/hydrogen/pull/2290)

#### Step: 1. Refactor App export to become Layout export [#2290](https://github.com/Shopify/hydrogen/pull/2290)

[#2290](https://github.com/Shopify/hydrogen/pull/2290)
```diff
-export default function App() {
+export function Layout({children}: {children?: React.ReactNode}) {
  const nonce = useNonce();
-  const data = useLoaderData<typeof loader>();
+  const data = useRouteLoaderData<typeof loader>('root');

  return (
    <html>
    ...
      <body>
-        <Layout {...data}>
-          <Outlet />
-        </Layout>
+        {data? (
+          <PageLayout {...data}>{children}</PageLayout>
+         ) : (
+          children
+        )}
      </body>
    </html>
  );
}
```

#### Step: 2. Simplify default App export [#2290](https://github.com/Shopify/hydrogen/pull/2290)

[#2290](https://github.com/Shopify/hydrogen/pull/2290)
```diff
+export default function App() {
+  return <Outlet />;
+}
```

#### Step: 3. Remove wrapping layout from ErrorBoundary [#2290](https://github.com/Shopify/hydrogen/pull/2290)

[#2290](https://github.com/Shopify/hydrogen/pull/2290)
```diff
export function ErrorBoundary() {
- const rootData = useLoaderData<typeof loader>();

  return (
-    <html>
-    ...
-      <body>
-        <Layout {...rootData}>
-          <div className="route-error">
-            <h1>Error</h1>
-            ...
-          </div>
-        </Layout>
-      </body>
-    </html>
+    <div className="route-error">
+      <h1>Error</h1>
+      ...
+    </div>
  );
}
```

### [Breaking Change] `<VariantSelector />` improved handling of options [#1198](https://github.com/Shopify/hydrogen/pull/1198)

#### Update options prop when using <VariantSelector />
[#1198](https://github.com/Shopify/hydrogen/pull/1198)
```diff
 <VariantSelector
   handle={product.handle}
+  options={product.options.filter((option) => option.values.length > 1)}
-  options={product.options}
   variants={variants}>
 </VariantSelector>
```
