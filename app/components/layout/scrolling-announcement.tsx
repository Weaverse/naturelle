import { useThemeSettings } from "@weaverse/hydrogen";
import clsx from "clsx";
import {
  type CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  IconAnnouncementChevron,
  IconAnnouncementSparkle,
  IconAnnouncementStar,
  IconAnnouncementTicket,
  IconAnnouncementTree,
} from "~/components/icon";

type AnnouncementSegment = {
  id: string;
  text: string;
  icon: "sparkle" | "ticket" | "tree";
  trailingStar: boolean;
};

function SegmentIcon({
  icon,
  className,
}: {
  icon: AnnouncementSegment["icon"];
  className?: string;
}) {
  if (icon === "ticket") {
    return <IconAnnouncementTicket className={className} />;
  }
  if (icon === "tree") {
    return <IconAnnouncementTree className={className} />;
  }
  return <IconAnnouncementSparkle className={className} />;
}

function AnnouncementItem({
  segment,
  className,
}: {
  segment: AnnouncementSegment;
  className?: string;
}) {
  return (
    <span className={clsx("flex items-center whitespace-nowrap", className)}>
      <SegmentIcon
        icon={segment.icon}
        className={clsx(
          "shrink-0 text-border-subtle",
          segment.icon === "sparkle" && "size-5",
          segment.icon === "ticket" && "h-4 w-5",
          segment.icon === "tree" && "size-5",
        )}
      />

      <span className="font-sans font-medium leading-normal tracking-[0.96px] text-(--color-topbar-text) uppercase">
        {segment.text}
      </span>
      {segment.trailingStar && (
        <IconAnnouncementStar className="size-2.5 shrink-0 text-(--color-topbar-text) opacity-60" />
      )}
    </span>
  );
}

