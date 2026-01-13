import { useNavigate } from "react-router";
import { IconSearch } from "~/components/icon";
import { Input } from "~/components/input";
import { PredictiveSearchForm } from "../../search-form";
import { SearchTypeDrawerResults } from "./search-type-drawer-results";

interface PredictiveSearchProps {
  // Predictive search props
  isOpen?: boolean;
}

export function SearchTypeDrawer(props: PredictiveSearchProps) {
  let { isOpen } = props;
  let navigate = useNavigate();

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      let searchQuery = (event.target as HTMLInputElement).value.trim();
      if (searchQuery) {
        navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      }
    }
  };
  return (
    <div className="border-t border-border-subtle flex flex-col">
      <PredictiveSearchForm>
        {({ fetchResults, inputRef }) => (
          <div className="mx-auto w-full max-w-full p-6">
            <Input
              name="q"
              onChange={fetchResults}
              onFocus={fetchResults}
              onClear={fetchResults}
              onKeyDown={handleKeyDown}
              placeholder="Enter a keyword"
              ref={inputRef}
              className="rounded border-2"
              type="search"
              prefixElement={
                <button type="submit" className="cursor-pointer">
                  <IconSearch
                    className="h-6 w-6 opacity-55"
                    viewBox="0 0 24 24"
                  />
                </button>
              }
              autoFocus={true}
            />
          </div>
        )}
      </PredictiveSearchForm>
      {isOpen && <SearchTypeDrawerResults />}
    </div>
  );
}
