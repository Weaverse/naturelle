import assert from "node:assert/strict";
import test from "node:test";
import { getSearchResultsTranslationKey } from "../app/utils/search-results.ts";

test("selects singular and plural search-result translation keys", () => {
  assert.equal(getSearchResultsTranslationKey(1), "search.resultsFor_one");
  assert.equal(getSearchResultsTranslationKey(2), "search.resultsFor_other");
});
