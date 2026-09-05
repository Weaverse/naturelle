import {
  IconTrustHeart,
  IconTrustLeaf,
  IconTrustShield,
} from "~/components/icon";

const badges = [
  { label: "100% Vegan", Icon: IconTrustLeaf },
  { label: "Certified Cruelty-Free", Icon: IconTrustHeart },
  { label: "Dermatologist Tested", Icon: IconTrustShield },
];

export function TrustBadges() {
  return (
    <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
      {badges.map(({ label, Icon }) => (
        <div key={label} className="flex items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-(--color-background-subtle-1)">
            <Icon className="size-4.5 text-(--color-footer-text)" />
          </span>
          <span className="font-body text-[16px] font-semibold leading-[1.6] text-(--color-footer-text)">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
