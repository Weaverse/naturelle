import { definePlugin, defineRule } from "vite-plus/lint/plugins";

const FUNCTION_TYPES = new Set([
  "ArrowFunctionExpression",
  "FunctionDeclaration",
  "FunctionExpression",
]);
const NESTED_FLOW_TYPES = new Set([
  "CatchClause",
  "ConditionalExpression",
  "DoWhileStatement",
  "ForInStatement",
  "ForOfStatement",
  "ForStatement",
  "IfStatement",
  "SwitchStatement",
  "WhileStatement",
]);
const AUTOCOMPLETE_VALUES = new Set(
  `additional-name address-level1 address-level2 address-level3 address-level4
   address-line1 address-line2 address-line3 bday bday-day bday-month bday-year
   cc-additional-name cc-csc cc-exp cc-exp-month cc-exp-year cc-family-name
   cc-given-name cc-name cc-number cc-type country country-name current-password
   email family-name given-name honorific-prefix honorific-suffix impp language
   name new-password nickname off on one-time-code organization
   organization-title photo postal-code sex street-address tel tel-area-code
   tel-country-code tel-extension tel-local tel-national transaction-amount
   transaction-currency url username webauthn`
    .trim()
    .split(/\s+/),
);

// Biome measures cognitive (not cyclomatic) complexity and scores nested
// functions separately, starting at their enclosing depth.
const COGNITIVE_COMPLEXITY = defineRule({
  meta: {
    schema: [{ type: "integer", minimum: 1, maximum: 254 }],
    messages: { limit: "Cognitive complexity is {{score}} (max: {{max}})." },
  },
  create(context) {
    let [max] = context.options;
    let stack = [];
    function enter(node) {
      let frame = stack.at(-1);
      if (FUNCTION_TYPES.has(node.type)) {
        if (stack.length === 10) {
          frame.score = 255;
        }
        stack.push({
          score: 0,
          depth: (frame?.depth ?? -1) + 1,
          logical: null,
        });
        return;
      }
      if (!frame) {
        return;
      }
      if (NESTED_FLOW_TYPES.has(node.type)) {
        let elseIf =
          node.type === "IfStatement" && node.parent?.alternate === node;
        frame.score += 1 + frame.depth - Number(elseIf);
        frame.depth += Number(!elseIf);
      }
      if (
        (node.parent?.type === "IfStatement" &&
          node.parent.alternate === node &&
          node.type !== "IfStatement") ||
        (node.parent?.type === "TryStatement" &&
          node.parent.finalizer === node) ||
        node.type === "WithStatement" ||
        ((node.type === "BreakStatement" ||
          node.type === "ContinueStatement") &&
          node.label)
      ) {
        frame.score += 1;
      }
      if (
        node.type === "LogicalExpression" &&
        frame.logical !== node.operator
      ) {
        frame.score += 1;
      }
      frame.logical = node.type === "LogicalExpression" ? node.operator : null;
    }
    function exit(node) {
      let frame = stack.at(-1);
      if (FUNCTION_TYPES.has(node.type)) {
        stack.pop();
        if (stack.length <= 10 && frame.score > max) {
          context.report({
            node: node.id ?? node.parent?.key ?? node,
            messageId: "limit",
            data: { score: Math.min(frame.score, 255), max },
          });
        }
      } else if (frame && NESTED_FLOW_TYPES.has(node.type)) {
        let elseIf =
          node.type === "IfStatement" && node.parent?.alternate === node;
        frame.depth -= Number(!elseIf);
      }
    }
    return { "*": enter, "*:exit": exit };
  },
});

// The theme enables unused imports but disables unused locals. Oxlint's
// no-unused-vars cannot enable imports without enabling locals too.
const NO_UNUSED_IMPORTS = defineRule({
  meta: { messages: { unused: "This import is unused." } },
  create(context) {
    return {
      ImportDeclaration(node) {
        for (let binding of context.sourceCode.getDeclaredVariables(node)) {
          if (binding.references.length === 0) {
            context.report({
              node: binding.identifiers[0],
              messageId: "unused",
            });
          }
        }
      },
    };
  },
});

// The built-in rule rejects valid field names such as given-name and family-name.
const AUTOCOMPLETE_VALID = defineRule({
  meta: {
    messages: { invalid: "Use valid values for the autocomplete attribute." },
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        if (node.name.type !== "JSXIdentifier" || node.name.name !== "input") {
          return;
        }
        for (let attr of node.attributes) {
          if (
            attr.type !== "JSXAttribute" ||
            attr.name.type !== "JSXIdentifier" ||
            !["autoComplete", "autocomplete"].includes(attr.name.name)
          ) {
            continue;
          }
          let value = attr.value;
          if (value?.type === "JSXExpressionContainer") {
            value = value.expression;
          }
          if (value?.type !== "Literal" || typeof value.value !== "string") {
            continue;
          }
          let tokens = value.value.trim().split(/\s+/);
          let [first, second] = tokens;
          if (
            !first ||
            first.startsWith("section-") ||
            (first === "none" && !second) ||
            (["billing", "shipping"].includes(first) &&
              AUTOCOMPLETE_VALUES.has(second)) ||
            tokens.every((token) => AUTOCOMPLETE_VALUES.has(token))
          ) {
            continue;
          }
          context.report({ node: attr, messageId: "invalid" });
        }
      },
    };
  },
});

// The native rule also bans parseInt/parseFloat, which the old policy allowed.
const PREFER_NUMBER_PREDICATES = defineRule({
  meta: {
    messages: { number: "Use Number.{{name}} to avoid implicit coercion." },
  },
  create(context) {
    return {
      Identifier(node) {
        if (
          (node.name === "isFinite" || node.name === "isNaN") &&
          context.sourceCode.isGlobalReference(node)
        ) {
          context.report({
            node,
            messageId: "number",
            data: { name: node.name },
          });
        }
      },
    };
  },
});

export default definePlugin({
  meta: { name: "weaverse" },
  rules: {
    "cognitive-complexity": COGNITIVE_COMPLEXITY,
    "no-unused-imports": NO_UNUSED_IMPORTS,
    "autocomplete-valid": AUTOCOMPLETE_VALID,
    "prefer-number-predicates": PREFER_NUMBER_PREDICATES,
  },
});
