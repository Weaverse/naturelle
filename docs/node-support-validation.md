# Upstream Node candidate validation

Candidate policy: Node.js `^22.18.0 || ^24.11.0`, npm 10.9.8, and the published
dependency graph recorded in `package-lock.json`.
Lockfile SHA-256:
`0614b4bfd7ed816168fb558137373c9f5d0d02015128fbb34ca92b8fefa74af9`.

The current lock hash supersedes the original Node-migration candidate after
the repository replaced Biome with Vite+ and added the Cormorant font package.
It is not expected to change for source-only commits.

## Automated compatibility evidence

The manually triggered
[Node compatibility workflow](https://github.com/Weaverse/naturelle/actions/runs/45934548577)
completed successfully on November 27, 2026, for candidate commit
`b288281b54dece89e1f387a93a1f9d851fb95477` and the lockfile hash above.
It covered the exact supported minimums and the current patched releases on
GitHub-hosted Linux, macOS and Windows runners.

| Runtime | Linux | macOS | Windows |
| --- | --- | --- | --- |
| 22.18.0 | Passed | Passed | Passed after rerun |
| Current Node 22 patch | Passed | Passed | Passed after rerun |
| 24.11.0 | Passed | Passed | Passed |
| Current Node 24 patch | Passed | Passed | Passed |

Every matrix job ran a strict clean install, selected dependency-graph check,
GraphQL codegen, typecheck, localization check, unit tests, production build,
and the credential-free dev/optimizer/Oxygen worker probe. The first Windows
Node 22 SSR requests exceeded the original 120-second request limit; reruns
completed with the same code and lockfile. The probe now allows 240 seconds for
the first Windows SSR request while preserving every response assertion.

The runtime probe uses an empty environment and strips merchant credentials
from the child process. Shopify catalog rendering and Weaverse Studio behavior
are recorded separately below.

## Storefront and Studio acceptance

Manual acceptance was completed on November 27, 2026, against the same
`b288281b54dece89e1f387a93a1f9d851fb95477` candidate and lockfile using Node
24.19.0 and npm 11.17.0. Approved disposable Shopify and Weaverse configuration
was used; store and project identifiers are intentionally not committed.

- Home, product and collection pages rendered with real Shopify catalog data.
- Weaverse Studio connected to the storefront.
- Section edits appeared after revalidation.
- Published changes persisted on the storefront.
- Reloading and reconnecting Studio preserved the published content.

## Full dependency graph audit

`npm ls --all` still exits nonzero for peer declarations already represented
by the `main` lockfile: React/React Router peer-range mismatches, a Picomatch
peer mismatch, and missing video-library peers (`three` and several
`@svta/cml-*` packages). The relevant locked versions and peer declarations are
unchanged by this Node migration. The selected Shopify/Vite/Rolldown/Motion
graph passes and routine installation continues to use the repository's
existing `legacy-peer-deps` setting. This record does not claim that unrelated
full-graph debt is resolved.

## Outstanding acceptance

- The black-box MiniOxygen regressions fail against published 4.2.3 for public
  asset CORS, external-symlink containment and HTTP error disclosure. See
  [`node-upstream-security.md`](node-upstream-security.md). These checks remain
  available as manual diagnostics, with unchanged assertions, outside CI by
  maintainer decision. They remain owned by Shopify upstream.
- Published Weaverse CLI onboarding remains blocked by
  [Weaverse/weaverse#565](https://github.com/Weaverse/weaverse/issues/565)
  until a released installer preserves the committed npm lockfile. Version
  5.9.0 was still the latest published `@weaverse/cli` release when this record
  was updated, so this acceptance item is not reported as passed.
