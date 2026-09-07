import {
  IconTrustHeart,
  IconTrustLeaf,
  IconTrustShield,
} from "~/components/icon";

export function TrustBadges({
  veganLabel,
  crueltyFreeLabel,
  dermatologistTestedLabel,
}: {
  veganLabel?: string;
  crueltyFreeLabel?: string;
  dermatologistTestedLabel?: string;
}) {
  const badges = [
    { label: veganLabel, Icon: IconTrustLeaf },
    { label: crueltyFreeLabel, Icon: IconTrustHeart },
    { label: dermatologistTestedLabel, Icon: IconTrustShield },
  ].filter((badge): badge is { label: string; Icon: typeof IconTrustLeaf } =>
    Boolean(badge.label),
  );

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
