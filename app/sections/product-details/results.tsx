import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";
import type { Ref } from "react";

interface ResultsProps extends HydrogenComponentProps {
  result1Value: string;
  result1Label: string;
  result1Note: string;
  result2Value: string;
  result2Label: string;
  result2Note: string;
  result3Value: string;
  result3Label: string;
  result3Note: string;
}

export default function ClinicalResults({
  ref,
  result1Value,
  result1Label,
  result1Note,
  result2Value,
  result2Label,
  result2Note,
  result3Value,
  result3Label,
  result3Note,
  ...rest
}: ResultsProps & { ref?: Ref<HTMLElement> }) {
  const results = [
    { value: result1Value, label: result1Label, note: result1Note },
    { value: result2Value, label: result2Label, note: result2Note },
    { value: result3Value, label: result3Label, note: result3Note },
  ];

  return (
    <section ref={ref} {...rest}>
      <div className="grid overflow-hidden rounded-xl bg-text-primary md:grid-cols-3">
        {results.map((result) => (
          <article
            key={String(result.label)}
            className="px-6 py-8 text-center md:border-l md:border-white/15 md:first:border-l-0"
          >
            <p className="text-center font-['Playfair_Display'] text-[48px] leading-[normal] font-normal text-background-basic">
              {result.value}
            </p>
            <p className="mt-2 text-xs font-semibold text-background-basic uppercase">
              {result.label}
            </p>
            <p className="mt-1 text-[10px] text-background-basic">
              {result.note}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

const defaults = [
  ["93%", "Saw firmer skin", "In 4 weeks"],
  ["87%", "Reported improved hydration", "Immediately"],
  ["100%", "Would recommend", "Based on clinical study"],
];

export const schema = createSchema({
  type: "product-details--results",
  title: "Clinical results",
  limit: 1,
  settings: [
    {
      group: "Results",
      inputs: defaults.flatMap(([value, label, note], index) => [
        {
          type: "text" as const,
          name: `result${index + 1}Value`,
          label: `Result ${index + 1} value`,
          defaultValue: value,
        },
        {
          type: "text" as const,
          name: `result${index + 1}Label`,
          label: `Result ${index + 1} label`,
          defaultValue: label,
        },
        {
          type: "text" as const,
          name: `result${index + 1}Note`,
          label: `Result ${index + 1} note`,
          defaultValue: note,
        },
      ]),
    },
  ],
});
