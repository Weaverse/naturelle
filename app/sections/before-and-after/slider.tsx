import { Image } from "@shopify/hydrogen";
import {
  createSchema,
  type HydrogenComponentProps,
  IMAGES_PLACEHOLDERS,
  type WeaverseImage,
} from "@weaverse/hydrogen";
import React, { type CSSProperties, useRef } from "react";
import { IconArrowSlideLeft, IconArrowSlideRight } from "~/components/icon";
import { useWeaverseStudioCheck } from "~/hooks/use-weaverse-studio-check";

interface BeforeAndAfterProps extends HydrogenComponentProps {
  beforeImage?: WeaverseImage | string;
  afterImage?: WeaverseImage | string;
  separatorColor: string;
  showArrows: boolean;
  arrowColor: string;
  showLabels?: boolean;
  beforeLabel?: string;
  afterLabel?: string;
  separatorWidth: number;
  sliderHeightDesktop: number;
  sliderHeightMobile: number;
}

function getImageData(
  image: WeaverseImage | string | undefined,
  label: string,
  isDesignMode: boolean,
) {
  const configuredImage =
    typeof image === "string" ? { url: image, altText: label } : image;
  if (
    configuredImage?.url?.trim() &&
    configuredImage.url.trim() !== IMAGES_PLACEHOLDERS.image
  ) {
    return configuredImage;
  }
  return isDesignMode
    ? {
        url: IMAGES_PLACEHOLDERS.image,
        altText: `${label} placeholder`,
      }
    : undefined;
}

const BeforeAndAfter = ({
  ref,
  ...props
}: BeforeAndAfterProps & { ref?: React.RefObject<HTMLDivElement | null> }) => {
  let {
    beforeImage,
    afterImage,
    separatorColor,
    showArrows,
    arrowColor,
    showLabels = true,
    beforeLabel = "Before",
    afterLabel = "After",
    separatorWidth,
    sliderHeightDesktop = 614,
    sliderHeightMobile = 480,
    ...rest
  } = props;
  const isDesignMode = useWeaverseStudioCheck();
  const beforeImageData = getImageData(
    beforeImage,
    beforeLabel || "Before",
    isDesignMode,
  );
  const afterImageData = getImageData(
    afterImage,
    afterLabel || "After",
    isDesignMode,
  );
  const staticImageData = beforeImageData ?? afterImageData;
  const canCompare = Boolean(beforeImageData && afterImageData);

  const containerRef = useRef<HTMLDivElement>(null);
  const [sliderPosition, setSliderPosition] = React.useState(50);
  const dragState = useRef<{
    pointerId: number;
    startX: number;
    startPosition: number;
  } | null>(null);

  const clampPosition = React.useCallback(
    (position: number) => Math.min(Math.max(position, 0), 100),
    [],
  );

  const handlePointerDown = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      event.preventDefault();
      dragState.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startPosition: sliderPosition,
      };
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    [sliderPosition],
  );

  const handlePointerMove = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const container = containerRef.current;
      const drag = dragState.current;
      if (!container || !drag || drag.pointerId !== event.pointerId) {
        return;
      }
      const containerWidth = container.getBoundingClientRect().width;
      if (containerWidth <= 0) {
        return;
      }
      const delta = ((event.clientX - drag.startX) * 100) / containerWidth;
      setSliderPosition(clampPosition(drag.startPosition + delta));
    },
    [clampPosition],
  );

  const handlePointerEnd = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (dragState.current?.pointerId !== event.pointerId) {
        return;
      }
      dragState.current = null;
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    },
    [],
  );

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      const step = event.shiftKey ? 10 : 1;
      let nextPosition: number | undefined;
      if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
        nextPosition = sliderPosition - step;
      } else if (event.key === "ArrowRight" || event.key === "ArrowUp") {
        nextPosition = sliderPosition + step;
      } else if (event.key === "Home") {
        nextPosition = 0;
      } else if (event.key === "End") {
        nextPosition = 100;
      }
      if (nextPosition !== undefined) {
        event.preventDefault();
        setSliderPosition(clampPosition(nextPosition));
      }
    },
    [clampPosition, sliderPosition],
  );

  let sliderStyle: CSSProperties = {
    "--separator-color": separatorColor,
    "--arrow-color": arrowColor,
    "--separator-width": `${separatorWidth}px`,
    "--slider-height-desktop": `${sliderHeightDesktop}px`,
    "--slider-height-mobile": `${sliderHeightMobile}px`,
  } as CSSProperties;

  if (!staticImageData) {
    return null;
  }

  return (
    <div
      data-motion="slide-in"
      ref={containerRef}
      {...rest}
      className="before-after-slider relative h-[var(--slider-height-mobile)] w-full select-none overflow-hidden desktop:h-[var(--slider-height-desktop)]"
      style={sliderStyle}
    >
      {canCompare && (
        <>
          <div
            className="absolute top-0 left-0 h-full w-full"
            style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
          >
            <Image
              data={afterImageData}
              sizes="auto"
              className="h-full w-full object-cover object-center"
            />
          </div>
          <div
            role="slider"
            tabIndex={0}
            aria-label={`${beforeLabel || "Before"} / ${afterLabel || "After"}`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(sliderPosition)}
            aria-orientation="horizontal"
            onKeyDown={handleKeyDown}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerEnd}
            onPointerCancel={handlePointerEnd}
            className="absolute top-0 z-10 flex h-full -translate-x-1/2 touch-none select-none items-center focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="absolute inset-y-0 left-1/2 w-[var(--separator-width)] -translate-x-1/2 cursor-ew-resize bg-[var(--separator-color)]" />
            {showArrows && (
              <div className="relative z-10 flex items-center rounded-2xl bg-background-basic">
                <IconArrowSlideLeft
                  className="size-8"
                  viewBox="0 0 32 32"
                  fill="var(--arrow-color)"
                  stroke="var(--arrow-color)"
                />
                <IconArrowSlideRight
                  className="size-8"
                  viewBox="0 0 32 32"
                  fill="var(--arrow-color)"
                  stroke="var(--arrow-color)"
                />
              </div>
            )}
          </div>
        </>
      )}
      <div className="h-full w-full">
        <Image
          data={staticImageData}
          sizes="auto"
          className="h-full w-full object-cover object-center"
        />
      </div>
      {showLabels && beforeImageData && beforeLabel?.trim() && (
        <span className="absolute bottom-5.5 left-4.5 z-20 rounded-full bg-background-basic px-4 py-2.5 text-center font-heading text-[26px] leading-[110%] font-normal text-text">
          {beforeLabel}
        </span>
      )}
      {showLabels && afterImageData && afterLabel?.trim() && (
        <span className="absolute right-4.5 bottom-5.5 z-20 rounded-full bg-background-basic px-4 py-2.5 text-center font-heading text-[26px] leading-[110%] font-normal text-text">
          {afterLabel}
        </span>
      )}
    </div>
  );
};

