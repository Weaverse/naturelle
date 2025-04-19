import type { HydrogenComponentSchema } from "@weaverse/hydrogen";
import { forwardRef } from "react";
import { Section, type SectionProps, sectionInspector } from "../atoms/Section";

type NewsletterProps = SectionProps;

const Newsletter = forwardRef<HTMLElement, NewsletterProps>((props, ref) => {
  let { children, ...rest } = props;

  return (
    <Section ref={ref} {...rest}>
      {children}
    </Section>
  );
});

export default Newsletter;

export let schema: HydrogenComponentSchema = {
  type: "newsletter",
  title: "Newsletter",
  toolbar: ["general-settings", ["duplicate", "delete"]],
  inspector: sectionInspector,
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
