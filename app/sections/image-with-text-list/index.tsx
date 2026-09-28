import {
  createSchema,
  type HydrogenComponentProps,
  IMAGES_PLACEHOLDERS,
} from "@weaverse/hydrogen";
import type { RefObject } from "react";
import { cn } from "~/utils/cn";

type ImagePosition = "first" | "last";

function createImageWithTextItem(imagePosition: ImagePosition) {
  return {
    type: "image-with-text",
    imagePosition,
    width: "full",
    borderRadius: 0,
    children: [
      {
        type: "image-with-text--image",
        image: IMAGES_PLACEHOLDERS.image,
        width: "medium",
        aspectRatio: "1/1",
        objectFit: "cover",
        borderRadius: 16,
      },
      {
        type: "image-with-text--content",
        alignment: "left",
        verticalPadding: "none",
        children: [
          {
            type: "heading",
            content: "Image with text heading",
          },
          {
            type: "paragraph",
            content: "Pair an image with supporting text to tell your story.",
          },
        ],
      },
    ],
  };
}

const ImageWithTextList = ({
  ref,
  children,
  className,
  ...rest
}: HydrogenComponentProps & { ref?: RefObject<HTMLElement | null> }) => {
  return (
    <section
      ref={ref}
      {...rest}
      className={cn(
        "mx-auto flex w-full max-w-230 flex-col gap-12 px-4 pb-10 md:px-6 lg:px-0",
        className,
      )}
    >
      {children}
    </section>
  );
};

export default ImageWithTextList;

export const schema = createSchema({
  type: "image-with-text-list",
  title: "Image with text list",
  enabledOn: {
    pages: ["PAGE"],
  },
  childTypes: ["image-with-text"],
  presets: {
    children: [
      createImageWithTextItem("last"),
      createImageWithTextItem("first"),
      createImageWithTextItem("last"),
    ],
  },
});
