import { useNavigate } from "react-router";
import { IconClose, IconSearch } from "~/components/icon";
import { Input } from "~/components/input";
import { PredictiveSearchForm } from "../../search-form";
import { setNativeInputValue } from "../../set-native-input-value";
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
              onKeyDown={handleKeyDown}
              placeholder="Enter a keyword"
              ref={inputRef}
              className="rounded-md border-2"
              type="search"
              prefixElement={
                <button type="submit" className="cursor-pointer">
                  <IconSearch
                    className="h-6 w-6 opacity-55"
                    viewBox="0 0 24 24"
                  />
                </button>
              }
              suffix={
                <button
                  type="button"
                  aria-label="Clear search"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => {
                    const input = inputRef.current;
                    setNativeInputValue(input, "");
                    input?.focus();
                  }}
                  className="flex size-6 shrink-0 items-center justify-center text-text-subtle"
                >
                  <IconClose className="size-5" strokeWidth={2} />
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
