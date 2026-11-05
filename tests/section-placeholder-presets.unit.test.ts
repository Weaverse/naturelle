import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import ts from "typescript";

const SECTION_ROOT = join(process.cwd(), "app/sections");
const MEDIA_URL =
  /(?:https?:\/\/|\/)\S+\.(?:avif|gif|jpe?g|mp4|png|svg|webm|webp)(?:\?\S*)?$/i;
const IMAGE_FIELDS =
  /^(?:image|imageSrc|src|backgroundImage|mobileBackgroundImage|posterImage|mobilePosterImage|beforeImage|afterImage|beforeImage1|afterImage2|iconImage)$/;
const SELECTION_FIELDS = new Set([
  "product",
  "products",
  "collection",
  "collections",
  "blogs",
]);

function sectionFiles(directory = SECTION_ROOT): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      return sectionFiles(path);
    }
    return /\.tsx?$/.test(entry.name) ? [path] : [];
  });
}

function propertyName(node: ts.PropertyName) {
  return ts.isIdentifier(node) || ts.isStringLiteral(node)
    ? node.text
    : undefined;
}

function objectProperty(object: ts.ObjectLiteralExpression, name: string) {
  return object.properties.find(
    (property): property is ts.PropertyAssignment =>
      ts.isPropertyAssignment(property) && propertyName(property.name) === name,
  );
}

function isPlaceholder(expression: ts.Expression): boolean {
  if (
    ts.isPropertyAccessExpression(expression) &&
    ts.isIdentifier(expression.expression)
  ) {
    return expression.expression.text === "IMAGES_PLACEHOLDERS";
  }
  if (ts.isObjectLiteralExpression(expression)) {
    const url = objectProperty(expression, "url");
    return Boolean(url && isPlaceholder(url.initializer));
  }
  return (
    expression.kind === ts.SyntaxKind.NullKeyword ||
    (ts.isStringLiteral(expression) && expression.text.trim() === "")
  );
}

function hasSeededSelection(expression: ts.Expression): boolean {
  if (expression.kind === ts.SyntaxKind.NullKeyword) {
    return false;
  }
  if (ts.isArrayLiteralExpression(expression)) {
    return expression.elements.length > 0;
  }
  return !(ts.isStringLiteral(expression) && expression.text.trim() === "");
}

function auditPreset(
  node: ts.Node,
  file: string,
  source: ts.SourceFile,
  violations: string[],
) {
  if (ts.isPropertyAssignment(node)) {
    const name = propertyName(node.name);
    const line = source.getLineAndCharacterOfPosition(node.getStart()).line + 1;
    if (name && IMAGE_FIELDS.test(name) && !isPlaceholder(node.initializer)) {
      violations.push(`${file}:${line} preset ${name}`);
    }
    if (
      name &&
      SELECTION_FIELDS.has(name) &&
      hasSeededSelection(node.initializer)
    ) {
      violations.push(`${file}:${line} preset ${name}`);
    }
    if (
      name &&
      ["video", "videoURL", "videoUrl"].includes(name) &&
      hasSeededSelection(node.initializer)
    ) {
      violations.push(`${file}:${line} preset ${name}`);
    }
  }
  ts.forEachChild(node, (child) =>
    auditPreset(child, file, source, violations),
  );
}

function auditSchemaFile(file: string, violations: string[]) {
  const content = readFileSync(file, "utf8");
  const source = ts.createSourceFile(
    file,
    content,
    ts.ScriptTarget.Latest,
    true,
    file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );

  const visit = (node: ts.Node) => {
    if (
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      node.expression.text === "createSchema" &&
      ts.isObjectLiteralExpression(node.arguments[0])
    ) {
      const schema = node.arguments[0];
      const presets = objectProperty(schema, "presets");
      if (presets) {
        auditPreset(presets.initializer, file, source, violations);
      }

      const auditInput = (candidate: ts.Node) => {
        if (ts.isObjectLiteralExpression(candidate)) {
          const type = objectProperty(candidate, "type")?.initializer;
          const name = objectProperty(candidate, "name")?.initializer;
          const defaultValue = objectProperty(candidate, "defaultValue");
          const inputType =
            type && ts.isStringLiteral(type) ? type.text : undefined;
          const inputName =
            name && ts.isStringLiteral(name) ? name.text : undefined;
          const line =
            source.getLineAndCharacterOfPosition(candidate.getStart()).line + 1;

          if (
            defaultValue &&
            (inputType === "image" ||
              (inputName ? IMAGE_FIELDS.test(inputName) : false)) &&
            !isPlaceholder(defaultValue.initializer)
          ) {
            violations.push(
              `${file}:${line} default ${inputName ?? inputType}`,
            );
          }
          if (
            defaultValue &&
            (inputType === "video" ||
              inputType === "product" ||
              inputType === "collection" ||
              inputType === "collection-list" ||
              inputType === "blog") &&
            hasSeededSelection(defaultValue.initializer)
          ) {
            violations.push(
              `${file}:${line} default ${inputName ?? inputType}`,
            );
          }
        }
        ts.forEachChild(candidate, auditInput);
      };
      auditInput(schema);
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
}

test("section presets and defaults contain only official media placeholders", () => {
  const violations: string[] = [];
  for (const file of sectionFiles()) {
    auditSchemaFile(file, violations);
  }
  assert.deepEqual(violations, []);
});

test("section source contains no external or bundled demo media", () => {
  const violations: string[] = [];
  for (const file of sectionFiles()) {
    const source = ts.createSourceFile(
      file,
      readFileSync(file, "utf8"),
      ts.ScriptTarget.Latest,
      true,
      file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
    );
    const visit = (node: ts.Node) => {
      if (
        (ts.isStringLiteral(node) ||
          ts.isNoSubstitutionTemplateLiteral(node)) &&
        MEDIA_URL.test(node.text)
      ) {
        const line =
          source.getLineAndCharacterOfPosition(node.getStart()).line + 1;
        violations.push(`${file}:${line} ${node.text}`);
      }
      ts.forEachChild(node, visit);
    };
    visit(source);
  }
  assert.deepEqual(violations, []);
});

test("theme and error image defaults use official placeholders", () => {
  const schema = readFileSync(
    join(process.cwd(), "app/weaverse/schema.server.ts"),
    "utf8",
  );
  const root = readFileSync(join(process.cwd(), "app/root.tsx"), "utf8");

  assert.match(schema, /url:\s*IMAGES_PLACEHOLDERS\.logo_black/);
  assert.match(schema, /url:\s*IMAGES_PLACEHOLDERS\.logo_white/);
  assert.match(root, /src=\{IMAGES_PLACEHOLDERS\.banner_1\}/);
});

test("theme settings contain no borrowed brand or marketing defaults", () => {
  const schema = readFileSync(
    join(process.cwd(), "app/weaverse/schema.server.ts"),
    "utf8",
  );
  const settings = schema.slice(schema.indexOf("settings: ["));

  for (const content of [
    "NATURÉLLE",
    "Pure Botanical Alchemy",
    "© 2024 Weaverse",
    "SUMMER SALE",
    "100% Vegan",
    "Certified Cruelty-Free",
    "Dermatologist Tested",
  ]) {
    assert.ok(
      !settings.includes(content),
      `Theme settings still seed: ${content}`,
    );
  }
  assert.doesNotMatch(
    settings,
    /defaultValue:\s*"https:\/\/(?:www\.)?(?:instagram|facebook|pinterest|tiktok|youtube)\.com/,
  );
});
