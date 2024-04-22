import type {
    HydrogenComponentProps,
    HydrogenComponentSchema,
} from '@weaverse/hydrogen';
import { forwardRef, CSSProperties } from 'react';
import clsx from 'clsx';
import ReactPlayer from 'react-player';

interface VideoBannerProps extends HydrogenComponentProps {
    videoLink: string;
    enableOverlay: boolean;
    overlayColor: string;
    overlayOpacity: number;
    contentAlignment: string;
    sectionHeightDesktop: number;
    sectionHeightMobile: number;
    enableAutoPlay: boolean;
    enableLoop: boolean;
    enableMuted: boolean;
}

const VideoBanner = forwardRef<HTMLElement, VideoBannerProps>((props, ref) => {
    let {
        videoLink,
        enableOverlay,
        overlayColor,
        overlayOpacity,
        contentAlignment,
        sectionHeightDesktop,
        sectionHeightMobile,
        enableAutoPlay,
        enableLoop,
        enableMuted,
        children,
        ...rest
    } = props;
    let sectionStyle: CSSProperties = {
        justifyContent: `${contentAlignment}`,
        '--section-height-desktop': `${sectionHeightDesktop}px`,
        '--section-height-mobile': `${sectionHeightMobile}px`,
        '--overlay-opacity': `${overlayOpacity}%`,
        '--overlay-color': `${overlayColor}`,
        '--max-width-content': '600px',
    } as CSSProperties;

    return (
        <section
            ref={ref}
            {...rest}
            className={clsx(
                'flex relative gap-3 items-center bg-secondary h-[var(--section-height-mobile)] sm:h-[var(--section-height-desktop)] overflow-hidden',
            )}
            style={sectionStyle}
        >
            <ReactPlayer
                url={videoLink}
                playing={enableAutoPlay}
                volume={1}
                muted={enableMuted}
                loop={enableLoop}
                controls={false}
                className="absolute sm:!w-full sm:!h-auto inset-0 aspect-video max-sm:scale-[2.5]"
            />
            <div className={clsx(
                "absolute inset-0",
                enableOverlay && 'bg-[var(--overlay-color)] opacity-[var(--overlay-opacity)] -z-0'
            )}></div>
            <div className="z-0 sm:w-[var(--max-width-content)] w-5/6 h-fit flex flex-col text-center gap-5">
                {children}
            </div>
        </section>
    );
});

export default VideoBanner;

export let schema: HydrogenComponentSchema = {
    type: 'video-banner',
    title: 'Video banner',
    toolbar: ['general-settings', ['duplicate', 'delete']],
    inspector: [
        {
            group: 'video',
            inputs: [
                {
                    type: 'text',
                    name: 'videoLink',
                    label: 'Video link',
                    defaultValue: 'https://cdn.shopify.com/videos/c/o/v/da736f2426744842b544038265c59a8d.mp4',
                    placeholder: 'https://',
                },
                {
                    type: 'switch',
                    name: 'enableOverlay',
                    label: 'Enable overlay',
                    defaultValue: false,
                },
                {
                    type: 'color',
                    name: 'overlayColor',
                    label: 'Overlay color',
                    defaultValue: '#333333',
                    condition: `enableOverlay.eq.true`,
                },
                {
                    type: 'range',
                    name: 'overlayOpacity',
                    label: 'Overlay opacity',
                    defaultValue: 50,
                    configs: {
                        min: 10,
                        max: 100,
                        step: 10,
                        unit: '%',
                    },
                    condition: `enableOverlay.eq.true`,
                },
                {
                    type: 'toggle-group',
                    label: 'Content alignment',
                    name: 'contentAlignment',
                    configs: {
                        options: [
                            { label: 'Left', value: 'flex-start' },
                            { label: 'Center', value: 'center' },
                            { label: 'Right', value: 'flex-end' },
                        ],
                    },
                    defaultValue: 'center',
                },
                {
                    type: 'range',
                    name: 'sectionHeightDesktop',
                    label: 'Section height desktop',
                    defaultValue: 450,
                    configs: {
                        min: 400,
                        max: 700,
                        step: 10,
                        unit: 'px',
                    },
                },
                {
                    type: 'range',
                    name: 'sectionHeightMobile',
                    label: 'Section height mobile',
                    defaultValue: 350,
                    configs: {
                        min: 300,
                        max: 600,
                        step: 10,
                        unit: 'px',
                    },
                },
                {
                    type: 'switch',
                    name: 'enableAutoPlay',
                    label: 'Auto play',
                    defaultValue: true,
                },
                {
                    type: 'switch',
                    name: 'enableLoop',
                    label: 'Loop',
                    defaultValue: true,
                },
                {
                    type: 'switch',
                    name: 'enableMuted',
                    label: 'Muted',
                    defaultValue: true,
                },
            ],
        },
    ],
    childTypes: ['heading', 'subheading', 'description', 'button'],
    presets: {
        children: [
            {
                type: 'subheading',
            },
            {
                type: 'heading',
            },
            {
                type: 'description',
            },
            {
                type: 'button',
                content: 'Button section',
            },
        ],
    },
};