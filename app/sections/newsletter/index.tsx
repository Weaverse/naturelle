import type {
    HydrogenComponentProps,
    HydrogenComponentSchema,
    WeaverseImage,
} from '@weaverse/hydrogen';
import { forwardRef, CSSProperties, useRef } from 'react';
import { IconNewsletter } from '~/components/Icon';
import { Image } from '@shopify/hydrogen';
import { Input } from '@/components/input';
import { Button } from "@/components/button";
import { useFetcher } from '@remix-run/react';
import clsx from 'clsx';

type VariantStyle = "primary" | "outline" | "secondary" | "link" | "decor" | null | undefined;
interface NewsletterProps extends HydrogenComponentProps {
    verticalPadding: number;
    sectionHeight: number;
    backgroundColor: string;
    showIconImage: boolean;
    iconImage: WeaverseImage;
    iconImageSize: number;
    placeholder: string;
    buttonLabel: string;
    buttonStyle: VariantStyle;
}

const Newsletter = forwardRef<
    HTMLElement,
    NewsletterProps
>((props, ref) => {
    let {
        verticalPadding,
        sectionHeight,
        backgroundColor,
        showIconImage,
        iconImage,
        iconImageSize,
        placeholder,
        buttonLabel,
        buttonStyle,
        children,
        ...rest
    } = props;
    let fetcher = useFetcher<any>()
    const emailInputRef = useRef<HTMLInputElement>(null);
    let isError = fetcher.state === 'idle' && fetcher.data?.errors
    let isSuccess = fetcher.state === 'idle' && fetcher.data?.customer
    let alertMessage = '';
    let alertMessageClass = '';
    if (isError && fetcher.data?.errors) {
        const firstError = fetcher.data?.errors[0];
        alertMessage = firstError.code === "TAKEN" ? firstError.message : "Some things went wrong!";
        alertMessageClass = 'text-red-700';
    } else if (isSuccess && fetcher.data?.customer && emailInputRef.current) {
        alertMessage = "Subscribe successfully!";
        emailInputRef.current.value = '';
        alertMessageClass = 'text-green-700';
    }
    let sectionStyle: CSSProperties = {
        height: `${sectionHeight}px`,
        backgroundColor: backgroundColor,
        '--image-size': `${iconImageSize}px`,
        '--max-width-content': '600px',
        '--vertical-padding': `${verticalPadding}px`,
    } as CSSProperties;

    return (
        <section ref={ref} {...rest} className="w-full flex justify-center items-center" style={sectionStyle}>
            <div className="z-10 w-[var(--max-width-content)] py-[var(--vertical-padding)] sm-max:w-5/6 h-full flex flex-col justify-center items-center text-center gap-5">
                {showIconImage && <div className='flex justify-center items-center'>
                    {iconImage ? (<Image
                        data={iconImage}
                        className="!w-[var(--image-size)] !aspect-square object-cover" />) : (<IconNewsletter viewBox='0 0 65 64' className='!w-16 !h-16' />)}

                </div>}
                {children}
                <fetcher.Form method="POST" action="/api/customer" className="flex gap-2 justify-center items-center w-full">
                    <Input
                        className="bg-transparent w-2/3"
                        type="email"
                        name="email"
                        placeholder={placeholder}
                        ref={emailInputRef}
                        required
                    />
                    <Button loading={fetcher.state === 'submitting'} variant={buttonStyle} type="submit">{buttonLabel}</Button>
                </fetcher.Form>
                {alertMessage && <p className={clsx("!mt-1 text-xs", alertMessageClass)}>{alertMessage}</p>}
            </div>
        </section>
    );
});

export default Newsletter;

export let schema: HydrogenComponentSchema = {
    type: 'newsletter',
    title: 'Newsletter',
    toolbar: ['general-settings', ['duplicate', 'delete']],
    inspector: [
        {
            group: 'Newsletter',
            inputs: [
                {
                    type: 'range',
                    name: 'verticalPadding',
                    label: 'Vertical padding',
                    defaultValue: 20,
                    configs: {
                        min: 10,
                        max: 100,
                        step: 1,
                    },
                },
                {
                    type: 'range',
                    name: 'sectionHeight',
                    label: 'Section height',
                    defaultValue: 450,
                    configs: {
                        min: 350,
                        max: 700,
                        step: 10,
                    },
                },
                {
                    type: 'color',
                    name: 'backgroundColor',
                    label: 'Background color',
                    defaultValue: '#E5E7D4',
                },
                {
                    type: 'text',
                    name: 'placeholder',
                    label: 'Placeholder',
                    defaultValue: 'Enter your email',
                }
            ],
        },
        {
            group: 'Icon',
            inputs: [
                {
                    type: 'image',
                    name: 'iconImage',
                    label: 'Icon image',
                },
                {
                    type: 'range',
                    name: 'iconImageSize',
                    label: 'Icon image size',
                    defaultValue: 50,
                    configs: {
                        min: 20,
                        max: 100,
                        step: 1,
                    },
                },
                {
                    type: 'switch',
                    name: 'showIconImage',
                    label: 'Show icon image',
                    defaultValue: true,
                }
            ],
        },
        {
            group: 'Button',
            inputs: [
                {
                    type: 'text',
                    name: 'buttonLabel',
                    label: 'Button label',
                    defaultValue: 'Send',
                },
                {
                    type: 'toggle-group',
                    label: 'Button style',
                    name: 'buttonStyle',
                    configs: {
                        options: [
                            { label: 'Primary', value: 'primary' },
                            { label: 'Outline', value: 'outline' },
                            { label: 'Secondary', value: 'secondary' },
                        ],
                    },
                    defaultValue: 'primary',
                },
            ],
        },
    ],
    childTypes: ['heading', 'description'],
    presets: {
        children: [
            {
                type: 'heading',
                content: 'Sign up for the updates',
            },
            {
                type: 'description',
                content: 'Get 15% off your first order',
            },
        ],
    },
};