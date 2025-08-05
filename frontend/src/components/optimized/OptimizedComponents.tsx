'use client'

import { memo, forwardRef, useMemo, ReactNode, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

// Optimized wrapper for expensive components
interface OptimizedWrapperProps {
    children: ReactNode;
    dependencies?: any[];
    shouldUpdate?: (prevProps: any, nextProps: any) => boolean;
    className?: string;
}

export const OptimizedWrapper = memo<OptimizedWrapperProps>(
    ({ children, className }) => {
        return (
            <div className={cn("contents", className)}>
                {children}
            </div>
        );
    },
    (prevProps, nextProps) => {
        // Custom comparison function
        if (prevProps.shouldUpdate) {
            return !prevProps.shouldUpdate(prevProps, nextProps);
        }

        // Default shallow comparison
        if (prevProps.dependencies && nextProps.dependencies) {
            return prevProps.dependencies.every((dep, index) =>
                dep === nextProps.dependencies![index]
            );
        }

        return prevProps.children === nextProps.children;
    }
);

OptimizedWrapper.displayName = 'OptimizedWrapper';

// Memoized list component for large datasets
interface OptimizedListProps<T> {
    items: T[];
    renderItem: (item: T, index: number) => ReactNode;
    keyExtractor: (item: T, index: number) => string | number;
    className?: string;
    itemClassName?: string;
    emptyState?: ReactNode;
    loadingState?: ReactNode;
    isLoading?: boolean;
}

export function OptimizedList<T>({
    items,
    renderItem,
    keyExtractor,
    className,
    itemClassName,
    emptyState,
    loadingState,
    isLoading = false,
}: OptimizedListProps<T>) {
    const memoizedItems = useMemo(() => {
        return items.map((item, index) => {
            const key = keyExtractor(item, index);
            return (
                <OptimizedListItem
                    key={key}
                    item={item}
                    index={index}
                    renderItem={renderItem}
                    className={itemClassName}
                />
            );
        });
    }, [items, renderItem, keyExtractor, itemClassName]);

    if (isLoading && loadingState) {
        return <div className={className}>{loadingState}</div>;
    }

    if (items.length === 0 && emptyState) {
        return <div className={className}>{emptyState}</div>;
    }

    return (
        <div className={className}>
            {memoizedItems}
        </div>
    );
}

// Memoized list item component
interface OptimizedListItemProps<T> {
    item: T;
    index: number;
    renderItem: (item: T, index: number) => ReactNode;
    className?: string;
}

const OptimizedListItem = memo<OptimizedListItemProps<any>>(
    ({ item, index, renderItem, className }) => {
        const renderedItem = useMemo(() => {
            return renderItem(item, index);
        }, [item, index, renderItem]);

        return (
            <div className={className}>
                {renderedItem}
            </div>
        );
    }
);

OptimizedListItem.displayName = 'OptimizedListItem';

// Heavy computation wrapper with memoization
interface HeavyComputationProps<T, R> {
    data: T;
    computeFn: (data: T) => R;
    dependencies?: any[];
    children: (result: R) => ReactNode;
    fallback?: ReactNode;
}

export function HeavyComputation<T, R>({
    data,
    computeFn,
    dependencies = [],
    children,
    fallback,
}: HeavyComputationProps<T, R>) {
    const result = useMemo(() => {
        try {
            return computeFn(data);
        } catch (error) {
            console.error('Heavy computation failed:', error);
            return null;
        }
    }, [data, computeFn, ...dependencies]);

    if (result === null && fallback) {
        return <>{fallback}</>;
    }

    return <>{children(result as R)}</>;
}

// Lazy component loader with suspense boundary
interface LazyComponentProps {
    loader: () => Promise<{ default: React.ComponentType<any> }>;
    fallback?: ReactNode;
    errorFallback?: ReactNode;
    props?: any;
}

export function LazyComponent({
    loader,
    fallback = <div>Loading...</div>,
    errorFallback = <div>Error loading component</div>,
    props = {},
}: LazyComponentProps) {
    const LazyComp = useMemo(() => {
        return memo(forwardRef<any, any>((componentProps, ref) => {
            const Component = useMemo(() => {
                const [Component, setComponent] = useState<React.ComponentType<any> | null>(null);
                const [error, setError] = useState<Error | null>(null);

                useEffect(() => {
                    loader()
                        .then((module) => setComponent(() => module.default))
                        .catch(setError);
                }, []);

                if (error) return () => errorFallback;
                if (!Component) return () => fallback;
                return Component;
            }, [loader]);

            return <Component ref={ref} {...componentProps} />;
        }));
    }, [loader, fallback, errorFallback]);

    return <LazyComp {...props} />;
}

// Performance boundary for monitoring component render times
interface PerformanceBoundaryProps {
    name: string;
    children: ReactNode;
    threshold?: number; // ms
    onSlowRender?: (name: string, time: number) => void;
}

export const PerformanceBoundary = memo<PerformanceBoundaryProps>(
    ({ name, children, threshold = 16, onSlowRender }) => {
        const startTime = performance.now();

        useMemo(() => {
            const endTime = performance.now();
            const renderTime = endTime - startTime;

            if (renderTime > threshold) {
                console.warn(`[Performance] Slow render detected: ${name} took ${renderTime.toFixed(2)}ms`);
                onSlowRender?.(name, renderTime);
            }
        }, [name, threshold, onSlowRender, children]);

        return <>{children}</>;
    }
);

PerformanceBoundary.displayName = 'PerformanceBoundary';

// Optimized image component with lazy loading and caching
interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    lazy?: boolean;
    placeholder?: string;
    fallback?: string;
    onLoad?: () => void;
    onError?: () => void;
}

