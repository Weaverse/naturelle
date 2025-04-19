import { Link } from "@remix-run/react";
import { Image, Money } from "@shopify/hydrogen";
import clsx from "clsx";
import type { SearchResultItemProps } from "../../lib/types/search-types";

export function SearchResultItem({
  goToSearchResult,
  item,
}: SearchResultItemProps) {
  return (
    <li key={item.id}>
      <Link
        className="flex gap-3"
        onClick={goToSearchResult}
        to={item.url}
        data-type={item.__typename}
      >
        {item.__typename === "Product" && (
          <div className="h-20 w-20 shrink-0 aspect-square">
            {item.image?.url && (
              <Image
                alt={item.image.altText ?? ""}
                src={item.image.url}
                width={80}
                height={80}
                className="h-full w-full object-cover rounded-[2px]"
              />
            )}
          </div>
        )}
        <div className="flex flex-col">
          {item.vendor && (
            <p>
              <small className="text-foreground-subtle">By {item.vendor}</small>
            </p>
          )}
          {item.styledTitle ? (
            <p
              dangerouslySetInnerHTML={{
                __html: item.styledTitle,
              }}
              className="text-base font-normal"
            />
          ) : (
            <p
              className={clsx(
                item.__typename === "Product"
                  ? "line-clamp-1 font-heading text-xl font-semibold"
                  : "line-clamp-2 font-body text-base font-normal",
              )}
            >
              {item.title}
            </p>
          )}
          <div className="flex gap-2">
            {item?.compareAtPrice && (
              <span className="text-[#AB2E2E] line-through">
                <Money data={item.compareAtPrice} />
              </span>
            )}
            {item?.price && (
              <span>
                <Money data={item.price} />
              </span>
            )}
          </div>
        </div>
      </Link>
    </li>
  );
}
