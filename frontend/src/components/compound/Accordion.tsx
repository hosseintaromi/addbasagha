'use client'

import {
    createContext,
    useContext,
    useState,
    useId,
    ReactNode,
    HTMLAttributes
} from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

// Accordion context
interface AccordionContextValue {
    type: 'single' | 'multiple';
    value: string | string[];
    onValueChange: (value: string | string[]) => void;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

function useAccordionContext() {
    const context = useContext(AccordionContext);
    if (!context) {
        throw new Error('Accordion components must be used within Accordion');
    }
    return context;
}

// Accordion root component
interface AccordionProps {
    type: 'single' | 'multiple';
    value?: string | string[];
    defaultValue?: string | string[];
    onValueChange?: (value: string | string[]) => void;
    children: ReactNode;
    className?: string;
    collapsible?: boolean;
}

export function Accordion({
    type,
    value: controlledValue,
    defaultValue,
    onValueChange,
    children,
    className,
    collapsible = true,
    ...props
}: AccordionProps) {
    const [internalValue, setInternalValue] = useState<string | string[]>(
        defaultValue || (type === 'single' ? '' : [])
    );

    const value = controlledValue ?? internalValue;

    const handleValueChange = (newValue: string | string[]) => {
        if (onValueChange) {
            onValueChange(newValue);
        } else {
            setInternalValue(newValue);
        }
    };

    return (
        <AccordionContext.Provider
            value={{
                type,
                value,
                onValueChange: handleValueChange,
            }}
        >
            <div className={cn("space-y-1", className)} {...props}>
                {children}
            </div>
        </AccordionContext.Provider>
    );
}

// Individual accordion item context
interface AccordionItemContextValue {
    isOpen: boolean;
    onToggle: () => void;
    itemValue: string;
    triggerId: string;
    contentId: string;
}

const AccordionItemContext = createContext<AccordionItemContextValue | null>(null);

function useAccordionItemContext() {
    const context = useContext(AccordionItemContext);
    if (!context) {
        throw new Error('AccordionItem components must be used within AccordionItem');
    }
    return context;
}

// Accordion item component
interface AccordionItemProps extends HTMLAttributes<HTMLDivElement> {
    value: string;
    children: ReactNode;
    disabled?: boolean;
}

export function AccordionItem({
    value: itemValue,
    children,
    disabled = false,
    className,
    ...props
}: AccordionItemProps) {
    const { type, value, onValueChange } = useAccordionContext();
    const triggerId = useId();
    const contentId = useId();

    const isOpen = type === 'single'
        ? value === itemValue
        : Array.isArray(value) && value.includes(itemValue);

    const onToggle = () => {
        if (disabled) return;

        if (type === 'single') {
            const newValue = isOpen ? '' : itemValue;
            onValueChange(newValue);
        } else {
            const currentArray = Array.isArray(value) ? value : [];
            const newValue = isOpen
                ? currentArray.filter(v => v !== itemValue)
                : [...currentArray, itemValue];
            onValueChange(newValue);
        }
    };

    return (
        <AccordionItemContext.Provider
            value={{
                isOpen,
                onToggle,
                itemValue,
                triggerId,
                contentId,
            }}
        >
            <div
                className={cn(
                    "border border-gray-200 dark:border-gray-700 rounded-md",
                    disabled && "opacity-50 cursor-not-allowed",
                    className
                )}
                {...props}
            >
                {children}
            </div>
        </AccordionItemContext.Provider>
    );
}

// Accordion trigger (header) component
const accordionTriggerVariants = cva(
    "flex flex-1 items-center justify-between py-4 px-6 font-medium transition-all hover:underline text-left",
    {
        variants: {
            variant: {
                default: "text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800",
                ghost: "text-gray-700 dark:text-gray-300 hover:bg-transparent",
            },
            size: {
                sm: "py-2 px-4 text-sm",
                md: "py-4 px-6 text-base",
                lg: "py-6 px-8 text-lg",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "md",
        },
    }
);

interface AccordionTriggerProps
    extends HTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof accordionTriggerVariants> {
    children: ReactNode;
    hideChevron?: boolean;
}

export function AccordionTrigger({
    children,
    variant,
    size,
    hideChevron = false,
    className,
    ...props
}: AccordionTriggerProps) {
    const { isOpen, onToggle, triggerId, contentId } = useAccordionItemContext();

    return (
        <button
            id={triggerId}
            type="button"
            className={cn(accordionTriggerVariants({ variant, size }), className)}
            onClick={onToggle}
            aria-expanded={isOpen}
            aria-controls={contentId}
            {...props}
        >
            {children}
            {!hideChevron && (
                <ChevronDown
                    className={cn(
                        "h-4 w-4 shrink-0 transition-transform duration-200",
                        isOpen && "rotate-180"
                    )}
                />
            )}
        </button>
    );
}

// Accordion content component
interface AccordionContentProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
}

export function AccordionContent({
    children,
    className,
    ...props
}: AccordionContentProps) {
    const { isOpen, contentId, triggerId } = useAccordionItemContext();

    return (
        <div
            id={contentId}
            role="region"
            aria-labelledby={triggerId}
            className={cn(
                "overflow-hidden transition-all duration-300 ease-in-out",
                isOpen ? "animate-accordion-down" : "animate-accordion-up"
            )}
            style={{
                display: isOpen ? 'block' : 'none',
            }}
            {...props}
        >
            <div className={cn("pb-4 pt-0 px-6", className)}>
                {children}
            </div>
        </div>
    );
}

// Export compound component
Accordion.Item = AccordionItem;
Accordion.Trigger = AccordionTrigger;
Accordion.Content = AccordionContent;

export { accordionTriggerVariants };