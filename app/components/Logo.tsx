import { useThemeSettings } from "@weaverse/hydrogen";
import clsx from "clsx";
import { Image } from "~/components/image";
import { Link } from "./Link";

export function Logo({ className }: { className?: string }) {
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
        className="relative"
        style={{ width: logoData ? logoWidth : "auto" }}
      >
        <>
          {logoData && (
            <Image
              data={logoData}
              sizes="auto"
              className={clsx(
                "main-logo",
                "w-full h-full object-cover",
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
                "absolute top-0 left-0 w-full h-full object-cover",
                "group-hover/header:opacity-0",
              )}
            />
          )}
        </>
      </div>
    </Link>
  );
}
