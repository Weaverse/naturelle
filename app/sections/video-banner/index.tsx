import {
  createSchema,
  type HydrogenComponentProps,
  IMAGES_PLACEHOLDERS,
} from "@weaverse/hydrogen";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import clsx from "clsx";
import type { CSSProperties, RefObject } from "react";
import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useInView } from "react-intersection-observer";
import { Image } from "~/components/image";
import {
  Overlay,
  type OverlayProps,
  overlayInputs,
} from "~/components/overlay";
import { layoutInputs } from "~/components/section";
import { useAnimation } from "~/hooks/use-animation";

const SECTION_HEIGHTS = {
  small: {
    desktop: "40vh",
    mobile: "50vh",
  },
  medium: {
    desktop: "50vh",
    mobile: "60vh",
  },
  large: {
    desktop: "70vh",
    mobile: "80vh",
  },
  full: {
    desktop: "calc(var(--screen-height, 100vh))",
    mobile: "calc(var(--screen-height, 80vh))",
  },
  custom: null,
};

type WeaverseVideo = {
  id: string;
  url: string;
  altText: string;
  width: number;
  height: number;
  previewSrc: string;
};

export interface VideoBannerProps
  extends
    Omit<VariantProps<typeof variants>, "padding">,
    HydrogenComponentProps,
    OverlayProps {
  videoURL?: WeaverseVideo;
  videoURL2?: string;
  height: "small" | "medium" | "large" | "full" | "custom";
  heightOnDesktop: number;
  heightOnMobile: number;
}

let variants = cva(
  "video-banner-content absolute inset-0 z-10 mx-auto flex max-w-[100vw] flex-col px-10 md:px-12 lg:px-20 [&_.paragraph]:mx-[unset] [&_.paragraph]:w-fit [&_.paragraph]:max-w-full",
  {
    variants: {
      gap: {
        0: "",
        4: "space-y-1",
        8: "space-y-2",
        12: "space-y-3",
        16: "space-y-4",
        20: "space-y-5",
        24: "space-y-3 lg:space-y-6",
        28: "space-y-3.5 lg:space-y-7",
        32: "space-y-4 lg:space-y-8",
        36: "space-y-4 lg:space-y-9",
        40: "space-y-10",
        44: "space-y-5 lg:space-y-11",
        48: "space-y-6 lg:space-y-12",
        52: "space-y-6 lg:space-y-[52px]",
        56: "space-y-7 lg:space-y-14",
        60: "space-y-7 lg:space-y-[60px]",
      },
      contentPosition: {
        "top left":
          "items-start justify-start [&_.paragraph]:[text-align:left]",
        "top center":
          "items-center justify-start [&_.paragraph]:[text-align:center]",
        "top right":
          "items-end justify-start [&_.paragraph]:[text-align:right]",
        "center left":
          "items-start justify-center [&_.paragraph]:[text-align:left]",
        "center center":
          "items-center justify-center [&_.paragraph]:[text-align:center]",
        "center right":
          "items-end justify-center [&_.paragraph]:[text-align:right]",
        "bottom left":
          "items-start justify-end [&_.paragraph]:[text-align:left]",
        "bottom center":
          "items-center justify-end [&_.paragraph]:[text-align:center]",
        "bottom right":
          "items-end justify-end [&_.paragraph]:[text-align:right]",
      },
      verticalPadding: {
        none: "",
        small: "py-4 md:py-6 lg:py-8",
        medium: "py-8 md:py-12 lg:py-20",
        large: "py-12 md:py-24 lg:py-32",
      },
    },
    defaultVariants: {
      gap: 20,
      contentPosition: "center center",
      verticalPadding: "medium",
    },
  },
);

// react-player v3 is ESM-only and lazy-loads individual players internally.
const ReactPlayer = lazy(() => import("react-player"));

type PlayerSize = {
  width: number | string;
  height: number | string;
};

function getPlayerSize(section: HTMLElement | null): PlayerSize {
  if (!section) {
    return { width: "100%", height: "100%" };
  }

  let rect = section.getBoundingClientRect();
  if (!(rect.width && rect.height)) {
    return { width: "100%", height: "100%" };
  }

  let sourceRatio = 16 / 9;
  let width = Math.max(rect.width, rect.height * sourceRatio);

  return {
    width: Math.ceil(width),
    height: Math.ceil(width / sourceRatio),
  };
}

