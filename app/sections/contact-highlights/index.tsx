import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";
import type { RefObject } from "react";

const ContactHighlights = ({
  ref,
  children,
  className,
  ...rest
}: HydrogenComponentProps & { ref?: RefObject<HTMLElement | null> }) => {
  return (
    <section ref={ref} {...rest} className={className}>
      <div className="mx-auto w-full max-w-230 space-y-12 px-4 pt-10 pb-12 md:px-6 lg:px-0">
        {children}
      </div>
    </section>
  );
};

export default ContactHighlights;

export const schema = createSchema({
  type: "contact-highlights",
  title: "Contact highlights",
  enabledOn: {
    pages: ["PAGE"],
  },
  childTypes: ["heading", "contact-highlights--content"],
  presets: {
    children: [
      {
        type: "heading",
        content: "Highlights",
      },
      {
        type: "contact-highlights--content",
      },
    ],
  },
});
