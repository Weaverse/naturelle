import { Image } from "@shopify/hydrogen";
import type { HydrogenComponentProps, WeaverseImage } from "@weaverse/hydrogen";
import { createSchema } from "@weaverse/hydrogen";
import type { RefObject } from "react";
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
  const imageSize = iconImageSize || 50;
  const imageStyle = { width: "auto", height: imageSize };

  return (
    <div
      data-motion="fade-up"
      ref={ref}
      {...rest}
      className="flex items-center justify-center"
    >
      {iconImage ? (
        <Image
          data={iconImage}
          className="max-w-full shrink-0 object-contain"
          style={imageStyle}
        />
      ) : (
        <IconNewsletter viewBox="0 0 65 64" style={imageStyle} />
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
          label: "Icon height",
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
