import { reactRouter } from "@react-router/dev/vite";
import { hydrogen } from "@shopify/hydrogen/vite";
import { oxygen } from "@shopify/mini-oxygen/vite";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";
import type { Plugin } from "vite";
import { defineConfig } from "vite";
import type { OxfmtConfig } from "vite-plus/fmt";
import type { OxlintConfig } from "vite-plus/lint";

// Carry forward the shared preset's exclusions and the theme's own scope.
const CHECK_IGNORES = [
  "node_modules",
  "dist",
  "build",
  "public",
  ".wrangler",
  "icons",
  "patches",
  "storefront-api.generated.d.ts",
  "customer-account-api.generated.d.ts",
  ".shopify",
  ".react-router",
  "app/utils/string-parser.ts",
  "app/hooks/use-3rd-stuff.ts",
  "pnpm-lock.yaml",
  ".vscode",
  "prisma",
  "vite.config.ts",
  ".weaverse"
];

const FMT = {
  "printWidth": 80,
  "singleQuote": false,
  "semi": true,
  "trailingComma": "all",
  "sortPackageJson": false,
  "embeddedLanguageFormatting": "off",
  "ignorePatterns": [
    ...CHECK_IGNORES,
    "package-lock.json",
    "**/*.{md,mdx,css,scss,less,yaml,yml,html,vue,toml,graphql,gql,hbs,json5}"
  ],
  "overrides": [
    {
      "files": [
        "*.json",
        "*.jsonc"
      ],
      "options": {
        "trailingComma": "none"
      }
    }
  ]
} satisfies OxfmtConfig;

