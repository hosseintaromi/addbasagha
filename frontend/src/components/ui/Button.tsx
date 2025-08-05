'use client'

import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { ButtonProps } from '@/types';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
    // Base styles
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 touch-manipulation",
    {
        variants: {
            variant: {
                primary: "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500 dark:bg-blue-700 dark:hover:bg-blue-600",
                secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-500 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700",
                outline: "border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 focus-visible:ring-gray-500 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800",
                ghost: "text-gray-700 hover:bg-gray-100 focus-visible:ring-gray-500 dark:text-gray-300 dark:hover:bg-gray-800",
                destructive: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500 dark:bg-red-700 dark:hover:bg-red-600",
            },
            size: {
                sm: "h-8 px-3 text-xs",
                md: "h-10 px-4 py-2",
                lg: "h-12 px-6 text-base",
            },
            fullWidth: {
                true: "w-full",
            },
        },
        defaultVariants: {
            variant: "primary",
            size: "md",
        },
    }
);

export interface ButtonPropsExtended
    extends ButtonProps,
    VariantProps<typeof buttonVariants> { }

const Button = forwardRef<HTMLButtonElement, ButtonPropsExtended>(
    ({
        className,
        variant,
        size,
        fullWidth,
        isLoading,
        isDisabled,
        leftIcon,
        rightIcon,
        children,
        ...props
    }, ref) => {
        const disabled = isDisabled || isLoading;

        return (
            <button
                className={cn(buttonVariants({ variant, size, fullWidth, className }))}
                ref={ref}
                disabled={disabled}
                {...props}
            >
                {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {!isLoading && leftIcon && (
                    <span className="mr-2 inline-flex">{leftIcon}</span>
                )}
                {children}
                {!isLoading && rightIcon && (
                    <span className="ml-2 inline-flex">{rightIcon}</span>
                )}
            </button>
        );
    }
);

Button.displayName = "Button";

export { Button, buttonVariants };
export type { ButtonPropsExtended as ButtonProps };