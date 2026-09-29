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
        "flex w-full flex-col items-center rounded-(--border-radius-xl,16px) border-2 border-border-subtle bg-transparent px-6 py-9 transition-colors hover:border-border focus-within:border-border",
        !visibleOnMobile && "hidden md:flex",
      )}
    >
      <span className="mb-6 flex size-11 shrink-0 items-center justify-center rounded-full border border-text font-heading text-xl leading-[150%] font-normal tracking-[-0.2px] text-text">
        {itemNumber}
      </span>
      {heading && (
        <h3 className="w-full text-center font-heading text-[31px] leading-[110%] font-normal text-text">
          {heading}
        </h3>
      )}
      {heading && description && (
        <div className="my-4 w-full border-t border-border-subtle" />
      )}
      {description && (
        <div
          className="w-full text-center font-body text-base leading-[160%] font-normal tracking-[-0.16px] text-text"
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
