import { Image } from "@shopify/hydrogen";
import type { HydrogenComponentProps, WeaverseImage } from "@weaverse/hydrogen";
import { createSchema } from "@weaverse/hydrogen";
import type { CSSProperties, RefObject } from "react";
import { IconNewsletter } from "~/components/icon";

interface NewsletterIconProps extends HydrogenComponentProps {
  iconImage: WeaverseImage;
  iconImageSize: number;
}

const NewsletterIcon = ({
  ref,
  ...props
}: NewsletterIconProps & { ref?: RefObject<HTMLDivElement | null> }) => {
  let { iconImage, iconImageSize, ...rest } = props;
  let style: CSSProperties = {
    "--image-size": `${iconImageSize}px`,
  } as CSSProperties;

  return (
    <div
      data-motion="fade-up"
      ref={ref}
      {...rest}
      style={style}
      className="flex items-center justify-center"
    >
      {iconImage ? (
        <Image
          data={iconImage}
          className="!aspect-square !w-[var(--image-size)] object-cover"
        />
      ) : (
        <IconNewsletter viewBox="0 0 65 64" className="!h-16 !w-16" />
      )}
    </div>
  );
};

export default NewsletterIcon;

export const schema = createSchema({
  type: "newsletter-icon",
  title: "icon",
  settings: [
    {
      group: "icon",
      inputs: [
        {
          type: "image",
          name: "iconImage",
          label: "Icon image",
        },
        {
          type: "range",
          name: "iconImageSize",
          label: "Icon image size",
          defaultValue: 50,
          configs: {
            min: 20,
            max: 100,
            step: 1,
          },
        },
      ],
    },
  ],
});