// All category defaults are off; only the mapped Biome rules run.
const LINT = {
  "categories": {
    "correctness": "off",
    "suspicious": "off",
    "pedantic": "off",
    "perf": "off",
    "style": "off",
    "restriction": "off",
    "nursery": "off"
  },
  "plugins": [
    "eslint",
    "typescript",
    "unicorn",
    "oxc",
    "react",
    "jsx-a11y",
    "nextjs"
  ],
  "jsPlugins": [
    "./lint/weaverse.mjs"
  ],
  "ignorePatterns": CHECK_IGNORES,
  "options": {
    "typeAware": true
  },
  "rules": {
    "array-callback-return": "warn",
    "constructor-super": "error",
    "curly": [
      "warn",
      "all"
    ],
    "default-case": "warn",
    "default-case-last": "warn",
    "eqeqeq": [
      "error",
      "always",
      {
        "null": "ignore"
      }
    ],
    "for-direction": "error",
    "getter-return": "error",
    "jsx-a11y/alt-text": "error",
    "jsx-a11y/anchor-ambiguous-text": "error",
    "jsx-a11y/anchor-has-content": "error",
    "jsx-a11y/anchor-is-valid": "error",
    "jsx-a11y/aria-activedescendant-has-tabindex": "error",
    "jsx-a11y/aria-props": "error",
    "jsx-a11y/aria-proptypes": "error",
    "jsx-a11y/aria-role": [
      "error",
      {
        "ignoreNonDOM": true
      }
    ],
    "jsx-a11y/aria-unsupported-elements": "error",
    "jsx-a11y/heading-has-content": "error",
    "jsx-a11y/html-has-lang": "error",
    "jsx-a11y/iframe-has-title": "error",
    "jsx-a11y/img-redundant-alt": "warn",
    "jsx-a11y/interactive-supports-focus": "warn",
    "jsx-a11y/label-has-associated-control": "warn",
    "jsx-a11y/lang": "error",
    "jsx-a11y/media-has-caption": "error",
    "jsx-a11y/mouse-events-have-key-events": "warn",
    "jsx-a11y/no-access-key": "error",
    "jsx-a11y/no-aria-hidden-on-focusable": "error",
    "jsx-a11y/no-autofocus": [
      "error",
      {
        "ignoreNonDOM": true
      }
    ],
    "jsx-a11y/no-distracting-elements": "error",
    "jsx-a11y/no-interactive-element-to-noninteractive-role": "error",
    "jsx-a11y/no-noninteractive-element-to-interactive-role": "error",
    "jsx-a11y/no-noninteractive-tabindex": "error",
    "jsx-a11y/no-redundant-roles": "error",
    "jsx-a11y/prefer-tag-over-role": "warn",
    "jsx-a11y/role-has-required-aria-props": "error",
    "jsx-a11y/role-supports-aria-props": "warn",
    "jsx-a11y/scope": "error",
    "jsx-a11y/tabindex-no-positive": "error",
    "max-params": [
      "warn",
      {
        "max": 4
      }
    ],
    "nextjs/google-font-display": "warn",
    "nextjs/no-img-element": "warn",
    "no-async-promise-executor": "error",
    "no-case-declarations": "error",
    "no-class-assign": "error",
    "no-compare-neg-zero": "error",
    "no-cond-assign": "warn",
    "no-const-assign": "error",
    "no-constant-binary-expression": "warn",
    "no-constant-condition": "error",
    "no-constructor-return": "error",
    "no-control-regex": "error",
    "no-debugger": "error",
    "no-dupe-class-members": "error",
    "no-dupe-else-if": "error",
    "no-dupe-keys": "error",
    "no-duplicate-case": "error",
    "no-empty": "warn",
    "no-empty-character-class": "error",
    "no-empty-function": "warn",
    "no-empty-pattern": "error",
    "no-empty-static-block": "warn",
    "no-eval": "error",
    "no-ex-assign": "warn",
    "no-fallthrough": "error",
    "no-func-assign": "error",
    "no-global-assign": "error",
    "no-implicit-coercion": "warn",
    "no-implied-eval": "error",
    "no-import-assign": "error",
    "no-inner-declarations": [
      "error",
      "functions",
      {
        "blockScopedFunctions": "allow"
      }
    ],
    "no-irregular-whitespace": "warn",
    "no-label-var": "error",
    "no-labels": [
      "warn",
      {
        "allowLoop": true
      }
    ],
    "no-lonely-if": "warn",
    "no-loss-of-precision": "error",
    "no-misleading-character-class": "error",
    "no-new-native-nonconstructor": "error",
    "no-nonoctal-decimal-escape": "error",
    "no-obj-calls": "error",
    "no-plusplus": "warn",
    "no-proto": "warn",
    "no-prototype-builtins": "warn",
    "no-regex-spaces": "warn",
    "no-return-assign": "warn",
    "no-self-assign": "error",
    "no-self-compare": "error",
    "no-sequences": "warn",
    "no-setter-return": "error",
    "no-shadow": "warn",
    "no-shadow-restricted-names": "error",
    "no-sparse-arrays": "error",
    "no-template-curly-in-string": "warn",
    "no-this-before-super": "error",
    "no-unreachable": "error",
    "no-unsafe-finally": "error",
    "no-unsafe-negation": "error",
    "no-unsafe-optional-chaining": "error",
    "no-unused-expressions": "warn",
    "no-unused-labels": "warn",
    "no-unused-private-class-members": "warn",
    "no-unused-vars": [
      "warn",
      {
        "vars": "local",
        "varsIgnorePattern": ".*",
        "args": "all",
        "argsIgnorePattern": "^_",
        "caughtErrors": "none"
      }
    ],
    "no-use-before-define": [
      "warn",
      {
        "functions": false,
        "classes": false,
        "variables": false
      }
    ],
    "no-useless-backreference": "warn",
    "no-useless-catch": "warn",
    "no-useless-escape": "warn",
    "no-void": "warn",
    "no-with": "error",
    "operator-assignment": "warn",
    "oxc/approx-constant": "warn",
    "oxc/bad-min-max-func": "error",
    "oxc/misrefactored-assign-op": "error",
    "oxc/no-accumulating-spread": "warn",
    "oxc/no-const-enum": "warn",
    "prefer-arrow-callback": [
      "warn",
      {
        "allowNamedFunctions": true
      }
    ],
    "prefer-numeric-literals": "warn",
    "prefer-regex-literals": "warn",
    "prefer-rest-params": "warn",
    "prefer-template": "warn",
    "radix": "warn",
    "react/button-has-type": "warn",
    "react/exhaustive-deps": "warn",
    "react/jsx-no-comment-textnodes": "error",
    "react/jsx-no-duplicate-props": "error",
    "react/jsx-no-script-url": "error",
    "react/jsx-no-target-blank": "error",
    "react/no-children-prop": "warn",
    "react/rules-of-hooks": "warn",
    "react/void-dom-elements-no-children": "error",
    "require-yield": "error",
    "typescript/adjacent-overload-signatures": "warn",
    "typescript/array-type": [
      "warn",
      {
        "default": "array"
      }
    ],
    "typescript/ban-ts-comment": [
      "warn",
      {
        "ts-ignore": true,
        "ts-expect-error": false,
        "ts-nocheck": false,
        "ts-check": false
      }
    ],
    "typescript/consistent-type-exports": "warn",
    "typescript/consistent-type-imports": [
      "warn",
      {
        "fixStyle": "inline-type-imports"
      }
    ],
    "typescript/dot-notation": "warn",
    "typescript/explicit-member-accessibility": [
      "warn",
      {
        "accessibility": "no-public"
      }
    ],
    "typescript/no-deprecated": "warn",
    "typescript/no-duplicate-enum-values": "warn",
    "typescript/no-empty-interface": [
      "error",
      {
        "allowSingleExtends": true
      }
    ],
    "typescript/no-empty-object-type": [
      "warn",
      {
        "allowInterfaces": "with-single-extends"
      }
    ],
    "typescript/no-extra-non-null-assertion": "warn",
    "typescript/no-invalid-void-type": [
      "warn",
      {
        "allowInGenericTypeArguments": true
      }
    ],
    "typescript/no-misused-new": "error",
    "typescript/no-non-null-asserted-optional-chain": "error",
    "typescript/no-non-null-assertion": "warn",
    "typescript/no-unsafe-declaration-merging": "error",
    "typescript/no-wrapper-object-types": "warn",
    "typescript/parameter-properties": "warn",
    "typescript/prefer-for-of": "warn",
    "typescript/prefer-literal-enum-member": "warn",
    "typescript/prefer-namespace-keyword": "error",
    "typescript/prefer-optional-chain": "warn",
    "typescript/prefer-readonly": "warn",
    "unicorn/new-for-builtins": "warn",
    "unicorn/no-array-for-each": "warn",
    "unicorn/no-document-cookie": "warn",
    "unicorn/no-empty-file": "warn",
    "unicorn/no-instanceof-array": "warn",
    "unicorn/no-lonely-if": "warn",
    "unicorn/no-thenable": "error",
    "unicorn/prefer-at": "warn",
    "unicorn/prefer-date-now": "warn",
    "unicorn/prefer-math-min-max": "warn",
    "unicorn/throw-new-error": "warn",
    "use-isnan": "error",
    "valid-typeof": "error",
    "weaverse/autocomplete-valid": "error",
    "weaverse/cognitive-complexity": [
      "error",
      50
    ],
    "weaverse/no-unused-imports": "warn",
    "weaverse/prefer-number-predicates": "warn"
  }
} satisfies OxlintConfig;


