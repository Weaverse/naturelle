import type {
    HydrogenComponentProps,
    HydrogenComponentSchema,
    WeaverseImage,
} from '@weaverse/hydrogen';
import React, { forwardRef, CSSProperties, useRef, useEffect } from 'react';
import { IconArrowSlideRight, IconArrowSlideLeft, IconImageBlank } from '~/components/Icon';
import { Image } from '@shopify/hydrogen';
import clsx from 'clsx';

interface BeforeAndAfterProps extends HydrogenComponentProps {
    beforeImage: WeaverseImage;
    afterImage: WeaverseImage;
    separatorColor: string;
    showArrows: boolean;
    arrowColor: string;
    separatorWidth: number;
    sliderHeightDesktop: number;
    sliderHeightMobile: number;
}

const BeforeAndAfter = forwardRef<HTMLDivElement, BeforeAndAfterProps>((props, ref) => {
    let {
        beforeImage,
        afterImage,
        separatorColor,
        showArrows,
        arrowColor,
        separatorWidth,
        sliderHeightDesktop,
        sliderHeightMobile,
        ...rest
    } = props;

    const containerRef = useRef<HTMLDivElement>(null);
    const firstHalfRef = useRef<HTMLDivElement>(null);
    const secondHalfRef = useRef<HTMLDivElement>(null);
    const resizerRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = React.useCallback((e: React.MouseEvent) => {
        const startPos = {
            x: e.clientX,
            y: e.clientY,
        };
        const currentLeftWidth = parseFloat(window.getComputedStyle(resizerRef.current as Element).left);

        const handleMouseMove = (e: MouseEvent) => {
            const dx = e.clientX - startPos.x;
            const dy = e.clientY - startPos.y;
            updateWidth(currentLeftWidth, dx);
            updateCursor();
        };

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            resetCursor();
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    const handleTouchStart = React.useCallback((e: React.TouchEvent) => {
        const touch = e.touches[0];
        const startPos = {
            x: touch.clientX,
            y: touch.clientY,
        };
        const currentLeftWidth = parseFloat(window.getComputedStyle(resizerRef.current as Element).left);

        const handleTouchMove = (e: TouchEvent) => {
            const touch = e.touches[0];
            const dx = touch.clientX - startPos.x;
            const dy = touch.clientY - startPos.y;
            updateWidth(currentLeftWidth, dx);
            updateCursor();
        };

        const handleTouchEnd = () => {
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
            resetCursor();
        };

        document.addEventListener('touchmove', handleTouchMove);
        document.addEventListener('touchend', handleTouchEnd);

        return () => {
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
        };
    }, []);

    const updateWidth = (currentLeftWidth: number, dx: number) => {
        const container = containerRef.current;
        const firstHalfEle = firstHalfRef.current;
        const resizerEle = resizerRef.current;

        if (!container || !firstHalfEle || !resizerEle) {
            return;
        }

        const containerWidth = container.getBoundingClientRect().width;
        const delta = currentLeftWidth + dx;
        const newFirstHalfWidth = delta * 100 / containerWidth;
        const normalizedWidth = Math.min(Math.max(0, newFirstHalfWidth), 100);

        firstHalfEle.style.clipPath = `inset(0 0 0 ${normalizedWidth}%)`;
        resizerEle.style.left = `${normalizedWidth}%`;
    };

    const updateCursor = () => {
        const container = containerRef.current;
        const firstHalfEle = firstHalfRef.current;
        const resizerEle = resizerRef.current;
        const secondHalfEle = secondHalfRef.current;

        if (!container || !firstHalfEle || !resizerEle || !secondHalfEle) {
            return;
        }

        resizerEle.style.cursor = 'ew-resize';
        document.body.style.cursor = 'ew-resize';
        firstHalfEle.style.userSelect = 'none';
        firstHalfEle.style.pointerEvents = 'none';
        secondHalfEle.style.userSelect = 'none';
        secondHalfEle.style.pointerEvents = 'none';
    };

    const resetCursor = () => {
        const container = containerRef.current;
        const firstHalfEle = firstHalfRef.current;
        const resizerEle = resizerRef.current;
        const secondHalfEle = secondHalfRef.current;

        if (!container || !firstHalfEle || !resizerEle || !secondHalfEle) {
            return;
        }

        resizerEle.style.removeProperty('cursor');
        document.body.style.removeProperty('cursor');
        firstHalfEle.style.removeProperty('user-select');
        firstHalfEle.style.removeProperty('pointer-events');
        secondHalfEle.style.removeProperty('user-select');
        secondHalfEle.style.removeProperty('pointer-events');
    };

    useEffect(() => {
        const resizerEle = resizerRef.current;
        const containerEle = containerRef.current;
        if (!resizerEle || !containerEle) return;
        const defaultWidth = 50;
        resizerEle.style.left = `${defaultWidth}%`;
        const containerWidth = containerRef.current.getBoundingClientRect().width;
        const resizerWidth = resizerEle.getBoundingClientRect().width;
        const centerPosition = (containerWidth - resizerWidth) / 2;
        updateWidth(defaultWidth, centerPosition);
    }, [afterImage]);

    let sliderStyle: CSSProperties = {
        '--separator-color': separatorColor,
        '--arrow-color': arrowColor,
        '--separator-width': `${separatorWidth}px`,
        '--slider-height-desktop': `${sliderHeightDesktop}px`,
        '--slider-height-mobile': `${sliderHeightMobile}px`,
    } as CSSProperties;

    return (
        <div ref={containerRef} {...rest} className="w-full relative h-[var(--slider-height-mobile)] sm:h-[var(--slider-height-desktop)] select-none" style={sliderStyle}>
            <div className="left-0 absolute top-0 h-full w-full" ref={firstHalfRef}>
                {afterImage ? (<Image
                    data={afterImage}
                    sizes='auto'
                    className='h-full w-full box-border object-cover object-center' />) :
                    (<div className="flex justify-center items-center bg-background-subtle-1 w-full h-full">
                        <IconImageBlank
                            className="w-96 h-96 opacity-80"
                            viewBox="0 0 526 526"
                        />
                    </div>)}
            </div>
            <div ref={resizerRef}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
                className={clsx('select-none touch-none left-1/2 absolute flex items-center top-0 h-full transform z-10',
                    {
                        '-translate-x-full': !showArrows,
                        '-translate-x-5': showArrows,
                    })}>
                {showArrows && <IconArrowSlideLeft viewBox='0 0 32 32' fill='var(--arrow-color)' stroke='var(--arrow-color)' />}
                <div className="h-full bg-[var(--separator-color)] cursor-ew-resize w-[var(--separator-width)]" />
                {showArrows && <IconArrowSlideRight viewBox='0 0 32 32' fill='var(--arrow-color)' stroke='var(--arrow-color)' />}
            </div>
            <div ref={secondHalfRef} className='h-full w-full'>
                {beforeImage ? (<Image
                    data={beforeImage}
                    sizes='auto'
                    className='h-full w-full box-border object-cover object-center' />) : (
                    <div className="flex justify-center items-center bg-background-subtle-1 w-full h-full">
                        <IconImageBlank
                            className="w-96 h-96 opacity-80"
                            viewBox="0 0 526 526"
                        />
                    </div>)}
            </div>
        </div>
    )
});

export default BeforeAndAfter;

export let schema: HydrogenComponentSchema = {
    type: 'before-after-slider',
    title: 'Slider',
    limit: 1,
    toolbar: ['general-settings', ['duplicate', 'delete']],
    inspector: [
        {
            group: 'Slider',
            inputs: [
                {
                    type: 'image',
                    label: 'Image (before)',
                    name: 'beforeImage',
                },
                {
                    type: 'image',
                    label: 'Image (after)',
                    name: 'afterImage',
                },
                {
                    type: 'color',
                    label: 'Separator color',
                    name: 'separatorColor',
                    defaultValue: '#8B926D',
                },
                {
                    type: 'switch',
                    name: 'showArrows',
                    label: 'Show arrows',
                    defaultValue: true,
                },
                {
                    type: 'color',
                    label: 'Arrows color',
                    name: 'arrowColor',
                    defaultValue: '#8B926D',
                },
                {
                    type: 'range',
                    name: 'separatorWidth',
                    label: 'Separator width',
                    defaultValue: 6,
                    configs: {
                        min: 2,
                        max: 10,
                        step: 1,
                        unit: 'px',
                    },
                },
                {
                    type: 'range',
                    name: 'sliderHeightDesktop',
                    label: 'Slider height desktop',
                    defaultValue: 600,
                    configs: {
                        min: 300,
                        max: 1000,
                        step: 10,
                        unit: 'px',
                    },
                },
                {
                    type: 'range',
                    name: 'sliderHeightMobile',
                    label: 'Slider height mobile',
                    defaultValue: 400,
                    configs: {
                        min: 300,
                        max: 1000,
                        step: 10,
                        unit: 'px',
                    },
                },
            ],
        },
    ],
}