import type {
    HydrogenComponentProps,
    HydrogenComponentSchema,
    WeaverseImage,
} from '@weaverse/hydrogen';
import { forwardRef, CSSProperties } from 'react';
import clsx from 'clsx';
import { Image } from '@shopify/hydrogen';
import { IconImageBlank } from '~/components/Icon';


interface TestimonialsProps extends HydrogenComponentProps {
    backgroundImage?: WeaverseImage;
    heading?: string;
    reviewsPosition: string;
    textColor?: string;
    borderColor?: string;
    review?: number;
    gap?: number;
    desktopContentPadding?: number;
}

let reviewsPositionContent: { [reviewsPosition: string]: string } = {
    'left': 'justify-start',
    'right': 'justify-end',
};

const Testimonials = forwardRef<HTMLElement, TestimonialsProps>((props, ref) => {
    let {
        backgroundImage,
        heading,
        reviewsPosition,
        textColor,
        borderColor,
        review,
        gap,
        desktopContentPadding,
        children,
        ...rest
    } = props;

    let displayedChildren = children?.slice(0, review);

    let sectionStyle: CSSProperties = {
        '--text-color': textColor,
        '--border-color': borderColor,
        '--gap': `${gap}px`,
        '--desktop-content-padding': `${desktopContentPadding}px`,
    } as CSSProperties;
    return (
        <section
            ref={ref}
            {...rest}
            className={clsx(
                'flex w-full relative gap-3 items-center bg-secondary overflow-hidden',
                reviewsPositionContent[reviewsPosition]
            )}
            style={sectionStyle}
        >
            <div className="absolute inset-0">
                {backgroundImage ? (
                    <Image
                        data={backgroundImage}
                        className="w-full h-full object-cover"
                        sizes="auto"
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
            <div className={clsx(
                "flex h-fit z-10 bg-[rgba(238,239,234,0.10)] backdrop-blur-2xl",
                reviewsPosition === 'full' ? 'sm:w-full' : 'sm:w-1/2'
            )}>
                <div className='flex flex-col gap-10 px-6 py-12 sm:py-16 sm:px-[var(--desktop-content-padding)]'>
                    <h2 className='font-medium text-[var(--text-color)]'>{heading}</h2>
                    <div className='flex flex-col gap-[var(--gap)]'>
                        {displayedChildren}
                    </div>
                </div>
            </div>
        </section>
    );
});

export default Testimonials;

export let schema: HydrogenComponentSchema = {
    type: 'testimonials',
    title: 'Testimonials',
    toolbar: ['general-settings', ['duplicate', 'delete']],
    inspector: [
        {
            group: 'testimonials',
            inputs: [
                {
                    type: 'image',
                    name: 'backgroundImage',
                    label: 'Background image',
                },
                {
                    type: 'text',
                    name: 'heading',
                    label: 'Heading',
                    defaultValue: 'Testimonials',
                },
                {
                    type: 'toggle-group',
                    label: 'Reviews position',
                    name: 'reviewsPosition',
                    configs: {
                        options: [
                            { label: 'Left', value: 'left' },
                            { label: 'Right', value: 'right' },
                            { label: 'Full width', value: 'full' },
                        ],
                    },
                    defaultValue: 'right',
                },
                {
                    type: 'color',
                    name: 'textColor',
                    label: 'Text color',
                },
                {
                    type: 'color',
                    name: 'borderColor',
                    label: 'Border color',
                    defaultValue: '#3D490B',
                },
                {
                    type: 'range',
                    name: 'review',
                    label: 'Reviews',
                    defaultValue: 3,
                    configs: {
                        min: 1,
                        max: 4,
                        step: 1,
                    },
                },
                {
                    type: 'range',
                    label: 'Gap',
                    name: 'gap',
                    configs: {
                        min: 16,
                        max: 40,
                        step: 4,
                        unit: 'px',
                    },
                    defaultValue: 20,
                },
                {
                    type: 'range',
                    label: 'Desktop content padding',
                    name: 'desktopContentPadding',
                    configs: {
                        min: 30,
                        max: 100,
                        step: 5,
                        unit: 'px',
                    },
                    defaultValue: 30,
                },
            ],
        },
    ],
    childTypes: ['reviews'],
    presets: {
        children: [
            {
                type: 'reviews',
                name: 'Debbie',
                content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
            },
            {
                type: 'reviews',
                name: 'Emmanuelle',
                content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
            },
            {
                type: 'reviews',
                name: 'Veronica',
                content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
            },
        ],
    },
};