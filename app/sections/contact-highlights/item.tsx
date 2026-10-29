import {
  createSchema,
  type HydrogenComponentProps,
  useChildInstances,
  useItemInstance,
  useParentInstance,
} from "@weaverse/hydrogen";
import clsx from "clsx";
import type { RefObject } from "react";

interface ContactHighlightItemProps extends HydrogenComponentProps {
  visibleOnMobile: boolean;
  heading: string;
  description: string;
}

const ContactHighlightItem = ({
  ref,
  visibleOnMobile,
  heading,
  description,
  ...rest
}: ContactHighlightItemProps & {
  ref?: RefObject<HTMLDivElement | null>;
}) => {
  const itemInstance = useItemInstance();
  const parentInstance = useParentInstance();
  const siblings = useChildInstances(parentInstance?._id);
  const instanceIndex = siblings.findIndex(
    (instance) => instance._id === itemInstance?._id,
  );
  const itemNumber = (instanceIndex >= 0 ? instanceIndex : 0) + 1;

  return (
    <div
      ref={ref}
      {...rest}
      data-motion="slide-in"
      className={clsx(
        "flex w-full flex-col items-start justify-center gap-4 overflow-clip rounded-(--border-radius-xl,16px) border-2 border-border-subtle bg-transparent px-6 py-9 transition-colors hover:border-border focus-within:border-border md:row-span-4 md:grid md:grid-rows-subgrid md:justify-normal",
        !visibleOnMobile && "hidden",
      )}
    >
      <span className="flex size-11 shrink-0 self-center items-center justify-center rounded-full border border-text font-heading text-xl leading-[150%] font-normal tracking-[-0.2px] text-text md:row-start-1 md:justify-self-center">
        {itemNumber}
      </span>
      {heading && (
        <h3 className="h5 w-full text-center font-heading font-normal text-text md:row-start-2">
          {heading}
        </h3>
      )}
      {heading && description && (
        <div className="w-full border-t border-border-subtle md:row-start-3" />
      )}
      {description && (
        <div
          className="w-full text-center font-body text-base leading-[160%] font-normal tracking-[-0.16px] text-text md:row-start-4"
          dangerouslySetInnerHTML={{ __html: description }}
          suppressHydrationWarning
        />
      )}
    </div>
  );
};

export default ContactHighlightItem;

export const schema = createSchema({
  type: "contact-highlights--item",
  title: "Contact highlight",
  limit: 8,
  settings: [
    {
      group: "Highlight",
      inputs: [
        {
          type: "switch",
          label: "Visible on mobile",
          name: "visibleOnMobile",
          defaultValue: true,
        },
        {
          type: "text",
          name: "heading",
          label: "Heading",
          defaultValue: "Heading",
        },
        {
          type: "richtext",
          name: "description",
          label: "Description",
          defaultValue:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        },
      ],
    },
  ],
  presets: {
    visibleOnMobile: true,
    heading: "Heading",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
  },
});
