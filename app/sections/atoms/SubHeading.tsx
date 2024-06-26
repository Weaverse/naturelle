import {
    type HydrogenComponentProps,
    type HydrogenComponentSchema,
} from '@weaverse/hydrogen';
import { clsx } from 'clsx';
import { forwardRef, CSSProperties } from 'react';

type Size = 'base' | 'large';
type Weight = 'normal' | 'medium';
type Alignment = 'left' | 'center' | 'right';
type SubHeadingProps = HydrogenComponentProps & {
    content: string;
    textColor?: string;
    as?: 'h4' | 'h5' | 'h6' | 'div' | 'p';
    size?: Size;
    weight?: Weight;
    alignment: Alignment;
    className?: string;
};

let sizes: Record<Size, string> = {
    base: 'text-base',
    large: 'text-lg',
};

let weightClasses: Record<Weight, string> = {
    normal: 'font-normal',
    medium: 'font-medium',
};

let alignmentClasses: Record<Alignment, string> = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
};

let SubHeading = forwardRef<
    HTMLHeadingElement | HTMLParagraphElement | HTMLDivElement,
    SubHeadingProps
>((props, ref) => {
    let {
        as: Tag = 'p',
        content,
        textColor,
        size,
        weight,
        alignment,
        className,
        ...rest
    } = props;
    let style = {
        color: textColor,
    } as CSSProperties;
    return (
        <Tag
            ref={ref}
            {...rest}
            style={style}
            className={clsx(
                sizes[size!],
                weightClasses[weight!],
                alignmentClasses[alignment!],
                className,
            )}
        >
            {content}
        </Tag>
    );
});

SubHeading.defaultProps = {
    as: 'p',
    size: 'base',
    weight: 'normal',
    // alignment: 'center',
    content: 'Section subheading',
};

export default SubHeading;

export let schema: HydrogenComponentSchema = {
    type: 'subheading',
    title: 'Subheading',
    inspector: [
        {
            group: 'Subheading',
            inputs: [
                {
                    type: 'color',
                    label: 'Text color',
                    name: 'textColor',
                    defaultValue: '#33333',
                  },
                {
                    type: 'select',
                    name: 'as',
                    label: 'Tag name',
                    configs: {
                        options: [
                            { value: 'h4', label: 'Heading 4' },
                            { value: 'h5', label: 'Heading 5' },
                            { value: 'h6', label: 'Heading 6' },
                            { value: 'p', label: 'Paragraph' },
                            { value: 'div', label: 'Div' },
                        ],
                    },
                    defaultValue: 'p',
                },
                {
                    type: 'text',
                    name: 'content',
                    label: 'Content',
                    defaultValue: 'Section subheading',
                    placeholder: 'Section subheading',
                },
                {
                    type: 'select',
                    name: 'size',
                    label: 'Text size',
                    configs: {
                        options: [
                            { value: 'base', label: 'Base' },
                            { value: 'large', label: 'Large' },
                        ],
                    },
                    defaultValue: 'base',
                },
                {
                    type: 'select',
                    name: 'weight',
                    label: 'Weight',
                    configs: {
                        options: [
                            { value: 'normal', label: 'Normal' },
                            { value: 'medium', label: 'Medium' },
                        ],
                    },
                    defaultValue: 'normal',
                },
                {
                    type: 'toggle-group',
                    name: 'alignment',
                    label: 'Alignment',
                    configs: {
                        options: [
                            { value: 'left', label: 'Left' },
                            { value: 'center', label: 'Center' },
                            { value: 'right', label: 'Right' },
                        ],
                    },
                    // defaultValue: 'center',
                },
            ],
        },
    ],
    toolbar: ['general-settings', ['duplicate', 'delete']],
};
