import { useTranslation } from "@weaverse/hydrogen";
import { Link } from "~/components/link";

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
  const { t } = useTranslation();
  return (
    <nav
      aria-label={t("footer.legal")}
      className="flex flex-wrap items-center gap-x-4 gap-y-2"
    >
      {policyItems
        .filter((policy): policy is Policy => Boolean(policy))
        .map(({ title, handle }) => (
          <Link
            key={handle}
            to={`/policies/${handle}`}
            prefetch="intent"
            className="transition-opacity hover:opacity-70"
          >
            {title}
          </Link>
        ))}
    </nav>
  );
}
