import {useThemeSettings} from '@weaverse/hydrogen';
import {Drawer, useDrawer} from '../Drawer';
import {IconSearch} from '../Icon';
import { SearchTypeHeader } from '../predictive-search/PredictiveSearch/SearchHeader/SearchTypeHeader';
import { SearchTypeDrawer } from '../predictive-search/PredictiveSearch/SearchDrawer/SearchTypeDrawer';
import { useEffect, useState } from 'react';

type TypeOpenFrom = 'top' | 'right' | 'left';

export function SearchToggle({isOpenDrawerHearder}: {isOpenDrawerHearder?: boolean}) {
  const {isOpen, closeDrawer, openDrawer} = useDrawer();
  let settings = useThemeSettings();
  const [searchType, setSearchType] = useState(settings?.searchType);
  const [openFrom, setOpenFrom] = useState<TypeOpenFrom>(
    searchType === 'popupSearch' ? 'top' : 'right'
  );

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1280) { 
        setSearchType('drawerSearch');
        setOpenFrom('left');
      } else {
        setSearchType(settings?.searchType);
        if (settings?.searchType === 'drawerSearch' && isOpenDrawerHearder) {
          setOpenFrom('left');
        } else {
          setOpenFrom(settings?.searchType === 'popupSearch' ? 'top' : 'right');
        }
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [settings?.searchType, isOpenDrawerHearder]);
  return (
    <>
      <button
        onClick={openDrawer}
        className="relative flex h-6 w-6 items-center justify-center focus:ring-primary/5"
      >
        <IconSearch className="h-6 w-6 !font-extralight" />
      </button>
      <Drawer
        open={isOpen}
        onClose={closeDrawer}
        openFrom={openFrom}
        heading={searchType === 'drawerSearch' ? 'Search' : ''}
        isForm="search"
      >
        {searchType === 'popupSearch' && <SearchTypeHeader isOpen={isOpen} />}
        {searchType === 'drawerSearch' && <SearchTypeDrawer isOpen={isOpen} />}
      </Drawer>
    </>
  );
}