export const OptimizedImage = memo<OptimizedImageProps>(
    forwardRef<HTMLImageElement, OptimizedImageProps>(
        ({
            src,
            alt,
            width,
            height,
            lazy = true,
            placeholder,
            fallback,
            onLoad,
            onError,
            className,
            ...props
        }, ref) => {
            const [isLoaded, setIsLoaded] = useState(false);
            const [hasError, setHasError] = useState(false);
            const [currentSrc, setCurrentSrc] = useState(placeholder || '');

            useEffect(() => {
                if (!lazy) {
                    setCurrentSrc(src);
                    return;
                }

                const img = new Image();
                img.onload = () => {
                    setCurrentSrc(src);
                    setIsLoaded(true);
                    onLoad?.();
                };
                img.onerror = () => {
                    setHasError(true);
                    if (fallback) {
                        setCurrentSrc(fallback);
                    }
                    onError?.();
                };
                img.src = src;
            }, [src, lazy, placeholder, fallback, onLoad, onError]);

            return (
                <img
                    ref={ref}
                    src={hasError && fallback ? fallback : currentSrc}
                    alt={alt}
                    width={width}
                    height={height}
                    className={cn(
                        'transition-opacity duration-300',
                        isLoaded ? 'opacity-100' : 'opacity-50',
                        className
                    )}
                    {...props}
                />
            );
        }
    )
);

OptimizedImage.displayName = 'OptimizedImage';

// HOC for adding performance monitoring to any component
export function withPerformanceMonitoring<P extends object>(
    Component: React.ComponentType<P>,
    name?: string
) {
    const WrappedComponent = memo<P>((props) => {
        return (
            <PerformanceBoundary name={name || Component.displayName || Component.name}>
                <Component {...props} />
            </PerformanceBoundary>
        );
    });

    WrappedComponent.displayName = `withPerformanceMonitoring(${Component.displayName || Component.name})`;

    return WrappedComponent;
}

// HOC for adding memoization to any component
export function withMemoization<P extends object>(
    Component: React.ComponentType<P>,
    areEqual?: (prevProps: P, nextProps: P) => boolean
) {
    const MemoizedComponent = memo(Component, areEqual);
    MemoizedComponent.displayName = `memo(${Component.displayName || Component.name})`;
    return MemoizedComponent;
}