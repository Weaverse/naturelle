import { useThemeSettings, useTranslation } from "@weaverse/hydrogen";
import { useEffect, useState } from "react";
import { Link } from "~/components/link";
import { ProductCard } from "~/components/product/product-card";
import { Skeleton } from "~/components/skeleton";
import { usePredictiveSearch } from "~/hooks/use-predictive-search";
import {
  type NormalizedPredictiveSearchResultItem,
  POPULAR_PRODUCTS_LIMIT,
  PREDICTIVE_SEARCH_LIMIT,
} from "~/types/search-types";
import { cn } from "~/utils/cn";
import { PopularKeywords } from "../../popular-keywords";
import { setNativeInputValue } from "../../set-native-input-value";

export function SearchTypeHeaderResults({
  inline = false,
}: {
  inline?: boolean;
}) {
  const { t } = useTranslation();
  const { pcardImageRatio = "1/1" } = useThemeSettings();
  const { isLoading, results, searchInputRef, searchTerm } =
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
      const menuTop = searchInputRef.current
        ?.closest("header")
        ?.querySelector<HTMLElement>("[data-header-menu-row]")
        ?.getBoundingClientRect().top;
      if (menuTop !== undefined) {
        setPanelTop(menuTop);
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

  const products = items("products");
  const hasTerm = Boolean(term);
  const skeletonCount = hasTerm
    ? PREDICTIVE_SEARCH_LIMIT
    : POPULAR_PRODUCTS_LIMIT;

  return (
    <>
      {inline && panelTop > 0 && (
        <div
          aria-hidden="true"
          className="fixed inset-x-0 bottom-0 z-40 animate-fade-in bg-black/35 [--fade-in-duration:150ms]"
          style={{ top: panelTop }}
        />
      )}
      <div
        data-predictive-search-results
        className={cn(
          "z-50 bg-background-basic text-text shadow-header motion-reduce:animate-none",
          inline && panelTop === 0 && "invisible",
          inline
            ? "fixed inset-x-0 w-screen animate-search-dropdown border-y border-border-subtle"
            : "absolute left-1/2 top-24 w-[min(900px,calc(100vw-48px))] -translate-x-1/2 animate-fade-in [--fade-in-duration:150ms]",
        )}
        style={inline ? { top: panelTop } : undefined}
      >
        <div className="mx-auto grid max-h-[85vh] w-full max-w-page grid-cols-[minmax(0,3fr)_minmax(240px,1fr)] overflow-y-auto px-6">
          <section className="border-r border-border-subtle p-6">
            <ResultHeading>
              {t(hasTerm ? "search.products" : "search.mostSearchedProducts")}
            </ResultHeading>
            <div
              className="grid grid-cols-2 gap-3 desktop:grid-cols-3 lg:grid-cols-4"
              aria-busy={isLoading}
            >
              {isLoading && products.length === 0 ? (
                <SearchProductCardSkeletons
                  count={skeletonCount}
                  imageRatio={pcardImageRatio}
                />
              ) : hasTerm && products.length === 0 ? (
                <div className="col-span-full">
                  <ResultHeading>{t("search.empty")}</ResultHeading>
                </div>
              ) : (
                products.map((product) => (
                  <SearchProductCard key={product.id} item={product} />
                ))
              )}
            </div>
            {hasTerm && products.length > 0 && (
              <div className="mt-5 flex justify-center">
                <Link
                  to={`/search?q=${encodeURIComponent(term)}`}
                  className="rounded-md bg-text px-5 py-2 text-sm text-background-basic"
                >
                  {t("search.viewAll")}
                </Link>
              </div>
            )}
          </section>
          <div className={cn("p-6", hasTerm && "space-y-6")}>
            {hasTerm ? (
              <>
                <TextResults
                  title={t("search.suggestions")}
                  items={items("queries")}
                />
                <TextResults
                  title={t("search.collections")}
                  items={items("collections")}
                />
                <TextResults
                  title={t("search.pages")}
                  items={items("articles")}
                  lineClamp
                />
              </>
            ) : (
              <PopularKeywords
                onKeywordClick={(keyword) => {
                  const input = searchInputRef.current;
                  setNativeInputValue(input, keyword);
                  input?.focus();
                }}
              />
            )}
          </div>
        </div>
      </div>
    </>
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
        enableQuickView={false}
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

function SearchProductCardSkeletons({
  count,
  imageRatio,
}: {
  count: number;
  imageRatio: string;
}) {
  return Array.from({ length: count }, (_, index) => (
    <div
      key={`search-product-skeleton-${index}`}
      className="flex min-w-0 animate-pulse flex-col gap-3 rounded-xl bg-background px-3 pt-3 pb-5"
    >
      <Skeleton
        className="w-full rounded-lg"
        style={{ aspectRatio: imageRatio.replace("/", " / ") }}
      />
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="h-4 w-2/5" />
    </div>
  ));
}
