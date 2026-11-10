# Published MiniOxygen security comparison

Candidate: `@shopify/mini-oxygen@4.2.3`, replacing the removed local package
based on 4.2.2. The local package existed for the superseded Node 22.0.0 and
odd-major policy and is not retained by the current upstream-only requirement.

The manual diagnostic suite in `tests/mini-oxygen-security.unit.test.mjs`
imports the installed published package. It retains checks for the removed
local changes rather than weakening or marking them as passing. By maintainer
decision, it runs outside routine CI and the Node compatibility workflow.

| Removed local change | Published upstream status | Impact and ownership |
| --- | --- | --- |
| Credential-free wildcard CORS for public assets | Fails on 4.2.3; black-box regression retained | The response reflects the requesting origin instead of using a credential-free wildcard. Shopify upstream owns a durable fix. |
| Realpath containment for asset files and symlinks | Fails on 4.2.3; black-box regression retained | An external symlink is served instead of being rejected outside the configured asset root. |
| Generic HTTP failure response with server-side diagnostics | Fails on 4.2.3; black-box regression retained | Development-server responses disclose local paths and stacks. |
| Generic Vite worker-entry failure response | Unresolved and documented | Worker load failures expose detailed errors instead of keeping them in local diagnostics. The former test extracted an implementation fragment from the generated bundle and is not retained as a public-behavior regression. |
| Correct bundled stack-frame suffix comparison | Unresolved and documented | The suffix comparison remains in the published bundle. The former test depended on generated function names and bundle layout, so it is documented instead of testing bundle internals. |

Run:

```sh
node --test tests/mini-oxygen-security.unit.test.mjs
```

Record each result against the exact committed lockfile. A failing check is an
explicit upstream acceptance gap; do not restore the fork, patch installed
third-party files, mark the check as expected, or weaken the assertion merely
to make CI green. Completing security acceptance requires an upstream fix or
an explicit maintainer decision about these development-server behaviors.
