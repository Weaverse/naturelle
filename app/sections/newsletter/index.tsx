import { createSchema } from "@weaverse/hydrogen";
import type { RefObject } from "react";
import { backgroundInputs } from "~/components/background-image";
import { overlayInputs } from "~/components/overlay";
import { layoutInputs, Section, type SectionProps } from "~/components/section";
import { useWeaverseStudioCheck } from "~/hooks/use-weaverse-studio-check";
import { useRootLoaderData } from "~/root";
import { cn } from "~/utils/cn";

type NewsletterProps = SectionProps;

const Newsletter = ({
  ref,
  ...props
}: NewsletterProps & { ref?: RefObject<HTMLElement | null> }) => {
  let { children, containerClassName, ...rest } = props;
  const isStudio = useWeaverseStudioCheck();
  const klaviyoConfigured = Boolean(
    useRootLoaderData()?.integrations?.klaviyoNewsletter,
  );

  if (!klaviyoConfigured && !isStudio) {
    return null;
  }

  return (
    <Section
      ref={ref}
      {...rest}
      containerClassName={cn(
        "[&_.heading]:mx-auto [&_.heading]:w-fit [&_.heading]:max-w-full [&_.paragraph]:mx-auto [&_.paragraph]:w-fit [&_.paragraph]:max-w-full",
        containerClassName,
      )}
    >
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
  title: "Subscription",
  settings: [
    {
      group: "Layout",
      inputs: layoutInputs,
    },
    {
      group: "Background",
      inputs: [
        ...backgroundInputs.map((input) =>
          input.name === "backgroundColor"
            ? { ...input, defaultValue: "#E4E4E4" }
            : { ...input, condition: () => false },
        ),
        ...overlayInputs.map((input) => ({
          ...input,
          condition: () => false,
        })),
      ],
    },
  ],
  childTypes: ["newsletter-icon", "heading", "paragraph", "newsletter-input"],
  presets: {
    backgroundColor: "#E4E4E4",
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
