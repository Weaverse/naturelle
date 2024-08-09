import {useThemeSettings} from '@weaverse/hydrogen';
import clsx from 'clsx';
import {CSSProperties, useState} from 'react';

export function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);
  const settings = useThemeSettings();
  let {
    content,
    textSize,
    textColor,
    borderColor,
    backgroundColor,
    announcementBarHeight,
    speed,
    gap,
    stickyAnnouncementBar,
    enableScrollingText,
  } = settings;
  let style: CSSProperties = {
    '--text-color': textColor,
    '--border-color': borderColor,
    '--background-color': backgroundColor,
    '--height-bar': `${announcementBarHeight}px`,
    '--speed': `${speed}s`,
    '--gap': `${gap}px`,
  } as CSSProperties;

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;
  return (
    <div
      id="announcement-bar"
      style={style}
      className={clsx(
        'h-[var(--height-bar)] bg-[var(--background-color)] py-[var(--vertical-padding)]',
        'border-y border-y-[var(--border-color)]',
        'flex w-full items-center justify-center overflow-hidden',
        stickyAnnouncementBar ? 'sticky top-0 z-40' : 'relative',
      )}
    >
      <button
        onClick={handleClose}
        className="absolute right-4 top-1/2 z-20 -translate-y-1/2 transform cursor-pointer border-none bg-transparent text-[var(--text-color)]"
      >
        ×
      </button>
      {enableScrollingText && (
        <>
          <div className="absolute right-0 z-10 h-full w-11 bg-[var(--background-color)]" />
          <div className="absolute left-0 z-10 h-full w-11 bg-[var(--background-color)]" />
        </>
      )}
      {!enableScrollingText && (
        <div className="flex items-center justify-center">{content}</div>
      )}
      {enableScrollingText && (
        <ul className="inline-flex list-none">
          {Array.from({length: 15}).map((_, i) => (
            <li
              key={i}
              className="animate-scrollContent whitespace-nowrap pr-[var(--gap)] font-body font-normal text-[var(--text-color)]"
              style={{
                animationDuration: `var(--speed)`,
                fontSize: `${textSize}px`,
              }}
            >
              {content}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
