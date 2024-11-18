# Hydrogen upgrade guide: 2024.7.4 to 2024.10.0

----

## Features

### Stabilize getSitemap, getSitemapIndex and implement on skeleton [#2589](https://github.com/Shopify/hydrogen/pull/2589)

#### Step: 1. Update the getSitemapIndex at /app/routes/[sitemap.xml].tsx [#2589](https://github.com/Shopify/hydrogen/pull/2589)

[#2589](https://github.com/Shopify/hydrogen/pull/2589)
```diff
- import {unstable__getSitemapIndex as getSitemapIndex} from '@shopify/hydrogen';
+ import {getSitemapIndex} from '@shopify/hydrogen';
```


#### Step: 2. Update the getSitemap at /app/routes/sitemap.$type.$page[.xml].tsx [#2589](https://github.com/Shopify/hydrogen/pull/2589)

[#2589](https://github.com/Shopify/hydrogen/pull/2589)
```diff
- import {unstable__getSitemap as getSitemap} from '@shopify/hydrogen';
+ import {getSitemap} from '@shopify/hydrogen';
```


### H2O compatibility date [#2380](https://github.com/Shopify/hydrogen/pull/2380)

#### Check your project is working properly in an Oxygen deployment
[#2380](https://github.com/Shopify/hydrogen/pull/2380)

----

----

## Fixes

### Make set up cookie banner by default to false [#2588](https://github.com/Shopify/hydrogen/pull/2588)

#### If you are using Shopify's cookie banner to handle user consent in your app, you need to set `withPrivacyBanner: true` to the consent config. Without this update, the Shopify cookie banner will not appear.
[#2588](https://github.com/Shopify/hydrogen/pull/2588)
```diff
  return defer({
    ...
    consent: {
      checkoutDomain: env.PUBLIC_CHECKOUT_DOMAIN,
      storefrontAccessToken: env.PUBLIC_STOREFRONT_API_TOKEN,
+      withPrivacyBanner: true,
      // localize the privacy banner
      country: args.context.storefront.i18n.country,
      language: args.context.storefront.i18n.language,
    },
  });
```


### Deprecate usages of product.options.values and use product.options.optionValues instead [#2585](https://github.com/Shopify/hydrogen/pull/2585)

#### Step: 1. Update your product graphql query to use the new `optionValues` field [#2585](https://github.com/Shopify/hydrogen/pull/2585)

[#2585](https://github.com/Shopify/hydrogen/pull/2585)
```diff
  const PRODUCT_FRAGMENT = `#graphql
    fragment Product on Product {
      id
      title
      options {
        name
-        values
+        optionValues {
+          name
+        }
      }
```


#### Step: 2. Update your `<VariantSelector>` to use the new `optionValues` field [#2585](https://github.com/Shopify/hydrogen/pull/2585)

[#2585](https://github.com/Shopify/hydrogen/pull/2585)
```diff
  <VariantSelector
    handle={product.handle}
-    options={product.options.filter((option) => option.values.length > 1)}
+    options={product.options.filter((option) => option.optionValues.length > 1)}
    variants={variants}
  >
```


### Update all cart mutation methods from createCartHandler to return cart warnings [#2572](https://github.com/Shopify/hydrogen/pull/2572)

#### Check warnings for stock levels
[#2572](https://github.com/Shopify/hydrogen/pull/2572)

### Update createWithCache to make it harder to accidentally cache undesired results [#2546](https://github.com/Shopify/hydrogen/pull/2546)

#### Step: 1. request is now a mandatory prop when initializing createWithCache. [#2546](https://github.com/Shopify/hydrogen/pull/2546)

[#2546](https://github.com/Shopify/hydrogen/pull/2546)
```diff
// server.ts
export default {
  async fetch(
    request: Request,
    env: Env,
    executionContext: ExecutionContext,
  ): Promise<Response> {
    try {
      // ...
-     const withCache = createWithCache({cache, waitUntil});
+     const withCache = createWithCache({cache, waitUntil, request});
```


#### Step: 2. New `withCache.fetch` is for caching simple fetch requests. This method caches the responses if they are OK responses, and you can pass `shouldCacheResponse`, `cacheKey`, etc. to modify behavior. `data` is the consumed body of the response (we need to consume to cache it). [#2546](https://github.com/Shopify/hydrogen/pull/2546)

[#2546](https://github.com/Shopify/hydrogen/pull/2546)
```ts
  const withCache = createWithCache({cache, waitUntil, request});

  const {data, response} = await withCache.fetch<{data: T; error: string}>(
    'my-cms.com/api',
    {
      method: 'POST',
      headers: {'Content-type': 'application/json'},
      body,
    },
    {
      cacheStrategy: CacheLong(),
      // Cache if there are no data errors or a specific data that make this result not suited for caching
      shouldCacheResponse: (result) => !result?.error,
      cacheKey: ['my-cms', body],
      displayName: 'My CMS query',
    },
  );
```


#### Step: 3. The original `withCache` callback function is now `withCache.run`. This is useful to run *multiple* fetch calls and merge their responses, or run any arbitrary code. It caches anything you return, but you can throw if you don't want to cache anything. [#2546](https://github.com/Shopify/hydrogen/pull/2546)

[#2546](https://github.com/Shopify/hydrogen/pull/2546)
```diff
  const withCache = createWithCache({cache, waitUntil, request});

  const fetchMyCMS = (query) => {
-    return withCache(['my-cms', query], CacheLong(), async (params) => {
+    return withCache.run({
+      cacheKey: ['my-cms', query],
+      cacheStrategy: CacheLong(),
+      // Cache if there are no data errors or a specific data that make this result not suited for caching
+      shouldCacheResult: (result) => !result?.errors,
+    }, async(params) => {
      const response = await fetch('my-cms.com/api', {
        method: 'POST',
        body: query,
      });
      if (!response.ok) throw new Error(response.statusText);
      const {data, error} = await response.json();
      if (error || !data) throw new Error(error ?? 'Missing data');
      params.addDebugData({displayName: 'My CMS query', response});
      return data;
    });
  };
```

