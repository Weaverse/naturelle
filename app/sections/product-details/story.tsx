import { Image } from "@shopify/hydrogen";
import {
  createSchema,
  type HydrogenComponentProps,
  IMAGES_PLACEHOLDERS,
  type WeaverseImage,
} from "@weaverse/hydrogen";
import type { Ref } from "react";
import { useWeaverseStudioCheck } from "~/hooks/use-weaverse-studio-check";
import { cn } from "~/utils/cn";

interface StoryProps extends HydrogenComponentProps {
  eyebrow: string;
  heading: string;
  content: string;
  image?: WeaverseImage | string;
  imagePosition: "left" | "right";
}

export default function ProductStory({
  ref,
  eyebrow,
  heading,
  content,
  image,
  imagePosition,
  ...rest
}: StoryProps & { ref?: Ref<HTMLElement> }) {
  const isDesignMode = useWeaverseStudioCheck();
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
            <h2 className="font-['Playfair_Display'] text-[32px] leading-[normal] font-normal tracking-normal text-text">
              {heading}
            </h2>
          </div>
          <div
            className="max-w-none font-body text-[16px] leading-[180%] font-normal text-(--product-detail-text-color) [&_p]:my-2 [&_p]:leading-[180%]"
            dangerouslySetInnerHTML={{ __html: content }}
          />
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
          name: "heading",
          label: "Heading",
          defaultValue: "The TET8™ Revolution",
        },
        {
          type: "richtext",
          name: "content",
          label: "Content",
          defaultValue:
            "<p>What it is: An intensely hydrating serum to target eight signs of aging and quickly tighten skin with breakthrough TET8™ patent, hyaluronic acid, and niacinamide.</p><p>Skin Type: Normal, Dry</p><p>What Else You Need to Know: A luxurious serum that visibly targets elasticity, firmness, wrinkles, fine lines, dark spots, radiance, hydration, and plumpness.</p>",
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
