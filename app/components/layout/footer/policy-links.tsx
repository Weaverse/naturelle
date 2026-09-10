import { NavLink } from "react-router";

type Policy = {
  id?: string | null;
  title: string;
  handle: string;
};

export function PolicyLinks({
  policyItems,
}: {
  policyItems: (Policy | null | undefined)[];
}) {
  return (
    <nav
      aria-label="Legal"
      className="flex flex-wrap items-center gap-x-4 gap-y-2"
    >
      {policyItems
        .filter((policy): policy is Policy => Boolean(policy))
        .map(({ title, handle }) => (
          <NavLink
            key={handle}
            to={`/policies/${handle}`}
            prefetch="intent"
            className="transition-opacity hover:opacity-70"
          >
            {title}
          </NavLink>
        ))}
    </nav>
  );
}
