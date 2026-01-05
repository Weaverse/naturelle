import type { HydrogenComponentSchema } from "@weaverse/hydrogen";
import type { RefObject } from "react";
import { Section, type SectionProps, sectionInspector } from "../atoms/Section";

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

export let schema: HydrogenComponentSchema = {
  type: "newsletter",
  title: "Newsletter",
  settings: sectionInspector,
  childTypes: ["newsletter-icon", "heading", "description", "newsletter-input"],
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
        type: "description",
        content: "Get 15% off your first order",
      },
      {
        type: "newsletter-input",
      },
    ],
  },
};
