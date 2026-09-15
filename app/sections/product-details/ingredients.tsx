import {
  Clock,
  Drop,
  type Icon as PhosphorIcon,
  Sparkle,
} from "@phosphor-icons/react";
import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";
import type { Ref } from "react";

interface IngredientsProps extends HydrogenComponentProps {
  heading: string;
  description: string;
  ingredient1Title: string;
  ingredient1Description: string;
  ingredient2Title: string;
  ingredient2Description: string;
  ingredient3Title: string;
  ingredient3Description: string;
}

export default function KeyIngredients({
  ref,
  heading,
  description,
  ingredient1Title,
  ingredient1Description,
  ingredient2Title,
  ingredient2Description,
  ingredient3Title,
  ingredient3Description,
  ...rest
}: IngredientsProps & { ref?: Ref<HTMLElement> }) {
  const ingredients: [PhosphorIcon, string, string][] = [
    [Sparkle, ingredient1Title, ingredient1Description],
    [Clock, ingredient2Title, ingredient2Description],
    [Drop, ingredient3Title, ingredient3Description],
  ];

  return (
    <section ref={ref} {...rest} className="flex flex-col gap-10">
      <header className="max-w-3xl flex flex-col gap-3">
        <h2 className="font-['Playfair_Display'] text-[32px] leading-[normal] font-normal tracking-normal text-text">
          {heading}
        </h2>
        <p className="font-body text-[16px] leading-[160%] font-normal text-(--product-detail-text-color)">
          {description}
        </p>
      </header>
      <div className="mx-auto flex w-full flex-col gap-6 md:flex-row">
        {ingredients.map(([Icon, title, copy]) => (
          <article
            key={title}
            className="w-full flex-[1_0_0] rounded-xl border border-border-subtle p-6"
          >
            <span className="mb-5 flex size-10 items-center justify-center rounded-full bg-(--product-detail-background-color)">
              <Icon aria-hidden="true" className="size-5" weight="regular" />
            </span>
            <p className="font-body text-sm leading-[normal] font-semibold text-text">
              {title}
            </p>
            <p className="mt-3 font-body text-xs leading-[normal] font-normal text-(--product-detail-text-color)">
              {copy}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

const defaults = [
  [
    "TET8™ Patent",
    "A revolutionary technology clinically shown to target all eight signs of aging.",
  ],
  [
    "Instant Tightening Sugars",
    "Tightens in three minutes and for up to six hours.",
  ],
  [
    "Micro & Macro Hyaluronic Acid",
    "Two molecular sizes of hyaluronic acid to replenish moisture and visibly plump skin.",
  ],
];

export const schema = createSchema({
  type: "product-details--ingredients",
  title: "Key ingredients",
  limit: 1,
  settings: [
    {
      group: "Content",
      inputs: [
        {
          type: "text",
          name: "heading",
          label: "Heading",
          defaultValue: "Key Ingredients",
        },
        {
          type: "textarea",
          name: "description",
          label: "Description",
          defaultValue:
            "A potent blend of clinical actives and botanical extracts designed to restore youthful vitality.",
        },
        ...defaults.flatMap(([title, description], index) => [
          {
            type: "text" as const,
            name: `ingredient${index + 1}Title`,
            label: `Ingredient ${index + 1} title`,
            defaultValue: title,
          },
          {
            type: "textarea" as const,
            name: `ingredient${index + 1}Description`,
            label: `Ingredient ${index + 1} description`,
            defaultValue: description,
          },
        ]),
      ],
    },
  ],
});
