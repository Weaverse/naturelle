import {
  createSchema,
  type HydrogenComponentProps,
  IMAGES_PLACEHOLDERS,
  type WeaverseImage,
} from "@weaverse/hydrogen";
import { IconFooterInstagram } from "~/components/icon";
import { Image } from "~/components/image";
import { Link } from "~/components/link";

interface InstagramItemProps extends HydrogenComponentProps {
  image?: WeaverseImage | string;
  link?: string;
  ref?: React.Ref<HTMLDivElement>;
}

function resolveImage(value?: WeaverseImage | string) {
  if (!value) {
    return { url: IMAGES_PLACEHOLDERS.collection_4, altText: "Instagram post" };
  }
  if (typeof value === "string") {
    return { url: value, altText: "Instagram post" };
  }
  return value;
}

const InstagramItem = ({ ref, image, link, ...rest }: InstagramItemProps) => {
  const imageData = resolveImage(image);
  const content = (
    <>
      <Image
        data={imageData}
        alt={imageData.altText || "Instagram post"}
        className="h-full w-full object-cover"
        sizes="(min-width: 1440px) 17vw, (min-width: 768px) 25vw, 50vw"
      />
      <span className="absolute right-2 top-2 z-20 rounded-full bg-background-basic p-2 text-text opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
        <IconFooterInstagram aria-hidden="true" className="size-5" />
      </span>
    </>
  );

  return (
    <div ref={ref} {...rest} className="h-full w-full">
      {link ? (
        <Link
          to={link}
          target="_blank"
          aria-label="Open Instagram post"
          className="group relative block aspect-square w-full overflow-hidden rounded-md border border-border-subtle"
        >
          {content}
        </Link>
      ) : (
        <div className="group relative aspect-square w-full overflow-hidden rounded-md border border-border-subtle">
          {content}
        </div>
      )}
    </div>
  );
};

export default InstagramItem;

export const schema = createSchema({
  type: "instagram--item",
  title: "Instagram post",
  settings: [
    {
      group: "Post",
      inputs: [
        { type: "image", name: "image", label: "Image" },
        {
          type: "url",
          name: "link",
          label: "Post link",
          placeholder: "https://www.instagram.com/p/...",
        },
      ],
    },
  ],
});
