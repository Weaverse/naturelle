import type { HydrogenComponentProps } from "@weaverse/hydrogen";
import { createSchema } from "@weaverse/hydrogen";
import type React from "react";
import type { RefObject } from "react";
import { IconStar } from "~/components/icon";

interface ReviewProps extends HydrogenComponentProps {
  name?: string;
  ratting: number;
  role?: string;
  reviewTitle?: string;
  reviewDate?: string;
  verified?: boolean;
  content?: string;
}

const Review = ({
  ref,
  ...props
}: ReviewProps & { ref?: RefObject<HTMLDivElement | null> }) => {
  let {
    name,
    ratting,
    role = "Reviewer",
    reviewTitle = "Amazing product",
    reviewDate = "August 20, 2026",
    verified = true,
    content,
    children,
    ...rest
  } = props;
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
      className="relative flex flex-col rounded-2xl border border-(--border-color) bg-black/20 px-6 py-4"
    >
      <div className="flex items-center gap-4">
        <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[#251E20] font-medium text-white">
          {name?.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            {name && (
              <h4 className="font-medium text-(--text-color)">{name}</h4>
            )}
            {verified && (
              <span className="rounded-full bg-[#DCD8D6] px-3 py-1 text-xs leading-none text-[#5E5E5E]">
                Verified Buyer
              </span>
            )}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-(--text-color)">
            {role && <span>{role}</span>}
            {reviewDate && <time>{reviewDate}</time>}
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-4">
        <p className="flex gap-1">{renderStars()}</p>
        <span className="text-xs text-[#5E5E5E]">{ratting.toFixed(1)}</span>
      </div>
      {reviewTitle && (
        <h5 className="mt-4 font-medium text-(--text-color)">{reviewTitle}</h5>
      )}
      {content && (
        <p className="mt-2 text-sm font-normal text-(--text-color)">
          {content}
        </p>
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
          type: "text",
          name: "role",
          label: "Role",
          defaultValue: "Reviewer",
        },
        {
          type: "switch",
          name: "verified",
          label: "Show verified badge",
          defaultValue: true,
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
          type: "text",
          name: "reviewTitle",
          label: "Review title",
          defaultValue: "Amazing product",
        },
        {
          type: "text",
          name: "reviewDate",
          label: "Review date",
          defaultValue: "August 20, 2026",
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
