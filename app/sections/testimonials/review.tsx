import type { HydrogenComponentProps } from "@weaverse/hydrogen";
import { createSchema } from "@weaverse/hydrogen";
import type React from "react";
import type { RefObject } from "react";
import { IconStar } from "~/components/icon";

interface ReviewProps extends HydrogenComponentProps {
  name?: string;
  ratting: number;
  content?: string;
}

const Review = ({
  ref,
  ...props
}: ReviewProps & { ref?: RefObject<HTMLDivElement | null> }) => {
  let { name, ratting, content, children, ...rest } = props;
  const renderStars = () => {
    const stars: React.ReactElement[] = [];
    for (let i = 0; i < ratting; i += 1) {
      stars.push(<IconStar stroke="white" fill="var(--text-color)" key={i} />);
    }
    return stars;
  };
  return (
    <div
      data-motion="fade-up"
      ref={ref}
      {...rest}
      className="border rounded border-[var(--border-color)] gap-2 p-6 flex flex-col relative"
    >
      {name && <h4 className="font-medium text-[var(--text-color)]">{name}</h4>}
      <p className="flex gap-1">{renderStars()}</p>
      {content && (
        <p className="font-normal text-[var(--text-color)]">{content}</p>
      )}
      <div className="hover:opacity-10 hover:bg-white opacity-0 absolute inset-0 transition-opacity duration-500" />
    </div>
  );
};

export default Review;

export const schema = createSchema({
  type: "reviews",
  title: "Reviews",
  settings: [
    {
      group: "Review",
      inputs: [
        {
          type: "text",
          name: "name",
          label: "Name",
          defaultValue: "Debbie",
        },
        {
          type: "range",
          name: "ratting",
          label: "Reviews",
          defaultValue: 3,
          configs: {
            min: 1,
            max: 5,
            step: 1,
          },
        },
        {
          type: "textarea",
          name: "content",
          label: "Content",
          defaultValue:
            "“I love the way the app works. It's easy to use and I can see all my transactions in one place.”",
        },
      ],
    },
  ],
});