export default BeforeAndAfter;

export const schema = createSchema({
  type: "before-after-slider",
  title: "Slider",
  limit: 1,
  settings: [
    {
      group: "Slider",
      inputs: [
        {
          type: "image",
          label: "Image (before)",
          name: "beforeImage",
        },
        {
          type: "image",
          label: "Image (after)",
          name: "afterImage",
        },
        {
          type: "color",
          label: "Separator color",
          name: "separatorColor",
          defaultValue: "#FFFFFF",
        },
        {
          type: "switch",
          name: "showArrows",
          label: "Show arrows",
          defaultValue: true,
        },
        {
          type: "color",
          label: "Arrows color",
          name: "arrowColor",
          defaultValue: "#DCD8D6",
        },
        {
          type: "switch",
          name: "showLabels",
          label: "Show labels",
          defaultValue: true,
        },
        {
          type: "text",
          name: "beforeLabel",
          label: "Before label",
          defaultValue: "Before",
          condition: (data: BeforeAndAfterProps) => data.showLabels !== false,
        },
        {
          type: "text",
          name: "afterLabel",
          label: "After label",
          defaultValue: "After",
          condition: (data: BeforeAndAfterProps) => data.showLabels !== false,
        },
        {
          type: "range",
          name: "separatorWidth",
          label: "Separator width",
          defaultValue: 6,
          configs: {
            min: 2,
            max: 10,
            step: 1,
            unit: "px",
          },
        },
        {
          type: "range",
          name: "sliderHeightDesktop",
          label: "Slider height desktop",
          defaultValue: 614,
          configs: {
            min: 300,
            max: 1000,
            step: 10,
            unit: "px",
          },
        },
        {
          type: "range",
          name: "sliderHeightMobile",
          label: "Slider height mobile",
          defaultValue: 480,
          configs: {
            min: 300,
            max: 1000,
            step: 10,
            unit: "px",
          },
        },
      ],
    },
  ],
  presets: {
    separatorColor: "#FFFFFF",
    showArrows: true,
    arrowColor: "#DCD8D6",
    showLabels: true,
    beforeLabel: "Before",
    afterLabel: "After",
    separatorWidth: 6,
    sliderHeightDesktop: 614,
    sliderHeightMobile: 480,
  },
});
