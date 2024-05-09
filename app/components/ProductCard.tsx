import type {ShopifyAnalyticsProduct} from '@shopify/hydrogen';
import {flattenConnection, Image, Money, useMoney} from '@shopify/hydrogen';
import type {MoneyV2, Product} from '@shopify/hydrogen/storefront-api-types';
import clsx from 'clsx';

import {Button} from '@/components/button';
import type {ProductCardFragment} from 'storefrontapi.generated';
import {AddToCartButton} from '~/components/AddToCartButton';
import {Link} from '~/components/Link';
import {Text} from '~/components/Text';
import {getProductPlaceholder} from '~/lib/placeholders';
import {isDiscounted, isNewArrival} from '~/lib/utils';
import {QuickViewTrigger} from './QuickView';

export function ProductCard({
  product,
  label,
  className,
  loading,
  onClick,
  quickAdd,
}: {
  product: ProductCardFragment;
  label?: string;
  className?: string;
  loading?: HTMLImageElement['loading'];
  onClick?: () => void;
  quickAdd?: boolean;
}) {
  let cardLabel;
  const cardProduct: Product = product?.variants
    ? (product as Product)
    : getProductPlaceholder();
  if (!cardProduct?.variants?.nodes?.length) return null;

  const variants = flattenConnection(cardProduct.variants);
  const firstVariant = flattenConnection(cardProduct.variants)[0];
  if (!firstVariant) return null;
  const {image, price, compareAtPrice} = firstVariant;

  if (label) {
    cardLabel = label;
  } else if (isDiscounted(price as MoneyV2, compareAtPrice as MoneyV2)) {
    cardLabel = 'Sale';
  } else if (isNewArrival(product.publishedAt)) {
    cardLabel = 'New';
  }

  const productAnalytics: ShopifyAnalyticsProduct = {
    productGid: product.id,
    variantGid: firstVariant.id,
    name: product.title,
    variantName: firstVariant.title,
    brand: product.vendor,
    price: firstVariant.price.amount,
    quantity: 1,
  };

  return (
    <div className="flex flex-col gap-2">
      <div className={clsx('grid gap-4', className)}>
        <div className="card-image relative aspect-[4/5] bg-primary/5 group">
          {image && (
            <Link
              onClick={onClick}
              to={`/products/${product.handle}`}
              prefetch="intent"
              className={({isTransitioning}) => {
                return isTransitioning ? 'vt-product-image' : '';
              }}
            >
              <Image
                className="object-cover w-full fadeIn"
                sizes="(min-width: 64em) 25vw, (min-width: 48em) 30vw, 45vw"
                aspectRatio="4/5"
                data={image}
                alt={image.altText || `Picture of ${product.title}`}
                loading={loading}
              />
            </Link>
          )}
          <Text
            as="h6"
            size="fine"
            className="absolute top-0 right-0 text-right text-notice bg-label-sale text-secondary p-3 empty:hidden"
          >
            {cardLabel}
          </Text>
          {quickAdd && variants.length > 1 && (
            <QuickViewTrigger productHandle={product.handle} />
          )}
          {quickAdd &&
            variants.length === 1 &&
            firstVariant.availableForSale && (
              <div className="absolute bottom-0 py-5 px-3 w-full hidden group-hover:block opacity-100 bg-[rgba(238,239,234,0.10)] backdrop-blur-2xl">
                <AddToCartButton
                  className="w-full"
                  lines={[
                    {
                      quantity: 1,
                      merchandiseId: firstVariant.id,
                    },
                  ]}
                  variant="secondary"
                  analytics={{
                    products: [productAnalytics],
                    totalValue: parseFloat(productAnalytics.price),
                  }}
                >
                  <Text
                    as="span"
                    className="flex items-center justify-center gap-2"
                  >
                    Add to Bag
                  </Text>
                </AddToCartButton>
              </div>
            )}
        </div>
        <div className="grid gap-2">
          <p className="text-foreground-subtle">{product.vendor}</p>
          <h4 className="w-full overflow-hidden whitespace-nowrap text-ellipsis space-x-1 text-xl font-medium">
            <Link
              onClick={onClick}
              to={`/products/${product.handle}`}
              prefetch="intent"
              className={({isTransitioning}) => {
                return isTransitioning ? 'vt-product-image block' : '';
              }}
            >
              <span>{product.title}</span>
              {firstVariant.sku && <span>({firstVariant.sku})</span>}
            </Link>
          </h4>
          <div className="flex">
            <Text className="flex gap-2">
              {isDiscounted(price as MoneyV2, compareAtPrice as MoneyV2) && (
                <CompareAtPrice
                  className="text-label-sale line-through"
                  data={compareAtPrice as MoneyV2}
                />
              )}
              <Money withoutTrailingZeros data={price!} />
            </Text>
          </div>
        </div>
      </div>
      {quickAdd && variants.length === 1 && firstVariant.availableForSale && (
        <AddToCartButton
          lines={[
            {
              quantity: 1,
              merchandiseId: firstVariant.id,
            },
          ]}
          variant="secondary"
          className="mt-4 lg:hidden w-full"
          analytics={{
            products: [productAnalytics],
            totalValue: parseFloat(productAnalytics.price),
          }}
        >
          <Text as="span" className="flex items-center justify-center gap-2">
            Add to Bag
          </Text>
        </AddToCartButton>
      )}
      {quickAdd && variants.length > 1 && (
        <Button
          className="mt-4 lg:hidden"
          variant="secondary"
          to={`/products/${product.handle}`}
        >
          Select Options
        </Button>
      )}
      {quickAdd && variants.length === 1 && !firstVariant.availableForSale && (
        <Button variant="secondary" className="mt-4 lg:hidden" disabled>
          <Text as="span" className="flex items-center justify-center gap-2">
            Sold out
          </Text>
        </Button>
      )}
    </div>
  );
}

function CompareAtPrice({
  data,
  className,
}: {
  data: MoneyV2;
  className?: string;
}) {
  const {currencyNarrowSymbol, withoutTrailingZerosAndCurrency} =
    useMoney(data);

  const styles = clsx('strike', className);

  return (
    <span className={styles}>
      {currencyNarrowSymbol}
      {withoutTrailingZerosAndCurrency}
    </span>
  );
}