let VideoBanner = ({
  ref,
  ...props
}: VideoBannerProps & { ref?: RefObject<HTMLElement | null> }) => {
  let {
    videoURL,
    videoURL2,
    gap,
    contentPosition,
    verticalPadding,
    height,
    heightOnDesktop,
    heightOnMobile,
    enableOverlay,
    overlayColor,
    overlayColorHover,
    overlayOpacity,
    children,
    ...rest
  } = props;

  let sectionRef = useRef<HTMLElement | null>(null);
  let [size, setSize] = useState<PlayerSize>({
    width: "100%",
    height: "100%",
  });

  let desktopHeight =
    SECTION_HEIGHTS[height]?.desktop || `${heightOnDesktop}px`;
  let mobileHeight = SECTION_HEIGHTS[height]?.mobile || `${heightOnMobile}px`;
  let sectionStyle: CSSProperties = {
    "--desktop-height": desktopHeight,
    "--mobile-height": mobileHeight,
  } as CSSProperties;
  let videoSource = videoURL2?.trim() || videoURL?.url;

  let { ref: inViewRef, inView } = useInView({
    triggerOnce: true,
  });

  // Use `useCallback` so we don't recreate the function on each render
  let setRefs = useCallback(
    (node: HTMLElement | null) => {
      sectionRef.current = node;
      // Ref's from useRef needs to have the node assigned to `current`
      if (ref) {
        Object.assign(ref, { current: node });
      }
      // Callback refs, like the one from `useInView`, is a function that takes the node as an argument
      inViewRef(node);
    },
    [inViewRef, ref],
  );

  useEffect(() => {
    let section = sectionRef.current;
    if (!section) {
      return;
    }

    function updatePlayerSize() {
      setSize(getPlayerSize(section));
    }

    updatePlayerSize();
    let resizeObserver = new ResizeObserver(updatePlayerSize);
    resizeObserver.observe(section);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const [scope] = useAnimation(ref);

  return (
    <section
      ref={setRefs}
      {...rest}
      className="relative isolate h-(--mobile-height) w-full overflow-hidden sm:h-(--desktop-height)"
      style={sectionStyle}
    >
      {inView && videoSource ? (
        <Suspense fallback={<div className="absolute inset-0 bg-background" />}>
          <div
            className="absolute top-1/2 left-1/2 z-0 -translate-x-1/2 -translate-y-1/2"
            style={size}
          >
            <ReactPlayer
              src={videoSource}
              loop={true}
              width="100%"
              height="100%"
              controls={false}
              className="h-full w-full [&_iframe]:h-full [&_iframe]:w-full [&_video]:h-full [&_video]:w-full [&_video]:object-cover"
              playing
              muted
              playsInline
            />
          </div>
        </Suspense>
      ) : (
        <Image
          data={{
            url: IMAGES_PLACEHOLDERS.banner_1,
            altText: "Video placeholder",
          }}
          sizes="100vw"
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      <Overlay
        enableOverlay={enableOverlay}
        overlayColor={overlayColor}
        overlayColorHover={overlayColorHover}
        overlayOpacity={overlayOpacity}
        className="z-0"
      />
      <div
        ref={scope}
        className={clsx(variants({ gap, contentPosition, verticalPadding }))}
      >
        {children}
      </div>
    </section>
  );
};

export default VideoBanner;

export const schema = createSchema({
  type: "video-banner",
  title: "Video banner",
  settings: [
    {
      group: "Video",
      inputs: [
        {
          type: "video",
          name: "videoURL",
          label: "Video URL",
          helpText: "Support YouTube, Vimeo, MP4, WebM, and HLS streams.",
        },
        {
          type: "text",
          name: "videoURL2",
          label: "Video URL 2",
          placeholder: "Enter your video URL",
          helpText:
            "Support YouTube, Vimeo, MP4, WebM, and HLS streams. If you enter the url link in the input text that will take priority",
        },
        {
          type: "heading",
          label: "Layout",
        },
        {
          type: "select",
          name: "height",
          label: "Section height",
          configs: {
            options: [
              { value: "small", label: "Small" },
              { value: "medium", label: "Medium" },
              { value: "large", label: "Large" },
              { value: "full", label: "Fullscreen" },
              { value: "custom", label: "Custom" },
            ],
          },
          defaultValue: "medium",
        },
        {
          type: "range",
          name: "heightOnDesktop",
          label: "Height on desktop",
          defaultValue: 844,
          configs: {
            min: 400,
            max: 1000,
            step: 1,
            unit: "px",
          },
          condition: "height.eq.custom",
        },
        {
          type: "range",
          name: "heightOnMobile",
          label: "Height on mobile",
          defaultValue: 300,
          configs: {
            min: 250,
            max: 500,
            step: 10,
            unit: "px",
          },
          condition: "height.eq.custom",
        },
        {
          type: "range",
          name: "gap",
          label: "Items spacing",
          configs: {
            min: 0,
            max: 40,
            step: 4,
            unit: "px",
          },
          defaultValue: 40,
        },
        {
          type: "position",
          name: "contentPosition",
          label: "Content position",
          defaultValue: "center center",
        },
        ...layoutInputs.filter((input) => input.name === "verticalPadding"),
      ],
    },
    {
      group: "Overlay",
      inputs: overlayInputs,
    },
  ],
  childTypes: ["subheading", "heading", "paragraph", "button"],
  presets: {
    enableOverlay: true,
    overlayColor: "#000000",
    overlayOpacity: 40,
    height: "large",
    gap: 20,
    contentPosition: "center center",
    verticalPadding: "medium",
    children: [
      {
        type: "subheading",
        content: "Video section",
        color: "#fff",
      },
      {
        type: "heading",
        content: "Video with text",
        as: "h2",
        color: "#fff",
      },
      {
        type: "paragraph",
        content: "Add a description for this video.",
        color: "#fff",
      },
    ],
  },
});
