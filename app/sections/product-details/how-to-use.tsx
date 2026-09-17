import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";
import type { Ref } from "react";

interface HowToUseProps extends HydrogenComponentProps {
  heading: string;
  step1: string;
  step2: string;
  step3: string;
}

export default function HowToUse({
  ref,
  heading,
  step1,
  step2,
  step3,
  ...rest
}: HowToUseProps & { ref?: Ref<HTMLElement> }) {
  return (
    <section ref={ref} {...rest}>
      <div className="rounded-xl bg-(--product-detail-background-color) p-12 gap-10 flex flex-col">
        <h2 className="text-3xl leading-tight md:text-4xl">{heading}</h2>
        <ol className="flex flex-col gap-8">
          {[step1, step2, step3].map((step, index) => (
            <li
              key={step}
              className="grid grid-cols-[1.5rem_1fr] gap-6 text-sm leading-6"
            >
              <span className="font-semibold">{index + 1}</span>
              <span className="text-(--product-detail-text-color)">{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export const schema = createSchema({
  type: "product-details--how-to-use",
  title: "How to use",
  limit: 1,
  settings: [
    {
      group: "Content",
      inputs: [
        {
          type: "text",
          name: "heading",
          label: "Heading",
          defaultValue: "How to Use",
        },
        {
          type: "text",
          name: "step1",
          label: "Step 1",
          defaultValue: "Apply 2–3 drops to clean, dry skin morning and night.",
        },
        {
          type: "text",
          name: "step2",
          label: "Step 2",
          defaultValue:
            "Gently massage until absorbed, focusing on areas of concern.",
        },
        {
          type: "text",
          name: "step3",
          label: "Step 3",
          defaultValue:
            "Follow with your preferred moisturizer to seal in benefits.",
        },
      ],
    },
  ],
});
