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
        {logoData && (
          <Image
            data={logoData}
            sizes="auto"
            loading="eager"
            className={clsx(
              "main-logo",
              "h-full w-full object-cover transition-opacity duration-500 ease-in-out motion-reduce:transition-none",
              "group-hover/header:opacity-100",
            )}
          />
        )}
        {transparentLogoData && (
          <Image
            data={transparentLogoData}
            sizes="auto"
            className={clsx(
              "transparent-logo",
              "absolute top-0 left-0 h-full w-full object-cover transition-opacity duration-500 ease-in-out motion-reduce:transition-none",
              "group-hover/header:opacity-0",
            )}
          />
        )}
      </div>
    </Link>
  );
}
