'use client'

import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const loadingVariants = cva(
    "animate-spin",
    {
        variants: {
            size: {
                xs: "h-3 w-3",
                sm: "h-4 w-4",
                md: "h-6 w-6",
                lg: "h-8 w-8",
                xl: "h-12 w-12",
            },
            variant: {
                primary: "text-blue-600",
                secondary: "text-gray-400",
                white: "text-white",
                current: "text-current",
            },
        },
        defaultVariants: {
            size: "md",
            variant: "primary",
        },
    }
);

interface LoadingProps extends VariantProps<typeof loadingVariants> {
    className?: string;
    text?: string;
}

export function Loading({ size, variant, className, text }: LoadingProps) {
    return (
        <div className="flex items-center justify-center gap-2">
            <Loader2 className={cn(loadingVariants({ size, variant }), className)} />
            {text && (
                <span className="text-sm text-gray-600 dark:text-gray-400">
                    {text}
                </span>
            )}
        </div>
    );
}

// Spinner component (alias for Loading)
export const Spinner = Loading;

// Loading overlay component
interface LoadingOverlayProps {
    isLoading: boolean;
    text?: string;
    children: React.ReactNode;
    className?: string;
}

export function LoadingOverlay({
    isLoading,
    text = "Loading...",
    children,
    className
}: LoadingOverlayProps) {
    return (
        <div className={cn("relative", className)}>
            {children}
            {isLoading && (
                <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 flex items-center justify-center z-10">
                    <Loading size="lg" text={text} />
                </div>
            )}
        </div>
    );
}

// Skeleton loading component
interface SkeletonProps {
    className?: string;
    width?: string | number;
    height?: string | number;
    rounded?: boolean;
}

export function Skeleton({
    className,
    width = "100%",
    height = "1rem",
    rounded = false
}: SkeletonProps) {
    return (
        <div
            className={cn(
                "animate-pulse bg-gray-200 dark:bg-gray-700",
                rounded ? "rounded-full" : "rounded",
                className
            )}
            style={{ width, height }}
        />
    );
}

// Loading dots component
interface LoadingDotsProps {
    className?: string;
    color?: string;
}

export function LoadingDots({ className, color = "bg-gray-400" }: LoadingDotsProps) {
    return (
        <div className={cn("flex space-x-1", className)}>
            {[0, 1, 2].map((i) => (
                <div
                    key={i}
                    className={cn(
                        "h-2 w-2 rounded-full animate-pulse",
                        color
                    )}
                    style={{
                        animationDelay: `${i * 0.15}s`,
                        animationDuration: '0.6s',
                    }}
                />
            ))}
        </div>
    );
}

// Progress bar component
interface ProgressProps {
    value: number;
    max?: number;
    className?: string;
    showPercentage?: boolean;
    color?: string;
    size?: 'sm' | 'md' | 'lg';
}

export function Progress({
    value,
    max = 100,
    className,
    showPercentage = false,
    color = "bg-blue-600",
    size = "md"
}: ProgressProps) {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    const heights = {
        sm: "h-1",
        md: "h-2",
        lg: "h-3",
    };

    return (
        <div className={cn("space-y-1", className)}>
            <div className={cn(
                "w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden",
                heights[size]
            )}>
                <div
                    className={cn("h-full transition-all duration-300 ease-out", color)}
                    style={{ width: `${percentage}%` }}
                />
            </div>
            {showPercentage && (
                <div className="text-xs text-gray-600 dark:text-gray-400 text-right">
                    {Math.round(percentage)}%
                </div>
            )}
        </div>
    );
}

export { loadingVariants };