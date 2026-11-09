# Upstream Node candidate validation

Candidate policy: Node.js `^22.18.0 || ^24.11.0`, npm 10.9.8, and the published
dependency graph recorded in `package-lock.json`. The local results below were
recorded on a native macOS arm64 host on November 8, 2026.
Lockfile SHA-256:
`964a1fba4c9cf59c3d32cf77243b76b69ac6488b6b426f58a42e2eced6c41c9c`.

| Runtime | Strict clean install and selected graph | Codegen, types, tests, localization and build | Dev, worker SSR, client transform and optimizer |
| --- | --- | --- | --- |
| 22.18.0 | Passed | Passed | Passed |
| 24.11.0 | Passed | Passed | Passed |

The application suite contains 53 passing unit tests. The runtime probe uses an
empty environment and strips merchant credentials from the child process. It
does not claim Shopify catalog rendering or a Weaverse Studio connection.

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

- Run the manual native Linux, macOS and Windows compatibility matrix against
  the committed replacement candidate. Local macOS results do not establish
  Linux or Windows support.
- The black-box MiniOxygen regressions fail against published 4.2.3 for public
  asset CORS, external-symlink containment and HTTP error disclosure. See
  [`node-upstream-security.md`](node-upstream-security.md). These checks remain
  strict in CI rather than being skipped or allowed to fail.
- Verify home, product and collection rendering and the Studio connection with
  approved disposable Shopify and Weaverse configuration.
- Published Weaverse CLI onboarding remains blocked by
  [Weaverse/weaverse#565](https://github.com/Weaverse/weaverse/issues/565)
  until a released installer preserves the committed npm lockfile.

Update this record with the replacement commit and native workflow URL after
the branch is pushed and the manual workflow completes.
