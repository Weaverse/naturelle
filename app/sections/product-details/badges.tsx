import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";
import { Heart, Leaf, type LucideIcon, RefreshCw } from "lucide-react";
import type { Ref } from "react";

interface BadgesProps extends HydrogenComponentProps {
  badge1: string;
  badge2: string;
  badge3: string;
}

export default function ProductBadges({
  ref,
  badge1,
  badge2,
  badge3,
  ...rest
}: BadgesProps & { ref?: Ref<HTMLElement> }) {
  const badges: [LucideIcon, string][] = [
    [Leaf, badge1],
    [Heart, badge2],
    [RefreshCw, badge3],
  ];

  return (
    <section ref={ref} {...rest}>
      <div className="flex flex-col items-center justify-center gap-3 pt-10 md:flex-row md:gap-12">
        {badges.map(([Icon, label]) => (
          <span
            key={label}
            className="inline-flex items-center gap-3 rounded-full border border-border-subtle px-4 py-3 font-body text-sm leading-[normal] font-semibold text-text"
          >
            <Icon aria-hidden="true" className="size-5" strokeWidth={1.5} />
            {label}
          </span>
        ))}
      </div>
    </section>
  );
}

export const schema = createSchema({
  type: "product-details--badges",
  title: "Product badges",
  limit: 1,
  settings: [
    {
      group: "Badges",
      inputs: [
        {
          type: "text",
          name: "badge1",
          label: "Badge 1",
          defaultValue: "Vegan",
        },
        {
          type: "text",
          name: "badge2",
          label: "Badge 2",
          defaultValue: "Cruelty-Free",
        },
        {
          type: "text",
          name: "badge3",
          label: "Badge 3",
          defaultValue: "Recyclable Packaging",
        },
      ],
    },
  ],
});
