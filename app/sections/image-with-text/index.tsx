import { createSchema } from "@weaverse/hydrogen";
import type { RefObject } from "react";
import { backgroundInputs } from "~/components/background-image";
import { layoutInputs, Section, type SectionProps } from "~/components/section";
import { useIsContactPage } from "~/hooks/use-is-contact-page";
import { cn } from "~/utils/cn";

interface ImageWithTextProps extends SectionProps {
  imagePosition: "first" | "last";
}

let ImageWithText = ({
  ref,
  ...props
}: ImageWithTextProps & { ref?: RefObject<HTMLElement | null> }) => {
  let {
    children,
    imagePosition,
    width,
    containerClassName,
    backgroundColor,
    backgroundImage,
    borderRadius,
    ...rest
  } = props;
  const isContactPage = useIsContactPage();

  return (
    <Section
      ref={ref}
      {...rest}
      width={isContactPage ? "full" : width}
      backgroundColor={isContactPage ? undefined : backgroundColor}
      backgroundImage={isContactPage ? undefined : backgroundImage}
      borderRadius={isContactPage ? 0 : borderRadius}
      containerClassName={cn(
        "flex gap-10 px-6 py-10 md:gap-0 md:justify-between lg:p-10",
        isContactPage &&
          "mx-auto w-full max-w-230 gap-9 px-0 py-0 md:gap-9 lg:p-0",
        imagePosition === "last"
          ? "flex-col md:flex-row-reverse"
          : "flex-col md:flex-row",
        containerClassName,
      )}
    >
      {children}
    </Section>
  );
};

export default ImageWithText;

export const schema = createSchema({
  type: "image-with-text",
  title: "Image with text",
  settings: [
    {
      group: "Layout",
      inputs: [
        ...layoutInputs.filter(
          ({ name }) => name !== "gap" && name !== "verticalPadding",
        ),
        {
          type: "select",
          name: "imagePosition",
          label: "Image position",
          configs: {
            options: [
              { value: "first", label: "Image first" },
              { value: "last", label: "Image last" },
            ],
          },
          defaultValue: "first",
        },
      ],
    },
    { group: "Background", inputs: backgroundInputs },
  ],
  childTypes: ["image-with-text--content", "image-with-text--image"],
  presets: {
    imagePosition: "first",
    children: [
      { type: "image-with-text--image" },
      { type: "image-with-text--content" },
    ],
  },
});
