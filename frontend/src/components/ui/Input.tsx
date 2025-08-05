'use client'

import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { InputProps } from '@/types';
import { AlertCircle } from 'lucide-react';

const inputVariants = cva(
    // Base styles
    "flex w-full rounded-md border bg-white text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-400",
    {
        variants: {
            variant: {
                outline: "border-gray-300 focus-visible:ring-blue-500 dark:border-gray-600",
                filled: "border-transparent bg-gray-100 focus-visible:ring-blue-500 dark:bg-gray-700",
                ghost: "border-transparent bg-transparent focus-visible:ring-blue-500",
            },
            size: {
                sm: "h-8 px-3 py-1 text-xs",
                md: "h-10 px-3 py-2",
                lg: "h-12 px-4 py-3 text-base",
            },
            hasError: {
                true: "border-red-500 focus-visible:ring-red-500 dark:border-red-500",
            },
        },
        defaultVariants: {
            variant: "outline",
            size: "md",
        },
    }
);

export interface InputPropsExtended
    extends InputProps,
    VariantProps<typeof inputVariants> { }

const Input = forwardRef<HTMLInputElement, InputPropsExtended>(
    ({
        className,
        variant,
        size,
        hasError,
        label,
        error,
        help,
        leftIcon,
        rightIcon,
        required,
        disabled,
        ...props
    }, ref) => {
        const inputId = props.id || props.name;
        const hasErrorState = hasError || !!error;

        return (
            <div className="w-full space-y-1">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        {label}
                        {required && <span className="ml-1 text-red-500">*</span>}
                    </label>
                )}

                <div className="relative">
                    {leftIcon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                            {leftIcon}
                        </div>
                    )}

                    <input
                        ref={ref}
                        id={inputId}
                        disabled={disabled}
                        className={cn(
                            inputVariants({
                                variant,
                                size,
                                hasError: hasErrorState,
                                className
                            }),
                            {
                                "pl-10": leftIcon,
                                "pr-10": rightIcon || hasErrorState,
                            }
                        )}
                        {...props}
                    />

                    {(rightIcon || hasErrorState) && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                            {hasErrorState ? (
                                <AlertCircle className="h-4 w-4 text-red-500" />
                            ) : (
                                rightIcon
                            )}
                        </div>
                    )}
                </div>

                {error && (
                    <p className="text-sm text-red-600 dark:text-red-400">
                        {error}
                    </p>
                )}

                {help && !error && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {help}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";

export { Input, inputVariants };
export type { InputPropsExtended as InputProps };