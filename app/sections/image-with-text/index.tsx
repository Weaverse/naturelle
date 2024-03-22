import type {
    HydrogenComponentProps,
    HydrogenComponentSchema,
    WeaverseImage,
} from '@weaverse/hydrogen';
import { forwardRef, CSSProperties } from 'react';
import { Image } from '@shopify/hydrogen';
import { IconImageBlank } from '~/components/Icon';
import clsx from 'clsx';

type AlignImage = 'left' | 'right';
interface ImageWithTextProps extends HydrogenComponentProps {
    backgroundImage?: WeaverseImage;
    sectionHeight: number;
    backgroundColor: string;
    imageAlignment?: AlignImage;
}

let AlignImageClasses: Record<AlignImage, string> = {
    left: 'sm:flex-row-reverse',
    right: 'sm:flex-row',
};

const ImageWithText = forwardRef<HTMLElement, ImageWithTextProps>((props, ref) => {
    let { backgroundImage, imageAlignment, sectionHeight, backgroundColor, children, ...rest } = props;
    let styleSection: CSSProperties = {
        '--section-height': `${sectionHeight}px`,
        '--background-color': backgroundColor,
    } as CSSProperties;

    return (
        <section ref={ref} {...rest} style={styleSection} className='group sm:h-[var(--section-height)] h-auto'>
            <div className='h-full w-full sm:px-0'>
                <div className={clsx('flex flex-col-reverse justify-center items-center h-full w-full', AlignImageClasses[imageAlignment!])}>
                    <div
                        className="w-full h-1/2 sm:h-full flex flex-1 items-center justify-center sm:w-1/2 aspect-square overflow-hidden"
                    >
                        {backgroundImage ? (
                            <Image
                                data={backgroundImage}
                                sizes="auto"
                                className="!w-full !h-full object-cover group-hover:ease-in-out group-hover:scale-125 transition duration-1000"
                            />
                        ) : (
                            <div className="flex justify-center items-center bg-background-subtle-1 w-full h-full">
                                <IconImageBlank
                                    className="w-96 h-96 opacity-80"
                                    viewBox="0 0 526 526"
                                />
                            </div>
                        )}
                    </div>
                    <div className='flex flex-col px-6 py-12 gap-4 justify-center bg-[var(--background-color)] aspect-square w-full h-1/2 sm:w-1/2 sm:h-full sm:px-14 sm:py-20'>
                        {children}
                    </div>
                </div>
            </div>
        </section>
    );
});

export default ImageWithText;

export let schema: HydrogenComponentSchema = {
    type: 'image-with-text',
    title: 'Image with text',
    toolbar: ['general-settings', ['duplicate', 'delete']],
    inspector: [
        {
            group: 'Image',
            inputs: [
                {
                    type: 'image',
                    name: 'backgroundImage',
                    label: 'Background image',
                },
                {
                    type: 'toggle-group',
                    label: 'Image alignment',
                    name: 'imageAlignment',
                    configs: {
                        options: [
                            { label: 'Right', value: 'right', icon: 'AlignRight' },
                            { label: 'Left', value: 'left', icon: 'AlignLeft' },
                        ],
                    },
                    defaultValue: 'left',
                },
                {
                    type: 'color',
                    name: 'backgroundColor',
                    label: 'Background color',
                    defaultValue: '#f8f8f0',
                },
                {
                    type: 'range',
                    name: 'sectionHeight',
                    label: 'Section height',
                    defaultValue: 450,
                    configs: {
                        min: 400,
                        max: 700,
                        step: 10,
                        unit: 'px',
                    },
                },
            ],
        },
    ],
    childTypes: ['subheading', 'heading', 'description', 'button'],
    presets: {
        children: [
            {
                type: 'subheading',
                content: 'Subheading',
            },
            {
                type: 'heading',
                content: 'Heading',
            },
            {
                type: 'description',
                content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
            },
            {
                type: 'button',
                content: 'Shop now',
            }
        ],
    },
};