// Client-only heavy modules replaced with a stub in the SSR build. The
// worker bundle inlines all dynamic imports, so React.lazy alone cannot
// keep them out of the server file — react-player's media stack (hls.js,
// dashjs, media-chrome, Mux/Vimeo) is ~3MB of cold-start parse cost that
// can only ever run in a browser. See app/utils/ssr-client-only-stub.ts.
const SSR_STUBBED_MODULES = new Set(["react-player"]);

function ssrStubClientOnlyModules(): Plugin {
  return {
    name: "ssr-stub-client-only-modules",
    enforce: "pre",
    resolveId(id, _importer, options) {
      if (options?.ssr && SSR_STUBBED_MODULES.has(id)) {
        return fileURLToPath(
          new URL("./app/utils/ssr-client-only-stub.ts", import.meta.url),
        );
      }
      return null;
    },
  };
}

export default defineConfig(({ isSsrBuild }) => ({
  fmt: FMT,
  lint: LINT,
  plugins: [
    hydrogen(),
    oxygen(),
    reactRouter(),
    tailwindcss(),
    ssrStubClientOnlyModules(),
  ],
  resolve: {
    tsconfigPaths: true,
  },
  build: {
    // Allow a strict Content-Security-Policy
    // without inlining assets as base64:
    assetsInlineLimit: 0,
    ...(!isSsrBuild && {
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            // Do NOT force react-player into a manual chunk: it is
            // lazy()-imported only by the video-banner section. Co-locating it
            // with an eager dep (swiper) drags its media stack onto every page
            // and defeats the lazy boundary. Let Rollup split it with its
            // dynamic import.
            if (id.includes("swiper")) return "vendor-media";
            if (id.includes("@radix-ui")) return "vendor-radix";
          },
        },
      },
    }),
  },
  server: {
    hmr: process.env.HMR !== "false",
    warmup: {
      clientFiles: [
        "./app/routes/**/*",
        "./app/sections/**/*",
        "./app/components/**/*",
      ],
    },
    allowedHosts: true,
  },
  ssr: {
    optimizeDeps: {
      // Vite 8's SSR optimizer appends its cache-busting query to Phosphor's
      // relative icon imports. MiniOxygen then receives paths such as
      // `XSquare.es.js?v=...` and rejects the otherwise existing file. The
      // package is native ESM, so it does not need dependency optimization.
      exclude: ["@phosphor-icons/react"],
      /**
       * Include dependencies here if they throw CJS<>ESM errors.
       * For example, for the following error:
       *
       * > ReferenceError: module is not defined
       * >   at /Users/.../node_modules/example-dep/index.js:1:1
       *
       * Include 'example-dep' in the array below.
       * @see https://vitejs.dev/config/dep-optimization-options
       */
      include: [
        "@radix-ui/react-primitive",
        "ts-easing",
        "fast-shallow-equal",
        "react-universal-interface",
        "screenfull",
        "nano-css/addon/vcssom/cssToTree",
        "nano-css/addon/vcssom",
        "nano-css/addon/cssom",
        "nano-css",
        "copy-to-clipboard",
        "fast-deep-equal/react",
        "react-use/lib/useWindowScroll",
        "typographic-trademark",
        "typographic-single-spaces",
        "typographic-registered-trademark",
        "typographic-math-symbols",
        "typographic-en-dashes",
        "typographic-em-dashes",
        "typographic-ellipses",
        "typographic-currency",
        "typographic-copyright",
        "typographic-apostrophes-for-possessive-plurals",
        "typographic-quotes",
        "typographic-apostrophes",
        "textr",
        "typographic-base",
      ],
    },
  },
}));
