import { Image, RichText } from "@shopify/hydrogen";
import {
  createSchema,
  type HydrogenComponentProps,
  IMAGES_PLACEHOLDERS,
  type WeaverseImage,
} from "@weaverse/hydrogen";
import type { Ref } from "react";
import { useWeaverseStudioCheck } from "~/hooks/use-weaverse-studio-check";
import { cn } from "~/utils/cn";
import { ProductMetafieldEmptyState } from "./metafield-empty-state";
import {
  loadProductDetailMetafield,
  PRODUCT_DETAIL_METAFIELDS,
} from "./product-metafield";
import { useProductMetafieldData } from "./use-product-metafield-data";

interface StoryData {
  eyebrow: string;
  image?: WeaverseImage | string;
  imagePosition: "left" | "right";
  metafield?: string;
}

type StoryLoaderData = Awaited<ReturnType<typeof loadProductDetailMetafield>>;
type StoryProps = HydrogenComponentProps<StoryLoaderData> & StoryData;

export default function ProductStory({
  ref,
  eyebrow,
  image,
  imagePosition,
  metafield,
  loaderData,
  ...rest
}: StoryProps & { ref?: Ref<HTMLElement> }) {
  const isDesignMode = useWeaverseStudioCheck();
  loaderData = useProductMetafieldData(metafield, loaderData);
  const story = loaderData?.entries[0];
  if (!story) {
    return (
      <ProductMetafieldEmptyState
        ref={ref}
        {...rest}
        loaderData={loaderData}
        metafield={metafield}
      />
    );
  }

  const heading = story.fields.title || "";
  const content = story.fields.content || "";
  if (!(heading && content)) {
    return (
      <ProductMetafieldEmptyState
        ref={ref}
        {...rest}
        loaderData={loaderData}
        metafield={metafield}
        message="This metafield must contain title and content fields."
      />
    );
  }
  const isRichText = story.fieldTypes.content === "rich_text_field";
  const imageData = typeof image === "string" ? { url: image } : image;
  const isPlaceholder = imageData?.url === IMAGES_PLACEHOLDERS.image;
  const showImage = Boolean(imageData?.url) && (isDesignMode || !isPlaceholder);

  return (
    <section ref={ref} {...rest}>
      <div
        className={cn(
          "grid items-stretch gap-5 lg:gap-16",
          showImage && "md:grid-cols-2",
        )}
      >
        <div
          className={cn(
            "flex flex-col justify-center gap-8",
            imagePosition === "left" && "md:order-2",
          )}
        >
          <div className="flex flex-col gap-3">
            <p className="mb-4 font-body text-xs leading-[normal] font-bold uppercase text-(--product-detail-text-color)">
              {eyebrow}
            </p>
            <h2 className="font-display text-[32px] leading-[normal] font-normal tracking-normal text-text">
              {heading}
            </h2>
          </div>
          {isRichText ? (
            <RichText
              data={content}
              className="max-w-none whitespace-pre-line font-body text-[16px] leading-[180%] font-normal text-(--product-detail-text-color) [&_p]:my-2 [&_p]:leading-[180%]"
            />
          ) : (
            <div className="max-w-none whitespace-pre-line font-body text-[16px] leading-[180%] font-normal text-(--product-detail-text-color) [&_p]:my-2 [&_p]:leading-[180%]">
              {content}
            </div>
          )}
        </div>
        {showImage ? (
          <div
            className={cn(
              "overflow-hidden rounded-3xl",
              imagePosition === "left" && "md:order-1",
            )}
          >
            <Image
              data={imageData}
              sizes="(min-width: 768px) 50vw, 100vw"
              aspectRatio="4/5"
              className="h-full w-full object-cover"
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}

export const loader = loadProductDetailMetafield;

export const schema = createSchema({
  type: "product-details--story",
  title: "Product story",
  limit: 1,
  settings: [
    {
      group: "Content",
      inputs: [
        {
          type: "text",
          name: "eyebrow",
          label: "Eyebrow",
          defaultValue: "About this product",
        },
        {
          type: "text",
          name: "metafield",
          label: "Product metafield",
          defaultValue: PRODUCT_DETAIL_METAFIELDS.story,
          placeholder: PRODUCT_DETAIL_METAFIELDS.story,
          helpText:
            "Use a metaobject with <strong>title</strong> and <strong>content</strong> fields.",
        },
        {
          type: "image",
          name: "image",
          label: "Image",
          defaultValue: IMAGES_PLACEHOLDERS.image,
        },
      ],
    },
    {
      group: "Layout",
      inputs: [
        {
          type: "select",
          name: "imagePosition",
          label: "Image position",
          defaultValue: "right",
          configs: {
            options: [
              { value: "left", label: "Left" },
              { value: "right", label: "Right" },
            ],
          },
        },
      ],
    },
  ],
});
