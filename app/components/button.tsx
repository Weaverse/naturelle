import * as React from 'react';
import {cva, type VariantProps} from 'class-variance-authority';
import { cn } from "~/lib/utils";
import { Link } from './Link';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap font-normal transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'btn-primary',
        secondary:
          'btn-secondary',
        outline:
          'btn-outline !font-heading',
        link: 'text-text-primary underline-offset-4 hover:underline',
        decor: 'relative',
        custom: '',
      },
      size: {
        default: 'h-[50px] px-5 py-3',
        sm: 'h-10 px-3',
        lg: 'h-14 px-8',
        icon: 'h-10 w-10',
      },
      shape: {
        default: 'rounded',
        round: 'rounded-full',
        customs: 'rounded-[var(--radius)]',
      },
      fontFamily: {
        body: 'font-body',
        heading: 'font-heading',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  asChild?: boolean;
  as?: React.ElementType;
  to?: string;
  target?: string;
  classNameContainer?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      loading,
      variant,
      size = 'default',
      shape = 'round',
      fontFamily = 'body',
      asChild,
      as = 'button',
      classNameContainer,
      children,
      ...props
    },
    ref,
  ) => {
    const Component = props?.to ? Link : as;

    return (
      <Component
        className={cn(
          buttonVariants({variant, size, shape, fontFamily, className}),
          loading && 'pointer-events-none relative',
        )}
        ref={ref}
        {...props}
        target={props.to ? props?.target || '_self' : undefined}
      >
        {loading && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-7 h-7 border-4 border-t-transparent border-border rounded-full animate-spin"></div>
          </div>
        )}
        <span className={cn(classNameContainer, loading ? 'invisible' : '')}>{children}</span>
      </Component>
    );
  },
);
Button.displayName = 'Button';

export {Button, buttonVariants};
