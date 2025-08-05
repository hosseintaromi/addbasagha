'use client'

import {
    createContext,
    useContext,
    useState,
    useId,
    ReactNode,
    HTMLAttributes,
    ButtonHTMLAttributes
} from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Tabs context
interface TabsContextValue {
    value: string;
    onValueChange: (value: string) => void;
    orientation: 'horizontal' | 'vertical';
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
    const context = useContext(TabsContext);
    if (!context) {
        throw new Error('Tabs components must be used within Tabs');
    }
    return context;
}

// Tabs root component
interface TabsProps {
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    orientation?: 'horizontal' | 'vertical';
    children: ReactNode;
    className?: string;
}

export function Tabs({
    value: controlledValue,
    defaultValue = '',
    onValueChange,
    orientation = 'horizontal',
    children,
    className,
    ...props
}: TabsProps) {
    const [internalValue, setInternalValue] = useState(defaultValue);
    const value = controlledValue ?? internalValue;

    const handleValueChange = (newValue: string) => {
        if (onValueChange) {
            onValueChange(newValue);
        } else {
            setInternalValue(newValue);
        }
    };

    return (
        <TabsContext.Provider
            value={{
                value,
                onValueChange: handleValueChange,
                orientation,
            }}
        >
            <div
                className={cn(
                    "flex",
                    orientation === 'vertical' ? "flex-col" : "flex-col",
                    className
                )}
                {...props}
            >
                {children}
            </div>
        </TabsContext.Provider>
    );
}

// Tabs list component
const tabsListVariants = cva(
    "inline-flex items-center justify-center rounded-md p-1 text-muted-foreground",
    {
        variants: {
            variant: {
                default: "bg-gray-100 dark:bg-gray-800",
                outline: "border border-gray-200 dark:border-gray-700",
                ghost: "bg-transparent",
                underline: "bg-transparent border-b border-gray-200 dark:border-gray-700",
            },
            orientation: {
                horizontal: "h-10 w-full",
                vertical: "h-auto w-full flex-col",
            },
        },
        defaultVariants: {
            variant: "default",
            orientation: "horizontal",
        },
    }
);

interface TabsListProps
    extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tabsListVariants> {
    children: ReactNode;
}

export function TabsList({
    children,
    variant,
    className,
    ...props
}: TabsListProps) {
    const { orientation } = useTabsContext();

    return (
        <div
            role="tablist"
            aria-orientation={orientation}
            className={cn(tabsListVariants({ variant, orientation }), className)}
            {...props}
        >
            {children}
        </div>
    );
}

// Tabs trigger component
const tabsTriggerVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-900",
                outline: "data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600",
                ghost: "hover:bg-gray-100 dark:hover:bg-gray-800 data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-800",
                underline: "border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none",
            },
            size: {
                sm: "px-2 py-1 text-xs",
                md: "px-3 py-1.5 text-sm",
                lg: "px-4 py-2 text-base",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "md",
        },
    }
);

interface TabsTriggerProps
    extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof tabsTriggerVariants> {
    value: string;
    children: ReactNode;
}

export function TabsTrigger({
    value: triggerValue,
    children,
    variant,
    size,
    className,
    disabled,
    ...props
}: TabsTriggerProps) {
    const { value, onValueChange } = useTabsContext();
    const isActive = value === triggerValue;
    const id = useId();

    return (
        <button
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls={`${id}-content`}
            data-state={isActive ? "active" : "inactive"}
            id={`${id}-trigger`}
            className={cn(tabsTriggerVariants({ variant, size }), className)}
            onClick={() => onValueChange(triggerValue)}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
}

// Tabs content component
interface TabsContentProps extends HTMLAttributes<HTMLDivElement> {
    value: string;
    children: ReactNode;
    forceMount?: boolean;
}

export function TabsContent({
    value: contentValue,
    children,
    forceMount = false,
    className,
    ...props
}: TabsContentProps) {
    const { value } = useTabsContext();
    const isActive = value === contentValue;
    const id = useId();

    if (!isActive && !forceMount) {
        return null;
    }

    return (
        <div
            role="tabpanel"
            id={`${id}-content`}
            aria-labelledby={`${id}-trigger`}
            data-state={isActive ? "active" : "inactive"}
            className={cn(
                "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                !isActive && "hidden",
                className
            )}
            tabIndex={0}
            {...props}
        >
            {children}
        </div>
    );
}

// Specialized tab components
interface NavigationTabsProps extends Omit<TabsProps, 'orientation'> {
    items: Array<{
        value: string;
        label: string;
        disabled?: boolean;
        content: ReactNode;
    }>;
    variant?: VariantProps<typeof tabsListVariants>['variant'];
}

export function NavigationTabs({
    items,
    variant = "default",
    ...tabsProps
}: NavigationTabsProps) {
    return (
        <Tabs {...tabsProps}>
            <TabsList variant={variant}>
                {items.map((item) => (
                    <TabsTrigger
                        key={item.value}
                        value={item.value}
                        disabled={item.disabled}
                    >
                        {item.label}
                    </TabsTrigger>
                ))}
            </TabsList>

            {items.map((item) => (
                <TabsContent key={item.value} value={item.value}>
                    {item.content}
                </TabsContent>
            ))}
        </Tabs>
    );
}

// Vertical tabs component
interface VerticalTabsProps extends Omit<TabsProps, 'orientation'> {
    items: Array<{
        value: string;
        label: string;
        disabled?: boolean;
        content: ReactNode;
    }>;
}

export function VerticalTabs({ items, className, ...tabsProps }: VerticalTabsProps) {
    return (
        <Tabs orientation="vertical" className={cn("flex flex-row gap-4", className)} {...tabsProps}>
            <div className="flex-shrink-0">
                <TabsList variant="outline" className="flex-col h-auto w-48">
                    {items.map((item) => (
                        <TabsTrigger
                            key={item.value}
                            value={item.value}
                            disabled={item.disabled}
                            className="w-full justify-start"
                        >
                            {item.label}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </div>

            <div className="flex-1">
                {items.map((item) => (
                    <TabsContent key={item.value} value={item.value} className="mt-0">
                        {item.content}
                    </TabsContent>
                ))}
            </div>
        </Tabs>
    );
}

// Export compound component
Tabs.List = TabsList;
Tabs.Trigger = TabsTrigger;
Tabs.Content = TabsContent;

export { tabsListVariants, tabsTriggerVariants };