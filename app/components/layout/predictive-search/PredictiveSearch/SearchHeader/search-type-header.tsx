import { useNavigate } from "react-router";
import { IconClose, IconSearch } from "~/components/icon";
import { Input } from "~/components/input";
import { cn } from "~/utils/cn";
import { PredictiveSearchForm } from "../../search-form";
import { SearchTypeHeaderResults } from "./search-type-header-results";

interface PredictiveSearchProps {
  // Predictive search props
  isOpen?: boolean;
  inline?: boolean;
  onClose?: () => void;
}

export function SearchTypeHeader(props: PredictiveSearchProps) {
  let { isOpen, inline = false, onClose } = props;
  let navigate = useNavigate();

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      let searchQuery = (event.target as HTMLInputElement).value.trim();
      if (searchQuery) {
        navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      }
    }
    if (event.key === "Escape" && inline) {
      onClose?.();
    }
  };
  return (
    <div className={cn("relative", !inline && "border-t border-border-subtle")}>
      <PredictiveSearchForm>
        {({ fetchResults, inputRef }) => (
          <div
            className={cn("flex items-center justify-center", !inline && "p-6")}
          >
            <Input
              name="q"
              onChange={fetchResults}
              onFocus={fetchResults}
              onBlur={(event) => {
                const nextTarget = event.relatedTarget;
                const staysInForm =
                  nextTarget instanceof Node &&
                  event.currentTarget.closest("form")?.contains(nextTarget);
                if (inline && !staysInForm) {
                  onClose?.();
                }
              }}
              onClear={fetchResults}
              placeholder={inline ? "Search..." : "Enter a keyword"}
              onKeyDown={handleKeyDown}
              ref={inputRef}
              className={cn(
                "w-full rounded-md border-2",
                inline
                  ? "h-[50px] w-[min(436px,calc(100vw-96px))] rounded-md border border-border bg-background-basic px-3 py-0 text-base text-text-subtle"
                  : "md:w-96 lg:w-[560px]",
              )}
              type="search"
              variant={inline ? "custom" : "search"}
              prefixElement={
                <button
                  type="submit"
                  aria-label="Submit search"
                  className="flex size-6 shrink-0 cursor-pointer items-center justify-center text-text-primary"
                >
                  <IconSearch
                    className={cn("size-6", !inline && "opacity-55")}
                    viewBox="0 0 24 24"
                    strokeWidth={inline ? 2 : undefined}
                  />
                </button>
              }
              suffix={
                inline ? (
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close search"
                    className="flex size-6 shrink-0 items-center justify-center text-text-subtle"
                  >
                    <IconClose className="size-5" strokeWidth={2} />
                  </button>
                ) : undefined
              }
              autoFocus={true}
            />
          </div>
        )}
      </PredictiveSearchForm>
      {!inline && isOpen && <SearchTypeHeaderResults />}
    </div>
  );
}
