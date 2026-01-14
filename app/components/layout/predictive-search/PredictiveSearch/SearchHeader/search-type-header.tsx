import { useNavigate } from "react-router";
import { IconSearch } from "~/components/icon";
import { Input } from "~/components/input";
import { PredictiveSearchForm } from "../../search-form";
import { SearchTypeHeaderResults } from "./search-type-header-results";

interface PredictiveSearchProps {
  // Predictive search props
  isOpen?: boolean;
}

export function SearchTypeHeader(props: PredictiveSearchProps) {
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
    <div className="relative border-t border-border-subtle">
      <PredictiveSearchForm>
        {({ fetchResults, inputRef }) => (
          <div className="flex justify-center items-center p-6">
            <Input
              name="q"
              onChange={fetchResults}
              onFocus={fetchResults}
              onClear={fetchResults}
              placeholder="Enter a keyword"
              onKeyDown={handleKeyDown}
              ref={inputRef}
              className="rounded border-2 md:w-96 lg:w-[560px] w-full"
              type="search"
              variant="search"
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
      {isOpen && <SearchTypeHeaderResults />}
    </div>
  );
}
