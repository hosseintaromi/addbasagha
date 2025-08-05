'use client'

import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { BaseComponentProps } from '@/types';

const containerVariants = cva(
    "mx-auto w-full",
    {
        variants: {
            size: {
                sm: "max-w-screen-sm",       // 640px
                md: "max-w-screen-md",       // 768px
                lg: "max-w-screen-lg",       // 1024px
                xl: "max-w-screen-xl",       // 1280px
                "2xl": "max-w-screen-2xl",   // 1536px
                full: "max-w-full",
                none: "",
            },
            padding: {
                none: "",
                sm: "px-4 sm:px-6",
                md: "px-4 sm:px-6 lg:px-8",
                lg: "px-6 sm:px-8 lg:px-12",
            },
        },
        defaultVariants: {
            size: "xl",
            padding: "md",
        },
    }
);

interface ContainerProps
    extends BaseComponentProps,
    VariantProps<typeof containerVariants> {
    as?: keyof JSX.IntrinsicElements;
}

export function Container({
    children,
    className,
    size,
    padding,
    as: Component = 'div',
    ...props
}: ContainerProps) {
    return (
        <Component
            className={cn(containerVariants({ size, padding }), className)}
            {...props}
        >
            {children}
        </Component>
    );
}

// Specialized containers
export function PageContainer({ children, className, ...props }: Omit<ContainerProps, 'as'>) {
    return (
        <Container
            as="main"
            className={cn("min-h-screen py-8", className)}
            {...props}
        >
            {children}
        </Container>
    );
}

export function SectionContainer({ children, className, ...props }: Omit<ContainerProps, 'as'>) {
    return (
        <Container
            as="section"
            className={cn("py-12 lg:py-16", className)}
            {...props}
        >
            {children}
        </Container>
    );
}

export function ContentContainer({ children, className, ...props }: Omit<ContainerProps, 'as'>) {
    return (
        <Container
            as="div"
            size="lg"
            className={cn("prose prose-gray dark:prose-invert max-w-none", className)}
            {...props}
        >
            {children}
        </Container>
    );
}

export { containerVariants };