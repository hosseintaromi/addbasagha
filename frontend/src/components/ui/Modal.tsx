'use client'

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { ModalProps } from '@/types';
import { X } from 'lucide-react';
import { Button } from './Button';

const modalVariants = cva(
    "fixed inset-0 z-50 flex items-center justify-center p-4",
    {
        variants: {
            size: {
                xs: "max-w-xs",
                sm: "max-w-sm",
                md: "max-w-md",
                lg: "max-w-lg",
                xl: "max-w-xl",
            },
        },
        defaultVariants: {
            size: "md",
        },
    }
);

const overlayVariants = cva(
    "fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity",
    {
        variants: {
            isOpen: {
                true: "opacity-100",
                false: "opacity-0",
            },
        },
    }
);

const contentVariants = cva(
    "relative bg-white dark:bg-gray-900 rounded-lg shadow-xl transition-all transform",
    {
        variants: {
            isOpen: {
                true: "opacity-100 scale-100",
                false: "opacity-0 scale-95",
            },
            size: {
                xs: "w-full max-w-xs",
                sm: "w-full max-w-sm",
                md: "w-full max-w-md",
                lg: "w-full max-w-lg",
                xl: "w-full max-w-xl",
            },
        },
        defaultVariants: {
            size: "md",
        },
    }
);

export interface ModalPropsExtended
    extends ModalProps,
    VariantProps<typeof modalVariants> { }

export function Modal({
    isOpen,
    onClose,
    title,
    size = "md",
    closeOnOverlayClick = true,
    closeOnEsc = true,
    children,
    className,
}: ModalPropsExtended) {
    const overlayRef = useRef<HTMLDivElement>(null);

    // Handle escape key
    useEffect(() => {
        if (!closeOnEsc) return;

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            return () => document.removeEventListener('keydown', handleEscape);
        }
    }, [isOpen, onClose, closeOnEsc]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = 'unset';
            };
        }
    }, [isOpen]);

    // Handle overlay click
    const handleOverlayClick = (e: React.MouseEvent) => {
        if (closeOnOverlayClick && e.target === overlayRef.current) {
            onClose();
        }
    };

    if (!isOpen) return null;

    const modalContent = (
        <div className={cn(modalVariants({ size }))}>
            {/* Overlay */}
            <div
                ref={overlayRef}
                className={cn(overlayVariants({ isOpen }))}
                onClick={handleOverlayClick}
            />

            {/* Modal content */}
            <div className={cn(contentVariants({ isOpen, size }), className)}>
                {/* Header */}
                {title && (
                    <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {title}
                        </h2>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClose}
                            className="h-8 w-8 p-0"
                        >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Close</span>
                        </Button>
                    </div>
                )}

                {/* Body */}
                <div className={cn("p-6", { "pt-0": !title })}>
                    {children}
                </div>
            </div>
        </div>
    );

    // Render in portal
    return createPortal(modalContent, document.body);
}

// Modal compound components
interface ModalHeaderProps {
    children: React.ReactNode;
    className?: string;
}

export function ModalHeader({ children, className }: ModalHeaderProps) {
    return (
        <div className={cn("p-6 border-b border-gray-200 dark:border-gray-700", className)}>
            {children}
        </div>
    );
}

interface ModalBodyProps {
    children: React.ReactNode;
    className?: string;
}

export function ModalBody({ children, className }: ModalBodyProps) {
    return (
        <div className={cn("p-6", className)}>
            {children}
        </div>
    );
}

interface ModalFooterProps {
    children: React.ReactNode;
    className?: string;
}

export function ModalFooter({ children, className }: ModalFooterProps) {
    return (
        <div className={cn("flex items-center justify-end gap-2 p-6 border-t border-gray-200 dark:border-gray-700", className)}>
            {children}
        </div>
    );
}

export { modalVariants, overlayVariants, contentVariants };