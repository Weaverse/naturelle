import { useThemeSettings } from "@weaverse/hydrogen";
import clsx from "clsx";
import { Image } from "~/components/image";
import { Link } from "~/components/link";

export function Logo({
  className,
  width,
}: {
  className?: string;
  width?: number;
}) {
  let settings = useThemeSettings();
  let { logoData, transparentLogoData, logoWidth } = settings;
  let logoUrl = logoData?.url;
  let aspectRatio =
    logoData?.width && logoData?.height
      ? `${logoData.width} / ${logoData.height}`
      : "80 / 29";
  return (
    <Link
      className={clsx(
        "flex items-center justify-center w-full h-full lg:w-fit lg:h-fit z-30",
        className,
      )}
      to="/"
      prefetch="intent"
    >
      <div
        className="relative text-inherit"
        style={{ width: logoData ? (width ?? logoWidth) : "auto" }}
      >
        {logoUrl && (
          <span
            aria-label={logoData.altText || "Naturélle"}
            className="main-logo block w-full bg-(--color-header-text) group-hover/header:opacity-100"
            role="img"
            style={{
              aspectRatio,
              maskImage: `url(${logoUrl})`,
              maskPosition: "center",
              maskRepeat: "no-repeat",
              maskSize: "contain",
              WebkitMaskImage: `url(${logoUrl})`,
              WebkitMaskPosition: "center",
              WebkitMaskRepeat: "no-repeat",
              WebkitMaskSize: "contain",
            }}
          />
        )}
        {transparentLogoData && (
          <Image
            data={transparentLogoData}
            sizes="auto"
            className={clsx(
              "transparent-logo",
              "absolute top-0 left-0 w-full h-full object-cover",
              "group-hover/header:opacity-0",
            )}
          />
        )}
      </div>
    </Link>
  );
}
