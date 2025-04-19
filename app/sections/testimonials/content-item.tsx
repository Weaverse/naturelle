import type {
  HydrogenComponentProps,
  HydrogenComponentSchema,
} from "@weaverse/hydrogen";
import { type CSSProperties, forwardRef } from "react";

interface ContentReviewProps extends HydrogenComponentProps {
  review?: number;
  gap?: number;
}

const ContentReview = forwardRef<HTMLDivElement, ContentReviewProps>(
  (props, ref) => {
    let { review, gap, children, ...rest } = props;
    let style: CSSProperties = {
      "--gap": `${gap}px`,
    } as CSSProperties;
    let displayedChildren = children?.slice(0, review);

    return (
      <div
        ref={ref}
        {...rest}
        className="flex flex-col gap-[var(--gap)]"
        style={style}
      >
        {displayedChildren}
      </div>
    );
  },
);

export default ContentReview;

export let schema: HydrogenComponentSchema = {
  type: "content-reviews--review",
  title: "List reviews",
  toolbar: ["general-settings", ["duplicate", "delete"]],
  inspector: [
    {
      group: "Content reviews",
      inputs: [
        {
          type: "range",
          name: "review",
          label: "Reviews",
          defaultValue: 3,
          configs: {
            min: 1,
            max: 4,
            step: 1,
          },
        },
        {
          type: "range",
          label: "Gap",
          name: "gap",
          configs: {
            min: 16,
            max: 40,
            step: 4,
            unit: "px",
          },
          defaultValue: 20,
        },
      ],
    },
  ],
  childTypes: ["reviews"],
  presets: {
    children: [
      {
        type: "reviews",
        name: "Debbie",
        content:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
      },
      {
        type: "reviews",
        name: "Emmanuelle",
        content:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
      },
      {
        type: "reviews",
        name: "Veronica",
        content:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
      },
    ],
  },
};
