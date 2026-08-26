import type { ComponentType, SVGProps } from "react";
import {
  IconFooterFacebook,
  IconFooterInstagram,
  IconFooterPinterest,
  IconFooterTikTok,
  IconFooterYouTube,
} from "~/components/icon";
import { Link } from "~/components/link";

const socialIcons: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  instagram: IconFooterInstagram,
  facebook: IconFooterFacebook,
  pinterest: IconFooterPinterest,
  tiktok: IconFooterTikTok,
  youtube: IconFooterYouTube,
};

interface SocialLinksProps {
  socialInstagram: string;
  socialFacebook: string;
  socialPinterest: string;
  socialTikTok: string;
  socialYouTube: string;
}

export function SocialLinks({
  socialInstagram,
  socialFacebook,
  socialPinterest,
  socialTikTok,
  socialYouTube,
}: SocialLinksProps) {
  const accounts = [
    { name: "Instagram", to: socialInstagram, Icon: socialIcons.instagram },
    { name: "Facebook", to: socialFacebook, Icon: socialIcons.facebook },
    { name: "Pinterest", to: socialPinterest, Icon: socialIcons.pinterest },
    { name: "TikTok", to: socialTikTok, Icon: socialIcons.tiktok },
    { name: "YouTube", to: socialYouTube, Icon: socialIcons.youtube },
  ].filter((account) => account.to?.trim());

  if (accounts.length === 0) {
    return null;
  }

  return (
    <div className="flex w-full shrink-0 flex-col items-start gap-5 lg:w-auto lg:grow lg:basis-0 lg:shrink-0">
      <h6 className="hidden text-base font-semibold leading-[1.6] tracking-[-0.16px] text-(--color-footer-text) lg:block">
        Connect
      </h6>
      <div className="flex flex-wrap items-center gap-3 lg:flex-col lg:items-start">
        {accounts.map(({ to, name, Icon }) => (
          <Link
            key={name}
            to={to}
            target="_blank"
            rel="noreferrer"
            aria-label={name}
            className="flex items-center gap-2 text-base font-normal text-(--color-footer-text) py-1"
          >
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white">
              <Icon className="size-3.5" />
            </span>
            <span>{name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
