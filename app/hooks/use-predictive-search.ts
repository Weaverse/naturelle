import { useEffect, useRef } from "react";
import { useFetcher } from "react-router";
import type {
  NormalizedPredictiveSearch,
  NormalizedPredictiveSearchResults,
  PredictiveSearchResponse,
  UseSearchReturn,
} from "~/types/search-types";
import { PREDICTIVE_SEARCH_FETCHER_KEY } from "~/types/search-types";

export const NO_PREDICTIVE_SEARCH_RESULTS: NormalizedPredictiveSearchResults = [
  { type: "queries", items: [] },
  { type: "products", items: [] },
  { type: "collections", items: [] },
  { type: "pages", items: [] },
  { type: "articles", items: [] },
];

export function usePredictiveSearch(): UseSearchReturn {
  const searchTerm = useRef<string>("");
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const searchFetcher = useFetcher<PredictiveSearchResponse>({
    key: PREDICTIVE_SEARCH_FETCHER_KEY,
  });
  const submittedTerm = searchFetcher.formData?.get("q");
  const responseTerm = searchFetcher.data?.searchTerm;

  useEffect(() => {
    if (typeof submittedTerm === "string") {
      searchTerm.current = submittedTerm;
    } else if (typeof responseTerm === "string") {
      searchTerm.current = responseTerm;
    }
  }, [submittedTerm, responseTerm]);

  const search = (searchFetcher.data?.searchResults || {
    results: NO_PREDICTIVE_SEARCH_RESULTS,
    totalResults: 0,
  }) as NormalizedPredictiveSearch;

  // capture the search input element as a ref
  useEffect(() => {
    if (searchInputRef.current) {
      return;
    }
    const activeElement = document.activeElement;
    searchInputRef.current =
      activeElement instanceof HTMLInputElement &&
      activeElement.type === "search"
        ? activeElement
        : document.querySelector(
            '[data-predictive-search-form] input[type="search"]',
          );
  }, []);

  return { ...search, searchInputRef, searchTerm };
}
