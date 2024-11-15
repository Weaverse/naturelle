import {cn} from '@/lib/utils';
import clsx from 'clsx';
import React, {useState} from 'react';
import {IconClose} from './Icon';

const variants = {
  default: '',
  search:
    'px-0 py-2 text-sm placeholder-foreground-subtle w-full focus:ring-0 border-x-0 border-t-0 transition border-b-2 border-bar/10 focus:border-bar/50',
  minisearch:
    'hidden md:inline-block text-left lg:text-right border-b transition border-transparent -mb-px border-x-0 border-t-0 appearance-none px-0 py-1 focus:ring-transparent placeholder:opacity-20 placeholder:text-inherit focus:border-bar/50',
  error: 'border-red-500',
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'search' | 'minisearch' | 'error';
  suffix?: React.ReactNode;
  prefixElement?: React.ReactNode;
  onClear?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export let Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({
    className = '',
    type,
    variant = 'default',
    prefixElement,
    suffix,
    onFocus,
    onBlur,
    onClear,
    ...rest
  }, ref) => {
    let [focused, setFocused] = useState(false);
    let commonClasses = cn(
      'w-full rounded-sm border px-3 py-2.5',
      focused ? 'border-bar' : 'border-bar-subtle',
      className,
    );

    let handleClear = (e: any) => {
      e.preventDefault();
      e.stopPropagation();
      e.currentTarget.previousSibling.value = '';
      if (onClear) onClear(e);
    };
    if (type === 'search') {
      suffix = <IconClose className="cursor-pointer" onClick={handleClear} />;
    }
    let hasChild = Boolean(prefixElement || suffix);

    let rawInput = (
      <input
        // type={type}
        ref={ref}
        className={clsx(
          'w-full !shadow-none focus:ring-0 focus-visible:outline-none placeholder:text-foreground-subtle',
          hasChild
            ? 'relatvie grow border-none bg-transparent p-0'
            : commonClasses,
          variants[variant],
        )}
        onFocus={(e) => {
          setFocused(true);
          if (onFocus) onFocus(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          if (onBlur) onBlur(e);
        }}
        {...rest}
      />
    );

    return hasChild ? (
      <div
        className={clsx(
          commonClasses,
          'flex items-center gap-2 overflow-hidden border p-2.5',
        )}
      >
        {prefixElement}
        {rawInput}
        {suffix}
      </div>
    ) : (
      rawInput
    );
  },
);
