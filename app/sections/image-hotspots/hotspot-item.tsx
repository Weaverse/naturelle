import type {
  ComponentLoaderArgs,
  HydrogenComponentProps,
  WeaverseProduct,
} from "@weaverse/hydrogen";
import {
  createSchema,
  useChildInstances,
  useItemInstance,
  useParentInstance,
} from "@weaverse/hydrogen";
import clsx from "clsx";
import { type CSSProperties, type RefObject, useContext } from "react";
import { createPortal } from "react-dom";
import type { ProductQuery } from "storefront-api.generated";
import { IconCircle, IconHandBag, IconPlus, IconTag } from "~/components/icon";
import { ProductCard } from "~/components/product/product-card";
import { PRODUCT_QUERY } from "~/graphql/queries";
import { HotspotsContext } from "./image-item";

export interface HotspotsItemData {
  badgeText: string;
  eyebrow: string;
  heading: string;
  icon: "circle" | "plus" | "bag" | "tag";
  iconSize: number;
  offsetX: number;
  offsetY: number;
  overlayColor: string;
  paragraph: string;
  product: WeaverseProduct;
  showBadge: boolean;
  showPrice: boolean;
  showStar: boolean;
  showViewDetailsLink: boolean;
  viewDetailsLinkText: string;
}

interface HotspotsItemProps
  extends HydrogenComponentProps<Awaited<ReturnType<typeof loader>>>,
    HotspotsItemData {}

const ICONS = {
  circle: IconCircle,
  plus: IconPlus,
  bag: IconHandBag,
  tag: IconTag,
};

let HotspotsItem = ({
  ref,
  ...props
}: HotspotsItemProps & { ref?: RefObject<HTMLButtonElement | null> }) => {
  let {
    badgeText,
    eyebrow,
    heading,
    icon,
    iconSize,
    offsetX,
    offsetY,
    overlayColor = "#EEEFEA",
    paragraph,
    product,
    showBadge,
    showPrice,
    showStar,
    showViewDetailsLink,
    viewDetailsLinkText,
    children,
    loaderData,
    ...rest
  } = props;
  let Icon = ICONS[icon];
  const { activeItem, panelTarget, selectItem } = useContext(HotspotsContext);
  const itemInstance = useItemInstance();
  const parentInstance = useParentInstance();
  const siblings = useChildInstances(parentInstance?._id);
  const instanceIndex = siblings.findIndex(
    (instance) => instance._id === itemInstance?._id,
  );
  const itemIndex = instanceIndex >= 0 ? instanceIndex : 0;
  const isActive = activeItem === itemIndex;

  return (
    <>
      <button
        ref={ref}
        {...rest}
        type="button"
        aria-label={`Show ${loaderData?.product?.title ?? "product"}`}
        aria-pressed={isActive}
        className={clsx(
          "absolute z-[1] flex -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full",
          isActive && "ring-2 ring-background-basic ring-offset-2",
        )}
        style={
          {
            top: `${offsetY}%`,
            left: `${offsetX}%`,
            "--translate-x-ratio": offsetX > 50 ? 1 : -1,
            "--translate-y-ratio": offsetY > 50 ? 1 : -1,
            "--spot-size": `${iconSize + 16}px`,
          } as CSSProperties
        }
        onClick={() => selectItem(itemIndex)}
      >
        <span
          className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gray-700 opacity-75"
          style={{ animationDuration: "1500ms" }}
        />
        <span className="relative inline-flex rounded-full bg-background-basic p-2">
          <Icon style={{ width: iconSize, height: iconSize }} />
        </span>
      </button>
      {isActive &&
        panelTarget &&
        createPortal(
          <div
            className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-cover bg-center px-5 py-10 text-sm md:px-6 md:py-8 md:text-base lg:px-0 lg:py-20"
            style={{ backgroundImage: "var(--hotspot-background-image)" }}
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 backdrop-blur-[45px]"
              style={{
                backgroundColor: `color-mix(in srgb, ${overlayColor} 10%, transparent)`,
              }}
            />
            {eyebrow && (
              <div className="relative z-10 rounded-full bg-background-subtle-1 px-4 py-1.5 text-xs uppercase tracking-wide">
                {eyebrow}
              </div>
            )}
            {heading && (
              <h2 className="relative z-10 mt-3 text-center font-heading text-2xl leading-tight lg:mt-4 lg:text-3xl">
                {heading}
              </h2>
            )}
            {loaderData?.product && (
              <ProductCard
                product={loaderData.product}
                badgeText={badgeText}
                showBadge={showBadge}
                showPrice={showPrice}
                showStar={showStar}
                showViewDetailsLink={showViewDetailsLink}
                viewDetailsLinkText={viewDetailsLinkText}
                className="relative z-10 mt-4 max-w-[326px] lg:mt-10"
              />
            )}
            {paragraph && (
              <div
                className="relative z-10 mt-6 max-w-[626px] text-center text-sm leading-relaxed text-text lg:mt-10"
                dangerouslySetInnerHTML={{ __html: paragraph }}
              />
            )}
          </div>,
          panelTarget,
        )}
    </>
  );
};

