import type { HydrogenComponentSchema } from "@weaverse/hydrogen";
import { createSchema } from "@weaverse/hydrogen";
import type { RefObject } from "react";
import {
  Section,
  type SectionProps,
  sectionInspector,
} from "~/components/section";

type NewsletterProps = SectionProps;

const Newsletter = ({
  ref,
  ...props
}: NewsletterProps & { ref?: RefObject<HTMLElement | null> }) => {
  let { children, ...rest } = props;

  return (
    <Section ref={ref} {...rest}>
      {children}
    </Section>
  );
};

export default Newsletter;

export const schema = createSchema({
  type: "newsletter",
  title: "Newsletter",
  settings: sectionInspector,
  childTypes: ["newsletter-icon", "heading", "paragraph", "newsletter-input"],
  presets: {
    children: [
      {
        type: "newsletter-icon",
      },
      {
        type: "heading",
        content: "Sign up for the updates",
      },
      {
        type: "paragraph",
        content: "Get 15% off your first order",
      },
      {
        type: "newsletter-input",
      },
    ],
  },
});
