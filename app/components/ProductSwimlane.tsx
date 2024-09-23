import type {FeaturedItemsQuery} from 'storefrontapi.generated';
import { Section} from '~/components/Text';
import {ProductCard} from '~/components/ProductCard';
import { IconArrowScrollLeft, IconArrowScrollRight } from './Icon';
import { useRef } from 'react';

const mockProducts = {
  nodes: new Array(12).fill(''),
};

type ProductSwimlaneProps = Pick<FeaturedItemsQuery, 'featuredProducts'> & {
  title?: string;
  count?: number;
};

export function ProductSwimlane({
  title,
  featuredProducts = mockProducts,
  count = 12,
  ...props
}: ProductSwimlaneProps) {
  const swimlaneRef = useRef<HTMLDivElement>(null);

  const handleScrollRight = () => {
    if (swimlaneRef.current) {
      swimlaneRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const handleScrollLeft = () => {
    if (swimlaneRef.current) {
      swimlaneRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };
  return (
    <Section {...(title && { heading: title })} padding="y" {...props} className='relative group'>
      <div ref={swimlaneRef} className="swimlane hiddenScroll scroll-px-0 px-0">
        {featuredProducts.nodes.slice(0, count).map((product) => (
          <ProductCard
            quickAdd
            product={product}
            key={product.id}
            className="snap-start w-80"
          />
        ))}
      </div>
      <div className='md:flex items-center absolute top-[304px] h-fit w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden'>
          <button onClick={handleScrollLeft} aria-label="Scroll left" className='absolute md:left-0 bg-white p-2'>
            <IconArrowScrollLeft className='cursor-pointer w-6 h-6' viewBox='0 0 24 24' />
          </button>
          <button onClick={handleScrollRight} aria-label="Scroll right" className='absolute md:right-0 bg-white p-2'>
            <IconArrowScrollRight className='w-6 h-6 cursor-pointer' viewBox='0 0 24 24' />
          </button>
      </div>
    </Section>
  );
}
