import { Link } from "@remix-run/react";
import { Button } from "~/components/button";
import { usePredictiveSearch } from "../../../../hooks/usePredictiveSearch";
import { PredictiveSearchResult } from "../../PredictiveSearchResult";

export function SearchTypeHeaderResults() {
  const { results, totalResults, searchTerm, searchInputRef } =
    usePredictiveSearch();

  let queries = results?.find((result) => result.type === "queries");
  let articles = results?.find((result) => result.type === "articles");
  let products = results?.find((result) => result.type === "products");
  let pages = results?.find((result) => result.type === "pages");
  let totalResultsCount = totalResults || 0;
  function goToSearchResult(event: React.MouseEvent<HTMLAnchorElement>) {
    let type = event.currentTarget.dataset.type;
    if (!searchInputRef.current) return;
    if (type === "SearchQuerySuggestion") {
      searchInputRef.current.value = event.currentTarget.innerText;
      // dispatch event onchange for the search
      searchInputRef.current.focus();
    } else {
      searchInputRef.current.blur();
      searchInputRef.current.value = "";
      // close the aside
      window.location.href = event.currentTarget.href;
    }
  }

  if (!totalResults) {
    return (
      <div className="absolute top-24 z-10 flex w-full items-center justify-center">
        <NoPredictiveSearchResults searchTerm={searchTerm} />
      </div>
    );
  }
  return (
    <div className="absolute left-1/2 top-24 z-10 flex w-fit -translate-x-1/2 items-center justify-center">
      <div className="grid max-h-[80vh] w-screen min-w-[430px] max-w-[720px] grid-cols-1 gap-6 overflow-y-auto border bg-[var(--color-drawer-bg)] p-6 lg:grid-cols-[1fr_2fr]">
        <div className="space-y-8">
          {queries && (
            <div className="flex flex-col gap-4 divide-y divide-border-subtle">
              <PredictiveSearchResult
                goToSearchResult={goToSearchResult}
                items={queries.items}
                key={queries.type}
                searchTerm={searchTerm}
                type={queries.type}
              />
            </div>
          )}
          {articles && (
            <div className="flex flex-col gap-4">
              <PredictiveSearchResult
                goToSearchResult={goToSearchResult}
                items={articles.items}
                key={articles.type}
                searchTerm={searchTerm}
                type={articles.type}
              />
            </div>
          )}
        </div>
        {products && (
          <div className="flex flex-col items-start gap-6">
            <PredictiveSearchResult
              goToSearchResult={goToSearchResult}
              items={products.items}
              key={products.type}
              searchTerm={searchTerm}
              type={products.type}
            />
            {/* view all results /search?q=term */}
            {searchTerm.current && (
              <div className="flex justify-center">
                <Button variant={"primary"}>
                  <Link
                    onClick={goToSearchResult}
                    to={`/search?q=${searchTerm.current}`}
                    className="z-30"
                  >
                    Show All Results ({totalResultsCount})
                  </Link>
                </Button>
              </div>
            )}
          </div>
        )}
        {pages && (
          <div>
            <PredictiveSearchResult
              goToSearchResult={goToSearchResult}
              items={pages.items}
              key={pages.type}
              searchTerm={searchTerm}
              type={pages.type}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function NoPredictiveSearchResults({
  searchTerm,
}: {
  searchTerm: React.MutableRefObject<string>;
}) {
  if (!searchTerm.current) {
    return null;
  }
  return (
    <div className="w-[640px] border bg-[var(--color-drawer-bg)] p-6">
      <p className="border-b border-bar-subtle pb-3">NO RESULTS</p>
      <p className="pt-5">
        No results found for <q>{searchTerm.current}</q>
      </p>
    </div>
  );
}
