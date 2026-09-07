import type { FormProps, useFetcher } from "react-router";
import type {
  PredictiveArticleFragment,
  PredictiveCollectionFragment,
  PredictiveProductFragment,
  ProductCardFragment,
} from "storefront-api.generated";

export const PREDICTIVE_SEARCH_FETCHER_KEY = "predictive-search";

export type PredictiveSearchResponse = {
  searchResults?: NormalizedPredictiveSearch;
  searchTerm?: string;
  error?: string;
};

export type UseSearchReturn = NormalizedPredictiveSearch & {
  searchInputRef: React.MutableRefObject<HTMLInputElement | null>;
  searchTerm: React.MutableRefObject<string>;
};

type PredicticeSearchResultItemImage =
  | PredictiveCollectionFragment["image"]
  | PredictiveArticleFragment["image"]
  | PredictiveProductFragment["featuredImage"];

type PredictiveSearchResultItemPrice =
  PredictiveProductFragment["variants"]["nodes"][0]["price"];

export type NormalizedPredictiveSearch = {
  results: NormalizedPredictiveSearchResults;
  totalResults: number;
};

export type NormalizedPredictiveSearchResults = Array<
  | { type: "queries"; items: NormalizedPredictiveSearchResultItem[] }
  | { type: "products"; items: NormalizedPredictiveSearchResultItem[] }
  | { type: "collections"; items: NormalizedPredictiveSearchResultItem[] }
  | { type: "pages"; items: NormalizedPredictiveSearchResultItem[] }
  | { type: "articles"; items: NormalizedPredictiveSearchResultItem[] }
>;

export type NormalizedPredictiveSearchResultItem = {
  __typename: string | undefined;
  handle: string;
  id: string;
  image?: PredicticeSearchResultItemImage;
  price?: PredictiveSearchResultItemPrice;
  product?: ProductCardFragment;
  compareAtPrice?: PredictiveSearchResultItemPrice;
  styledTitle?: string;
  title: string;
  vendor?: string;
  url: string;
};

export type SearchResultTypeProps = {
  goToSearchResult: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  items: NormalizedPredictiveSearchResultItem[];
  searchTerm: UseSearchReturn["searchTerm"];
  type: NormalizedPredictiveSearchResults[number]["type"];
};

export type SearchResultItemProps = Pick<
  SearchResultTypeProps,
  "goToSearchResult"
> & {
  item: NormalizedPredictiveSearchResultItem;
};

type ChildrenRenderProps = {
  fetchResults: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fetcher: ReturnType<typeof useFetcher<PredictiveSearchResponse>>;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
};

export type SearchFromProps = {
  action?: FormProps["action"];
  method?: FormProps["method"];
  className?: string;
  children: (passedProps: ChildrenRenderProps) => React.ReactNode;
  [key: string]: unknown;
};
