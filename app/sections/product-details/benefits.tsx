import {
  CheckCircle,
  Drop,
  Leaf,
  type Icon as PhosphorIcon,
  Shield,
} from "@phosphor-icons/react";
import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";
import type { Ref } from "react";

interface BenefitsProps extends HydrogenComponentProps {
  heading: string;
  description: string;
  benefit1Title: string;
  benefit1Description: string;
  benefit2Title: string;
  benefit2Description: string;
  benefit3Title: string;
  benefit3Description: string;
  benefit4Title: string;
  benefit4Description: string;
}

export default function ProductBenefits({
  ref,
  heading,
  description,
  benefit1Title,
  benefit1Description,
  benefit2Title,
  benefit2Description,
  benefit3Title,
  benefit3Description,
  benefit4Title,
  benefit4Description,
  ...rest
}: BenefitsProps & { ref?: Ref<HTMLElement> }) {
  const benefits: [PhosphorIcon, string, string][] = [
    [Drop, benefit1Title, benefit1Description],
    [Shield, benefit2Title, benefit2Description],
    [Leaf, benefit3Title, benefit3Description],
    [CheckCircle, benefit4Title, benefit4Description],
  ];

  return (
    <section ref={ref} {...rest} className="flex flex-col gap-6">
      <header className="flex flex-col items-start gap-3 self-stretch">
        <h2 className="font-['Playfair_Display'] text-[40px] leading-[normal] font-normal tracking-normal text-text">
          {heading}
        </h2>
        <p className="font-body text-[18px] leading-[160%] font-normal text-(--product-detail-text-color)">
          {description}
        </p>
      </header>
      <div className="mx-auto flex w-full flex-col gap-4 md:flex-row">
        {benefits.map(([Icon, title, copy]) => (
          <article
            key={title}
            className="flex w-full flex-[1_0_0] flex-col items-center gap-3 rounded-xl bg-(--product-detail-background-color) p-6 text-center"
          >
            <Icon aria-hidden="true" className="size-6" weight="regular" />
            <p className="font-body text-sm leading-[normal] font-semibold text-text">
              {title}
            </p>
            <p className="font-body text-xs leading-[normal] font-normal text-(--product-detail-text-color)">
              {copy}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

const benefitInputs = [1, 2, 3, 4].flatMap((index) => [
  {
    type: "text" as const,
    name: `benefit${index}Title`,
    label: `Benefit ${index} title`,
    defaultValue: [
      "Deep Hydration",
      "Anti-Aging",
      "Vegan & Cruelty-Free",
      "Dermatologist Tested",
    ][index - 1],
  },
  {
    type: "text" as const,
    name: `benefit${index}Description`,
    label: `Benefit ${index} description`,
    defaultValue: [
      "24-hour moisture lock",
      "Targets 8 signs of aging",
      "Ethical luxury",
      "Clinically proven",
    ][index - 1],
  },
]);

export const schema = createSchema({
  type: "product-details--benefits",
  title: "Benefits",
  limit: 1,
  settings: [
    {
      group: "Content",
      inputs: [
        {
          type: "text",
          name: "heading",
          label: "Heading",
          defaultValue: "The Science of Radiance",
        },
        {
          type: "textarea",
          name: "description",
          label: "Description",
          defaultValue:
            "A breakthrough serum that targets the eight signs of aging with clinical precision and visible results.",
        },
        ...benefitInputs,
      ],
    },
  ],
});