export function ScrollingAnnouncement() {
  const settings = useThemeSettings();
  const {
    announcementMessage1,
    announcementMessage1Icon,
    announcementMessage1TrailingStar,
    announcementMessage2,
    announcementMessage2Icon,
    announcementMessage2TrailingStar,
    announcementMessage3,
    announcementMessage3Icon,
    announcementMessage3TrailingStar,
    announcementMessage4,
    announcementMessage4Icon,
    announcementMessage4TrailingStar,
    announcementMessage5,
    announcementMessage5Icon,
    announcementMessage5TrailingStar,
    announcementMessage6,
    announcementMessage6Icon,
    announcementMessage6TrailingStar,
    textSize,
    announcementBarHeight,
    speed,
    gap,
    announcementCtaText,
    announcementCtaLink,
    stickyAnnouncementBar,
    enableScrollingText,
  } = settings;

  const segments = useMemo(
    () =>
      [
        {
          id: "announcement-1",
          text: announcementMessage1,
          icon: announcementMessage1Icon,
          trailingStar: announcementMessage1TrailingStar,
        },
        {
          id: "announcement-2",
          text: announcementMessage2,
          icon: announcementMessage2Icon,
          trailingStar: announcementMessage2TrailingStar,
        },
        {
          id: "announcement-3",
          text: announcementMessage3,
          icon: announcementMessage3Icon,
          trailingStar: announcementMessage3TrailingStar,
        },
        {
          id: "announcement-4",
          text: announcementMessage4,
          icon: announcementMessage4Icon,
          trailingStar: announcementMessage4TrailingStar,
        },
        {
          id: "announcement-5",
          text: announcementMessage5,
          icon: announcementMessage5Icon,
          trailingStar: announcementMessage5TrailingStar,
        },
        {
          id: "announcement-6",
          text: announcementMessage6,
          icon: announcementMessage6Icon,
          trailingStar: announcementMessage6TrailingStar,
        },
      ].filter((segment): segment is AnnouncementSegment =>
        Boolean(segment.text?.trim()),
      ),
    [
      announcementMessage1,
      announcementMessage1Icon,
      announcementMessage1TrailingStar,
      announcementMessage2,
      announcementMessage2Icon,
      announcementMessage2TrailingStar,
      announcementMessage3,
      announcementMessage3Icon,
      announcementMessage3TrailingStar,
      announcementMessage4,
      announcementMessage4Icon,
      announcementMessage4TrailingStar,
      announcementMessage5,
      announcementMessage5Icon,
      announcementMessage5TrailingStar,
      announcementMessage6,
      announcementMessage6Icon,
      announcementMessage6TrailingStar,
    ],
  );
  const [activeIndex, setActiveIndex] = useState(0);

  const goPrev = useCallback(() => {
    setActiveIndex((current) =>
      current === 0 ? segments.length - 1 : current - 1,
    );
  }, [segments.length]);

  const goNext = useCallback(() => {
    setActiveIndex((current) => (current + 1) % segments.length);
  }, [segments.length]);

  useEffect(() => {
    if (!enableScrollingText || segments.length <= 1) {
      return;
    }
    const intervalMs = Math.max(Number(speed) || 9, 2) * 1000;
    const timer = window.setInterval(goNext, intervalMs);
    return () => window.clearInterval(timer);
  }, [enableScrollingText, goNext, segments.length, speed]);

  const visibleSegments = useMemo(() => {
    if (segments.length === 0) {
      return [];
    }
    const count = Math.min(3, segments.length);
    return Array.from({ length: count }, (_, offset) => {
      return segments[(activeIndex + offset) % segments.length];
    });
  }, [activeIndex, segments]);

  const style = {
    "--height-bar": `${announcementBarHeight || 48}px`,
    "--announcement-gap": `${gap || 32}px`,
    fontSize: `${textSize || 12}px`,
  } as CSSProperties;

  const canNavigate = segments.length > 1;

  return (
    <div
      id="announcement-bar"
      style={style}
      className={clsx(
        "flex h-(--height-bar) items-center justify-center overflow-hidden",
        "bg-(--color-topbar-bg) text-(--color-topbar-text)",
        "border-b border-(--color-topbar-border)",
        stickyAnnouncementBar ? "sticky top-0 z-50" : "relative z-40",
      )}
    >
      <div className="mx-auto flex w-full max-w-page shrink-0 items-center justify-center gap-(--announcement-gap) border-b-(--color-topbar-border) px-8 py-2.5">
        <button
          type="button"
          onClick={goPrev}
          disabled={!canNavigate}
          aria-label="Previous announcement"
          className={clsx(
            "flex h-full w-2 shrink-0 items-center justify-center",
            "text-(--color-topbar-text)/80 transition-opacity",
            canNavigate
              ? "cursor-pointer hover:opacity-100"
              : "cursor-default opacity-40",
          )}
        >
          <IconAnnouncementChevron
            direction="left"
            className="h-3 w-2 shrink-0"
          />
        </button>

        <div className="mx-auto flex w-full">
          <div className="mx-auto flex w-full gap-(--announcement-gap)">
            {visibleSegments.map((segment, index) => (
              <AnnouncementItem
                key={`${segment.id}-${index}`}
                segment={segment}
                className={clsx(
                  "min-w-0 overflow-hidden font-body leading-none",
                  index === 0 && "flex-[1_0_0] gap-2",
                  index === 1 && "hidden flex-[1_0_0] gap-2 md:flex",
                  index === 2 && "hidden gap-1.5 lg:flex",
                )}
              />
            ))}
          </div>

          {announcementCtaText && announcementCtaLink && (
            <a
              href={announcementCtaLink}
              className="hidden shrink-0 font-sans font-bold leading-normal tracking-[0.96px] text-(--color-topbar-text) uppercase lg:inline-flex"
            >
              → {announcementCtaText}
            </a>
          )}
        </div>

        <button
          type="button"
          onClick={goNext}
          disabled={!canNavigate}
          aria-label="Next announcement"
          className={clsx(
            "flex h-full w-2 shrink-0 items-center justify-center",
            "text-(--color-topbar-text)/80 transition-opacity",
            canNavigate
              ? "cursor-pointer hover:opacity-100"
              : "cursor-default opacity-40",
          )}
        >
          <IconAnnouncementChevron
            direction="right"
            className="h-3 w-2 shrink-0"
          />
        </button>
      </div>
    </div>
  );
}
