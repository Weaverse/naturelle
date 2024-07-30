import * as React from 'react';
import {Link} from '@remix-run/react';
import {cva, type VariantProps} from 'class-variance-authority';

import {cn} from '@/lib/utils';
import { Spinner } from "./spinner";

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground border border-primary hover:bg-background hover:text-foreground hover:border-bar',
        secondary:
          'border border-bar bg-background hover:bg-primary hover:text-secondary',
        outline:
          'bg-background border border-bar text-secondary-foreground font-heading text-xl font-medium',
        link: 'text-primary underline-offset-4 hover:underline',
        decor: 'relative',
      },
      size: {
        default: 'h-[50px] px-5 py-3',
        sm: 'h-10 px-3',
        lg: 'h-14 px-8',
        icon: 'h-10 w-10',
      },
      shape: {
        default: 'rounded',
        round: 'rounded-md',
      }
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
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      loading,
      variant,
      size = 'default',
      shape = 'round',
      asChild,
      as = 'button',
      children,
      ...props
    },
    ref,
  ) => {
    const Component = props?.to ? Link : as;

    return (
      <Component
        className={cn(
          buttonVariants({variant, size, shape, className}),
          loading && 'pointer-events-none relative',
        )}
        ref={ref}
        {...props}
        target={props.to ? props?.target || '_self' : undefined}
      >
        {loading && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <Spinner size={20} />
          </div>
        )}
        <span className={loading ? 'invisible' : ''}>{children}</span>
      </Component>
    );
  },
);
Button.displayName = 'Button';

export {Button, buttonVariants};
