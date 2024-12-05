import { Link } from "@remix-run/react";
import { PredictiveSearchResult } from "../../PredictiveSearchResult";
import { usePredictiveSearch } from "../../usePredictiveSearch";
import { Button } from "~/components/button";

export function SearchTypeDrawerResults() {
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
      <div className="flex w-full items-center justify-center border-t border-border-subtle">
        <NoPredictiveSearchResults searchTerm={searchTerm} />
      </div>
    );
  }
  return (
    <div className="relative flex items-center justify-center border-t border-border-subtle">
      <div className="grid custom-scroll max-h-[81vh] w-screen grid-cols-1 gap-6 overflow-y-auto p-6">
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
          <div>
            <PredictiveSearchResult
              goToSearchResult={goToSearchResult}
              items={products.items}
              key={products.type}
              searchTerm={searchTerm}
              type={products.type}
            />
            {/* view all results /search?q=term */}
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
        <div className="h-[50px] mt-2" />
        {searchTerm.current && (
          <div
            className="flex justify-center absolute bottom-0 p-6 bg-[var(--color-drawer-bg)] left-0 right-0"
            style={{ boxShadow: "0 -4px 6px -1px rgba(0, 0, 0, 0.1)" }}
          >
            <Button variant={"primary"}>
              <Link
                onClick={goToSearchResult}
                to={`/search?q=${searchTerm.current}`}
              >
                Show All Results ({totalResultsCount})
              </Link>
            </Button>
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
    <div className="w-full p-6">
      <p className="border-b border-border-subtle pb-3">NO RESULTS</p>
      <p className="pt-5">
        No results found for <q>{searchTerm.current}</q>
      </p>
    </div>
  );
}
