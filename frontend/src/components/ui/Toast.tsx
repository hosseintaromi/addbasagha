'use client'

import { useEffect } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Toast as ToastType } from '@/types';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { Button } from './Button';

const toastVariants = cva(
    "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all",
    {
        variants: {
            variant: {
                success: "border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950 dark:text-green-100",
                error: "border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-100",
                warning: "border-yellow-200 bg-yellow-50 text-yellow-900 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-100",
                info: "border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-100",
            },
        },
        defaultVariants: {
            variant: "info",
        },
    }
);

const iconMap = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
};

interface ToastProps extends VariantProps<typeof toastVariants> {
    toast: ToastType;
    onClose: (id: string) => void;
}

export function Toast({ toast, onClose, variant }: ToastProps) {
    const Icon = iconMap[toast.type];

    useEffect(() => {
        if (toast.duration && toast.duration > 0) {
            const timer = setTimeout(() => {
                onClose(toast.id);
            }, toast.duration);

            return () => clearTimeout(timer);
        }
    }, [toast.duration, toast.id, onClose]);

    return (
        <div className={cn(toastVariants({ variant: toast.type }))}>
            <div className="flex items-start space-x-3">
                <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                    <div className="font-medium">{toast.title}</div>
                    {toast.description && (
                        <div className="mt-1 text-sm opacity-90">
                            {toast.description}
                        </div>
                    )}
                    {toast.action && (
                        <div className="mt-3">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={toast.action.onClick}
                                className="h-8 text-xs"
                            >
                                {toast.action.label}
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            <Button
                variant="ghost"
                size="sm"
                onClick={() => onClose(toast.id)}
                className="absolute right-2 top-2 h-6 w-6 p-0 opacity-50 hover:opacity-100"
            >
                <X className="h-3 w-3" />
                <span className="sr-only">Close</span>
            </Button>
        </div>
    );
}

export { toastVariants };