import type { HydrogenComponentProps } from "@weaverse/hydrogen";
import { createSchema } from "@weaverse/hydrogen";
import type { CSSProperties, RefObject } from "react";
import { useEffect, useState } from "react";

const ONE_SEC = 1000;
const ONE_MIN = ONE_SEC * 60;
const ONE_HOUR = ONE_MIN * 60;
const ONE_DAY = ONE_HOUR * 24;

function calculateRemainingTime(endTime: number) {
  let now = Date.now();
  let diff = endTime - now;
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  return {
    days: Math.floor(diff / ONE_DAY),
    hours: Math.floor((diff % ONE_DAY) / ONE_HOUR),
    minutes: Math.floor((diff % ONE_HOUR) / ONE_MIN),
    seconds: Math.floor((diff % ONE_MIN) / ONE_SEC),
  };
}

type CountDownTimerData = {
  textColor: string;
  endTime: number;
};

let CountdownTimer = ({
  ref,
  ...props
}: CountDownTimerData &
  HydrogenComponentProps & { ref?: RefObject<HTMLDivElement | null> }) => {
  let { textColor, endTime, ...rest } = props;
  let [remainingTime, setRemainingTime] = useState(
    calculateRemainingTime(endTime),
  );

  useEffect(() => {
    let intervalId = setInterval(() => {
      let updatedTimeRemaining = calculateRemainingTime(endTime);
      setRemainingTime(updatedTimeRemaining);
      if (
        updatedTimeRemaining.days <= 0 &&
        updatedTimeRemaining.hours <= 0 &&
        updatedTimeRemaining.minutes <= 0 &&
        updatedTimeRemaining.seconds <= 0
      ) {
        clearInterval(intervalId);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [endTime]);

  let timerStyle: CSSProperties = {
    "--timer-color": textColor,
  } as CSSProperties;

  return (
    <div
      ref={ref}
      {...rest}
      data-motion="fade-up"
      className="countdown--timer flex text-[var(--timer-color)]"
      style={timerStyle}
    >
      <div className="space-y-1">
        <div className="flex items-center text-3xl leading-tight font-medium md:text-4xl lg:text-5xl">
          <div className="px-3 md:px-6 lg:px-12">
            {remainingTime?.days || 0}
          </div>
          <div className="h-6 border-r border-[var(--timer-color)] md:h-8 lg:h-[38px]" />
        </div>
        <div className="text-center text-xs uppercase md:text-sm">Days</div>
      </div>
      <div className="space-y-1">
        <div className="flex items-center text-3xl leading-tight font-medium md:text-4xl lg:text-5xl">
          <div className="px-3 md:px-6 lg:px-12">
            {remainingTime?.hours || 0}
          </div>
          <div className="h-6 border-r border-[var(--timer-color)] md:h-8 lg:h-[38px]" />
        </div>
        <div className="text-center text-xs uppercase md:text-sm">hours</div>
      </div>
      <div className="space-y-1">
        <div className="flex items-center text-3xl leading-tight font-medium md:text-4xl lg:text-5xl">
          <div className="px-3 md:px-6 lg:px-12">
            {remainingTime?.minutes || 0}
          </div>
          <div className="h-6 border-r border-[var(--timer-color)] md:h-8 lg:h-[38px]" />
        </div>
        <div className="text-center text-xs uppercase md:text-sm">minutes</div>
      </div>
      <div className="space-y-1">
        <div className="flex items-center text-3xl leading-tight font-medium md:text-4xl lg:text-5xl">
          <div className="px-3 md:px-6 lg:px-12">
            {remainingTime?.seconds || 0}
          </div>
        </div>
        <div className="text-center text-xs uppercase md:text-sm">seconds</div>
      </div>
    </div>
  );
};

export default CountdownTimer;

let tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

export const schema = createSchema({
  type: "countdown--timer",
  title: "Timer",
  settings: [
    {
      group: "Timer",
      inputs: [
        {
          type: "datepicker",
          label: "End time",
          name: "endTime",
          defaultValue: tomorrow.getTime(),
        },
        {
          type: "color",
          name: "textColor",
          label: "Text color",
        },
      ],
    },
  ],
});
