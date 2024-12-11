import { Input } from '~/components/input';
import {IconSearch} from '../../../Icon';
import {PredictiveSearchForm} from '../../SearchForm';
import { SearchTypeDrawerResults } from './SearchTypeDrawerResults';

interface PredictiveSearchProps {
  // Predictive search props
  isOpen?: boolean;
}

export function SearchTypeDrawer(props: PredictiveSearchProps) {
  let {isOpen} = props;
  return (
    <div className="border-t border-border-subtle flex flex-col">
      <PredictiveSearchForm>
        {({fetchResults, inputRef}) => (
          <div className="mx-auto w-full max-w-[560px] p-6">
            <Input
              name="q"
              onChange={fetchResults}
              onFocus={fetchResults}
              onClear={fetchResults}
              placeholder="Enter a keyword"
              ref={inputRef}
              className="rounded border-2"
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
