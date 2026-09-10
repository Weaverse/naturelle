import { Link } from "react-router";
import { ProductCard } from "~/components/product/product-card";
import { usePredictiveSearch } from "~/hooks/use-predictive-search";
import type { NormalizedPredictiveSearchResultItem } from "~/types/search-types";
import { PopularKeywords } from "../../popular-keywords";
import { setNativeInputValue } from "../../set-native-input-value";

export function SearchTypeDrawerResults() {
  const { results, totalResults, searchTerm, searchInputRef } =
    usePredictiveSearch();

  const items = (type: (typeof results)[number]["type"]) =>
    results.find((result) => result.type === type)?.items || [];
  const term = searchTerm.current.trim();
  const hasMobileResults =
    items("queries").length > 0 || items("products").length > 0;

  const setSearchKeyword = (keyword: string) => {
    const input = searchInputRef.current;
    setNativeInputValue(input, keyword);
    input?.focus();
  };

  if (!term) {
    return (
      <div className="custom-scroll w-full flex-1 overflow-y-auto border-t border-border-subtle bg-background-basic px-4 py-6 text-text">
        <PopularKeywords onKeywordClick={setSearchKeyword} />
        <section className="mt-8">
          <ResultHeading>Most searched products</ResultHeading>
          <ProductGrid products={items("products")} />
        </section>
      </div>
    );
  }

  if (!hasMobileResults) {
    return (
      <div className="w-full border-t border-border-subtle bg-background-basic p-6 text-text">
        <ResultHeading>No results</ResultHeading>
        <p className="text-sm">
          No results found for <q>{term}</q>
        </p>
      </div>
    );
  }

  return (
    <div className="custom-scroll w-full flex-1 overflow-y-auto border-t border-border-subtle bg-background-basic px-4 py-6 text-text">
      {items("queries").length > 0 && (
        <section>
          <ResultHeading>Suggestions</ResultHeading>
          <ul className="space-y-2">
            {items("queries").map((query) => (
              <li key={query.id}>
                <button
                  type="button"
                  onClick={() => setSearchKeyword(query.title)}
                  className="text-left font-sans text-base font-normal leading-[1.6] tracking-[-0.16px] text-text"
                >
                  {query.title}
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
      {items("products").length > 0 && (
        <section className="mt-8">
          <ResultHeading>Products</ResultHeading>
          <ProductGrid products={items("products")} />
          <div className="mt-6 flex justify-center">
            <Link
              to={`/search?q=${encodeURIComponent(term)}`}
              className="rounded-md bg-text px-5 py-2 text-sm text-background-basic"
            >
              Show All Results ({totalResults})
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}

function ResultHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 font-heading text-sm uppercase leading-normal text-text-subtle">
      {children}
    </div>
  );
}

function ProductGrid({
  products,
}: {
  products: NormalizedPredictiveSearchResultItem[];
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {products.map((item) =>
        item.product ? (
          <ProductCard
            key={item.id}
            product={item.product}
            className="h-full"
            enableQuickView
            showBadge
            showPrice
            showStar
          />
        ) : (
          <Link
            key={item.id}
            to={item.url}
            className="line-clamp-2 text-sm font-medium"
          >
            {item.title}
          </Link>
        ),
      )}
    </div>
  );
}
