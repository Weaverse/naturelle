import {
  isBrowser,
  type HydrogenComponentProps,
  type HydrogenComponentSchema,
} from '@weaverse/hydrogen';
import type {VariantProps} from 'class-variance-authority';
import {cva} from 'class-variance-authority';
import clsx from 'clsx';
import type {CSSProperties} from 'react';
import {
  forwardRef,
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useState,
} from 'react';
import {useInView} from 'react-intersection-observer';
import {Overlay, overlayInputs, OverlayProps} from '../atoms/Overlay';
import { useMotion } from '~/hooks/use-animation';

const SECTION_HEIGHTS = {
  small: {
    desktop: '40vh',
    mobile: '50vh',
  },
  medium: {
    desktop: '50vh',
    mobile: '60vh',
  },
  large: {
    desktop: '70vh',
    mobile: '80vh',
  },
  full: {
    desktop: 'calc(var(--screen-height, 100vh)',
    mobile: 'calc(var(--screen-height, 100vh)',
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
  extends Omit<VariantProps<typeof variants>, 'padding'>,
    HydrogenComponentProps,
    OverlayProps {
  videoURL: WeaverseVideo;
  videoURL2: string;
  height: 'small' | 'medium' | 'large' | 'full' | 'custom';
  heightOnDesktop: number;
  heightOnMobile: number;
}

let variants = cva(
  'absolute inset-0 max-w-[100vw] mx-auto px-3 flex flex-col justify-center items-center z-10',
  {
    variants: {
      gap: {
        0: '',
        4: 'space-y-1',
        8: 'space-y-2',
        12: 'space-y-3',
        16: 'space-y-4',
        20: 'space-y-5',
        24: 'space-y-3 lg:space-y-6',
        28: 'space-y-3.5 lg:space-y-7',
        32: 'space-y-4 lg:space-y-8',
        36: 'space-y-4 lg:space-y-9',
        40: 'space-y-5 lg:space-y-10',
        44: 'space-y-5 lg:space-y-11',
        48: 'space-y-6 lg:space-y-12',
        52: 'space-y-6 lg:space-y-[52px]',
        56: 'space-y-7 lg:space-y-14',
        60: 'space-y-7 lg:space-y-[60px]',
      },
    },
    defaultVariants: {
      gap: 20,
    },
  },
);

let ReactPlayer = lazy(() => import('react-player/lazy'));

function getPlayerSize(id: string) {
  if (isBrowser) {
    let section = document.querySelector(`[data-wv-id="${id}"]`);
    if (section) {
      let rect = section.getBoundingClientRect();
      let aspectRatio = rect.width / rect.height;
      if (aspectRatio < 16 / 9) {
        return {width: 'auto', height: '100vh'};
      }
    }
  }
  return {width: '100%', height: 'auto'};
}

let VideoBanner = forwardRef<HTMLElement, VideoBannerProps>((props, ref) => {
  let {
    videoURL,
    videoURL2,
    gap,
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

  let id = rest['data-wv-id'];
  let [size, setSize] = useState(() => getPlayerSize(id));

  let desktopHeight =
    SECTION_HEIGHTS[height]?.desktop || `${heightOnDesktop}px`;
  let mobileHeight = SECTION_HEIGHTS[height]?.mobile || `${heightOnMobile}px`;
  let sectionStyle: CSSProperties = {
    '--desktop-height': desktopHeight,
    '--mobile-height': mobileHeight,
  } as CSSProperties;

  let {ref: inViewRef, inView} = useInView({
    triggerOnce: true,
  });

  // Use `useCallback` so we don't recreate the function on each render
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  let setRefs = useCallback(
    (node: HTMLElement) => {
      // Ref's from useRef needs to have the node assigned to `current`
      ref && Object.assign(ref, {current: node});
      // Callback refs, like the one from `useInView`, is a function that takes the node as an argument
      inViewRef(node);
    },
    [inViewRef],
  );

  function handleResize() {
    setSize(getPlayerSize(id));
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [inView, height, heightOnDesktop, heightOnMobile]);

  const [scope] = useMotion(ref);

  return (
    <section
      ref={setRefs}
      {...rest}
      className="h-full w-full overflow-hidden"
      style={sectionStyle}
    >
      <div
        className={clsx(
          'relative flex items-center justify-center overflow-hidden',
          'h-[var(--mobile-height)] sm:h-[var(--desktop-height)]',
          'w-[max(var(--mobile-height)/9*16,100vw)] sm:w-[max(var(--desktop-height)/9*16,100vw)]',
          'translate-x-[min(0px,calc((var(--mobile-height)/9*16-100vw)/-2))] sm:translate-x-[min(0px,calc((var(--desktop-height)/9*16-100vw)/-2))]',
        )}
      >
        {inView && (
          <Suspense fallback={<div className='w-full h-full bg-background'></div>}>
            <ReactPlayer
              url={videoURL2 || videoURL.url}
              playing
              muted
              loop={true}
              width={size.width}
              height={size.height}
              controls={false}
              className="aspect-video"
            />
          </Suspense>
        )}
        <Overlay
          enableOverlay={enableOverlay}
          overlayColor={overlayColor}
          overlayColorHover={overlayColorHover}
          overlayOpacity={overlayOpacity}
          className="z-0"
        />
        <div ref={scope} className={clsx(variants({gap}))}>{children}</div>
      </div>
    </section>
  );
});

export default VideoBanner;

export let schema: HydrogenComponentSchema = {
  type: 'video-banner',
  title: 'Video banner',
  inspector: [
    {
      group: 'Video',
      inputs: [
        {
          type: 'video',
          name: 'videoURL',
          label: 'Video URL',
          helpText: 'Support YouTube, Vimeo, MP4, WebM, and HLS streams.',
        },
        {
          type: 'text',
          name: 'videoURL2',
          label: 'Video URL 2',
          placeholder: 'https://www.youtube.com/watch?v=Su-x4Mo5xmU',
          helpText:
            'Support YouTube, Vimeo, MP4, WebM, and HLS streams. If you enter the url link in the input text that will take priority',
        },
        {
          type: 'heading',
          label: 'Layout',
        },
        {
          type: 'select',
          name: 'height',
          label: 'Section height',
          configs: {
            options: [
              {value: 'small', label: 'Small'},
              {value: 'medium', label: 'Medium'},
              {value: 'large', label: 'Large'},
              {value: 'full', label: 'Fullscreen'},
              {value: 'custom', label: 'Custom'},
            ],
          },
          defaultValue: 'medium',
        },
        {
          type: 'range',
          name: 'heightOnDesktop',
          label: 'Height on desktop',
          defaultValue: 650,
          configs: {
            min: 400,
            max: 800,
            step: 10,
            unit: 'px',
          },
          condition: 'height.eq.custom',
        },
        {
          type: 'range',
          name: 'heightOnMobile',
          label: 'Height on mobile',
          defaultValue: 300,
          configs: {
            min: 250,
            max: 500,
            step: 10,
            unit: 'px',
          },
          condition: 'height.eq.custom',
        },
        {
          type: 'range',
          name: 'gap',
          label: 'Items spacing',
          configs: {
            min: 0,
            max: 40,
            step: 4,
            unit: 'px',
          },
          defaultValue: 20,
        },
      ],
    },
    {
      group: 'Overlay',
      inputs: overlayInputs,
    },
  ],
  childTypes: ['subheading', 'heading', 'description', 'button'],
  presets: {
    enableOverlay: true,
    overlayColor: '#000000',
    overlayOpacity: 40,
    videoURL: {
      id: 'gbLmku5QACM',
      url: 'https://cdn.shopify.com/videos/c/o/v/f996c8ca1d0144e1b53b813f82d187b0.mp4',
      previewSrc:
        'https://img.youtube.com/vi/gbLmku5QACM/maxresdefault.jpg',
      width: 1920,
      height: 1080,
      altText: 'Naturelle demo',
    },
    height: 'large',
    gap: 20,
    children: [
      {
        type: 'subheading',
        content: 'Seamless hero videos',
        color: '#fff',
      },
      {
        type: 'heading',
        content: 'Bring your brand to life.',
        as: 'h2',
        color: '#fff',
      },
      {
        type: 'description',
        content:
          'Pair large video with a compelling message to captivate your audience.',
        color: '#fff',
      },
    ],
  },
};