export default HotspotsItem;

export const loader = async (args: ComponentLoaderArgs<HotspotsItemData>) => {
  let { weaverse, data } = args;
  let { storefront, env } = weaverse;
  let metafield = env.PRODUCT_CUSTOM_DATA_METAFIELD || "custom.details";
  if (!data?.product) {
    return null;
  }
  let productHandle = data.product.handle;
  let { product } = await storefront.query<ProductQuery>(PRODUCT_QUERY, {
    variables: {
      handle: productHandle,
      selectedOptions: [],
      namespace: metafield.split(".")[0],
      key: metafield.split(".")[1],
      language: storefront.i18n.language,
      country: storefront.i18n.country,
    },
  });

  return { product };
};

export const schema = createSchema({
  type: "hotspots--item",
  title: "Hotspots item",
  settings: [
    {
      group: "Icon",
      inputs: [
        {
          type: "toggle-group",
          name: "icon",
          label: "Icon",
          configs: {
            options: [
              {
                label: "Circle",
                value: "circle",
                icon: "circle",
              },
              {
                label: "Plus",
                value: "plus",
                icon: "plus",
              },
              {
                label: "Bag",
                value: "bag",
                icon: "shopping-bag",
              },
              {
                label: "Tag",
                value: "tag",
                icon: "tag",
              },
            ],
          },
          defaultValue: "plus",
        },
        {
          type: "range",
          name: "iconSize",
          label: "Icon size",
          configs: {
            min: 16,
            max: 32,
            step: 2,
            unit: "px",
          },
          defaultValue: 20,
        },
        {
          type: "range",
          name: "offsetX",
          label: "Offset X",
          configs: {
            min: 0,
            max: 100,
            step: 1,
            unit: "%",
          },
          defaultValue: 50,
        },
        {
          type: "range",
          name: "offsetY",
          label: "Offset Y",
          configs: {
            min: 0,
            max: 100,
            step: 1,
            unit: "%",
          },
          defaultValue: 50,
        },
      ],
    },
    {
      group: "Product",
      inputs: [
        {
          type: "text",
          name: "eyebrow",
          label: "Eyebrow text",
          defaultValue: "Natural pet care",
        },
        {
          type: "text",
          name: "heading",
          label: "Heading",
          defaultValue: "Care made naturally",
        },
        {
          type: "richtext",
          name: "paragraph",
          label: "Paragraph below product",
          defaultValue:
            "Introduce the featured product and explain why it belongs in your pet's daily routine.",
        },
        {
          type: "product",
          name: "product",
          label: "Product",
        },
        {
          type: "switch",
          name: "showBadge",
          label: "Show product badge",
          defaultValue: true,
        },
        {
          type: "text",
          name: "badgeText",
          label: "Product badge text",
          defaultValue: "New arrival",
          condition: "showBadge.eq.true",
        },
        {
          type: "switch",
          name: "showStar",
          label: "Show star rating",
          defaultValue: true,
        },
        {
          type: "switch",
          name: "showPrice",
          label: "Show price",
          defaultValue: true,
        },
        {
          type: "switch",
          name: "showViewDetailsLink",
          label: "Show view details link",
          defaultValue: false,
        },
        {
          type: "text",
          name: "viewDetailsLinkText",
          label: "View details link text",
          defaultValue: "View full details",
          condition: "showViewDetailsLink.eq.true",
        },
      ],
    },
    {
      group: "Colors",
      inputs: [
        {
          type: "color",
          name: "overlayColor",
          label: "Overlay color",
          defaultValue: "#EEEFEA",
        },
      ],
    },
  ],
});
