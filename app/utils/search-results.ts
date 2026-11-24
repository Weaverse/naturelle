export function getSearchResultsTranslationKey(count: number) {
  return count === 1
    ? ("search.resultsFor_one" as const)
    : ("search.resultsFor_other" as const);
}
