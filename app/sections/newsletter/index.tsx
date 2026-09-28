import { createSchema } from "@weaverse/hydrogen";
import type { RefObject } from "react";
import {
  Section,
  type SectionProps,
  sectionInspector,
} from "~/components/section";
import { useWeaverseStudioCheck } from "~/hooks/use-weaverse-studio-check";
import { useRootLoaderData } from "~/root";

type NewsletterProps = SectionProps;

const Newsletter = ({
  ref,
  ...props
}: NewsletterProps & { ref?: RefObject<HTMLElement | null> }) => {
  let { children, ...rest } = props;
  const isStudio = useWeaverseStudioCheck();
  const klaviyoConfigured = Boolean(
    useRootLoaderData()?.integrations?.klaviyoNewsletter,
  );

  if (!klaviyoConfigured && !isStudio) {
    return null;
  }

  return (
    <Section ref={ref} {...rest}>
      {klaviyoConfigured ? (
        children
      ) : (
        <div className="rounded-md border border-dashed border-border p-4 text-center text-sm text-text-subtle">
          Configure Klaviyo private token and newsletter list ID
        </div>
      )}
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
