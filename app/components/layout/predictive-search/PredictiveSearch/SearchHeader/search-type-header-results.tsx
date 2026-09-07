import { useEffect, useState } from "react";
import { Link } from "react-router";
import { ProductCard } from "~/components/product/product-card";
import { usePredictiveSearch } from "~/hooks/use-predictive-search";
import type { NormalizedPredictiveSearchResultItem } from "~/types/search-types";
import { cn } from "~/utils/cn";
import { PopularKeywords } from "../../popular-keywords";

export function SearchTypeHeaderResults({
  inline = false,
}: {
  inline?: boolean;
}) {
  const { results, totalResults, searchInputRef, searchTerm } =
    usePredictiveSearch();
  const items = (type: (typeof results)[number]["type"]) =>
    results.find((result) => result.type === type)?.items || [];
  const term = searchTerm.current.trim();
  const [panelTop, setPanelTop] = useState(0);

  useEffect(() => {
    if (!inline) {
      return;
    }
    const updatePanelTop = () => {
      const inputBottom =
        searchInputRef.current?.getBoundingClientRect().bottom;
      if (inputBottom) {
        setPanelTop(inputBottom + 16);
      }
    };
    updatePanelTop();
    window.addEventListener("resize", updatePanelTop);
    window.addEventListener("scroll", updatePanelTop, { passive: true });
    return () => {
      window.removeEventListener("resize", updatePanelTop);
      window.removeEventListener("scroll", updatePanelTop);
    };
  }, [inline, searchInputRef]);

  return (
    <div
      data-predictive-search-results
      className={cn(
        "z-50 bg-background-basic text-text shadow-header",
        inline && panelTop === 0 && "invisible",
        inline
          ? "fixed inset-x-0 w-screen border-y border-border-subtle"
          : "absolute left-1/2 top-24 w-[min(900px,calc(100vw-48px))] -translate-x-1/2",
      )}
      style={inline ? { top: panelTop } : undefined}
    >
      {!term ? (
        <div className="mx-auto grid w-full max-w-page grid-cols-[minmax(0,3fr)_minmax(240px,1fr)] px-6">
          <section className="border-r border-border-subtle p-6">
            <ResultHeading>Most searched products</ResultHeading>
            <div className="grid grid-cols-4 gap-3">
              {items("products").map((product) => (
                <SearchProductCard key={product.id} item={product} />
              ))}
            </div>
          </section>
          <div className="p-6">
            <PopularKeywords
              onKeywordClick={(keyword) => {
                const input = searchInputRef.current;
                const setValue = Object.getOwnPropertyDescriptor(
                  HTMLInputElement.prototype,
                  "value",
                )?.set;
                if (input && setValue) {
                  setValue.call(input, keyword);
                  input.dispatchEvent(new Event("input", { bubbles: true }));
                  input.focus();
                }
              }}
            />
          </div>
        </div>
      ) : totalResults ? (
        <div className="mx-auto grid max-h-[70vh] w-full max-w-page grid-cols-[minmax(0,3fr)_minmax(240px,1fr)] overflow-y-auto px-6">
          <section className="border-r border-border-subtle p-6">
            <ResultHeading>Products</ResultHeading>
            <div className="grid grid-cols-4 gap-3">
              {items("products").map((product) => (
                <SearchProductCard key={product.id} item={product} />
              ))}
            </div>
            <div className="mt-5 flex justify-center">
              <Link
                to={`/search?q=${encodeURIComponent(term)}`}
                className="rounded-md bg-text px-5 py-2 text-sm text-background-basic"
              >
                Show All Results
              </Link>
            </div>
          </section>
          <div className="space-y-6 p-6">
            <TextResults title="Suggestions" items={items("queries")} />
            <TextResults title="Collections" items={items("collections")} />
            <TextResults title="Pages" items={items("articles")} lineClamp />
          </div>
        </div>
      ) : (
        <div className="mx-auto w-full max-w-page p-6">
          <ResultHeading>No results</ResultHeading>
          <p className="text-sm">
            No results found for <q>{term}</q>
          </p>
        </div>
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

function TextResults({
  title,
  items,
  lineClamp = false,
}: {
  title: string;
  items: NormalizedPredictiveSearchResultItem[];
  lineClamp?: boolean;
}) {
  return (
    <section>
      <ResultHeading>{title}</ResultHeading>
      <ul className="space-y-2 text-sm">
        {items.map((item) => (
          <li key={item.id}>
            <Link
              to={item.url}
              className={cn(
                "font-sans text-base font-normal leading-[1.6] tracking-[-0.16px] text-text",
                lineClamp && "line-clamp-1",
              )}
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function SearchProductCard({
  item,
}: {
  item: NormalizedPredictiveSearchResultItem;
}) {
  if (item.product) {
    return (
      <ProductCard
        product={item.product}
        className="h-full"
        enableQuickView
        showBadge
        showPrice
        showStar
      />
    );
  }

  return (
    <Link to={item.url} className="line-clamp-2 text-sm font-medium">
      {item.title}
    </Link>
  );
}
