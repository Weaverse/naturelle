import { useEffect, useRef } from "react";
import { useFetcher, useParams } from "react-router";
import type {
  PredictiveSearchResponse,
  SearchFromProps,
} from "~/types/search-types";
import { PREDICTIVE_SEARCH_FETCHER_KEY } from "~/types/search-types";

/**
 *  Search form component that posts search requests to the `/search` route
 **/
export function PredictiveSearchForm({
  action,
  children,
  className = "predictive-search-form",
  method = "POST",
  ...props
}: SearchFromProps) {
  const params = useParams();
  const fetcher = useFetcher<PredictiveSearchResponse>({
    key: PREDICTIVE_SEARCH_FETCHER_KEY,
  });
  const inputRef = useRef<HTMLInputElement | null>(null);
  const didInitializeRef = useRef(false);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchAction = action ?? "/api/predictive-search";
  const localizedAction = params.locale
    ? `/${params.locale}${searchAction}`
    : searchAction;

  function fetchResults(event: React.ChangeEvent<HTMLInputElement>) {
    const newSearchTerm = event.target.value || "";
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      fetcher.submit(
        { q: newSearchTerm, limit: "8" },
        { method, action: localizedAction },
      );
    }, 300);
  }

  // ensure the passed input has a type of search, because SearchResults
  // will select the element based on the input
  // biome-ignore lint/correctness/useExhaustiveDependencies: mount-only initialization
  useEffect(() => {
    if (didInitializeRef.current) {
      return;
    }
    didInitializeRef.current = true;
    inputRef?.current?.setAttribute("type", "search");
    inputRef?.current?.focus();
    fetcher.submit(
      { q: inputRef.current?.value || "", limit: "8" },
      { method, action: localizedAction },
    );

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <fetcher.Form
      {...props}
      data-predictive-search-form
      className={className}
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        if (!inputRef?.current || inputRef.current.value === "") {
          return;
        }
        inputRef.current.blur();
      }}
    >
      {children({ fetchResults, inputRef, fetcher })}
    </fetcher.Form>
  );
}
