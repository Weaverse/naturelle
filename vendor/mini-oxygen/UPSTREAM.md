# MiniOxygen compatibility package

Source: `@shopify/mini-oxygen@4.2.2`, MIT, Shopify Inc.

- Tarball: https://registry.npmjs.org/@shopify/mini-oxygen/-/mini-oxygen-4.2.2.tgz
- Integrity: `sha512-XSGz/525678w1VbYXRV4JfF6gtL8nWiFGyCNk+/L3f36LrThRHxCtqufzAbFcaG4G8wSQ/s9XpBfgAo99utXzA==`
- Upstream: https://github.com/Shopify/hydrogen/tree/main/packages/mini-oxygen

The published package limits its declared Node engines to `^22 || ^24`.
Naturelle's contract includes released odd majors and Node 26. This private
compatibility package keeps upstream dependency ranges, peer dependencies
and license unchanged. The local manifest changes only:

- the private version suffix and `private: true`;
- the Node engine to `>=22.0.0`;
- omission of upstream build scripts and development-only dependencies, since
  these are precompiled distribution files, not an upstream development checkout.

The Naturelle compatibility work also applies these scoped runtime patches
originally validated by Aspen's Node compatibility PR:

- `dist/worker/assets.js`: public assets use credential-free wildcard CORS;
  realpath containment rejects paths and symlinks outside the asset directory.
- `dist/node/server.js` and `dist/vite/worker-entry.js`: HTTP failures return
  generic messages; detailed exceptions remain in developer/server logs.
- `dist/vite/worker-entry.js`: the bundled stack-frame formatter uses
  `endsWith` instead of an ambiguous `indexOf` suffix comparison.

These are theme-maintained changes, not claims of upstream patches. Run
`node --test tests/mini-oxygen-security.unit.test.mjs` when updating them.

The repository sets `install-links=true` in `.npmrc`, so npm installs this
`file:` dependency as a packed package rather than a symlink. This is required
for the root dependency security overrides to apply. Keep this setting with
the lockfile, and verify the installed graph with `npm ls`, not just install
exit status.

This is Naturelle-maintained compatibility coverage, not an upstream Shopify
support claim. Widening this declaration alone is insufficient: clean strict
installation, real worker/SSR execution, optimizer, build, catalog rendering
and Studio verification must establish the actual tested matrix. Untested
versions and unavailable native hosts must remain explicitly identified.

Retaining 4.2.2 preserves its Vite Environment API integration, worker/client
resolve separation, standalone preview, and HTTP/2 request conversion.

For updates, verify the npm tarball integrity, compare all `dist` files and
the license byte-for-byte, retain the runtime dependencies/peer ranges, and
review/reapply the manifest adaptation and runtime patches above. All other
distribution files should remain byte-identical. Keep the root dependency security
overrides. Repeat the supported Node/OS matrix and connected Studio check.
Check upstream advisories explicitly: npm audit cannot assess this local
package's source code.
