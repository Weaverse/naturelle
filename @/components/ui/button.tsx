import * as React from 'react';
import {Link} from '@remix-run/react';
import {cva, type VariantProps} from 'class-variance-authority';

import {cn} from '@/lib/utils';
import {IconSpinner} from '~/components/Icon';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        // destructive:
        //   'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-input bg-background hover:bg-outline hover:text-outline-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        primary: 'relative',
        // ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
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
  [key: string]: any;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      loading,
      variant,
      size = 'default',
      asChild,
      as = 'button',
      children,
      ...props
    },
    ref,
  ) => {
    const Component = props?.to ? Link : as;
    if (loading) {
    }
    return (
      <Component
        className={cn(
          buttonVariants({variant, size, className}),
          loading && 'pointer-events-none relative',
        )}
        ref={ref}
        {...props}
      >
        {loading && (
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <IconSpinner />
          </span>
        )}
        <span className={loading ? 'invisible' : ''}>{children}</span>
      </Component>
    );
  },
);
Button.displayName = 'Button';

export {Button, buttonVariants};
