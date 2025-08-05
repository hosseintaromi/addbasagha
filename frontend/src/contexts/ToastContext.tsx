'use client'

import { createContext, useContext, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Toast as ToastType, ToastType as ToastVariant } from '@/types';
import { Toast } from '@/components/ui/Toast';
import { AnimatePresence, motion } from 'framer-motion';

interface ToastContextType {
    toasts: ToastType[];
    addToast: (toast: Omit<ToastType, 'id'>) => string;
    removeToast: (id: string) => void;
    success: (title: string, description?: string, options?: Partial<ToastType>) => string;
    error: (title: string, description?: string, options?: Partial<ToastType>) => string;
    warning: (title: string, description?: string, options?: Partial<ToastType>) => string;
    info: (title: string, description?: string, options?: Partial<ToastType>) => string;
    clearAll: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
    children: React.ReactNode;
    maxToasts?: number;
    defaultDuration?: number;
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

export function ToastProvider({
    children,
    maxToasts = 5,
    defaultDuration = 5000,
    position = 'top-right'
}: ToastProviderProps) {
    const [toasts, setToasts] = useState<ToastType[]>([]);

    const addToast = useCallback((toast: Omit<ToastType, 'id'>) => {
        const id = Math.random().toString(36).substr(2, 9);
        const newToast: ToastType = {
            id,
            duration: defaultDuration,
            ...toast,
        };

        setToasts(prev => {
            const updated = [newToast, ...prev];
            return updated.slice(0, maxToasts);
        });

        return id;
    }, [maxToasts, defaultDuration]);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const createToast = useCallback((
        type: ToastVariant,
        title: string,
        description?: string,
        options?: Partial<ToastType>
    ) => {
        return addToast({
            type,
            title,
            description,
            ...options,
        });
    }, [addToast]);

    const success = useCallback((title: string, description?: string, options?: Partial<ToastType>) => {
        return createToast('success', title, description, options);
    }, [createToast]);

    const error = useCallback((title: string, description?: string, options?: Partial<ToastType>) => {
        return createToast('error', title, description, options);
    }, [createToast]);

    const warning = useCallback((title: string, description?: string, options?: Partial<ToastType>) => {
        return createToast('warning', title, description, options);
    }, [createToast]);

    const info = useCallback((title: string, description?: string, options?: Partial<ToastType>) => {
        return createToast('info', title, description, options);
    }, [createToast]);

    const clearAll = useCallback(() => {
        setToasts([]);
    }, []);

    const positionClasses = {
        'top-right': 'top-0 right-0',
        'top-left': 'top-0 left-0',
        'bottom-right': 'bottom-0 right-0',
        'bottom-left': 'bottom-0 left-0',
        'top-center': 'top-0 left-1/2 -translate-x-1/2',
        'bottom-center': 'bottom-0 left-1/2 -translate-x-1/2',
    };

    const toastContainer = (
        <div
            className={`fixed ${positionClasses[position]} z-50 flex flex-col gap-2 p-4 pointer-events-none`}
            style={{ maxWidth: '420px' }}
        >
            <AnimatePresence mode="popLayout">
                {toasts.map((toast) => (
                    <motion.div
                        key={toast.id}
                        layout
                        initial={{
                            opacity: 0,
                            y: position.includes('top') ? -50 : 50,
                            scale: 0.3
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1
                        }}
                        exit={{
                            opacity: 0,
                            y: position.includes('top') ? -50 : 50,
                            scale: 0.5,
                            transition: { duration: 0.2 }
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 30,
                        }}
                    >
                        <Toast toast={toast} onClose={removeToast} />
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );

    return (
        <ToastContext.Provider value={{
            toasts,
            addToast,
            removeToast,
            success,
            error,
            warning,
            info,
            clearAll,
        }}>
            {children}
            {typeof window !== 'undefined' && createPortal(toastContainer, document.body)}
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}

// Helper function for quick toast usage
export const toast = {
    success: (title: string, description?: string, options?: Partial<ToastType>) => {
        // This will be implemented by the hook
        console.warn('Toast provider not found. Please wrap your app with ToastProvider.');
    },
    error: (title: string, description?: string, options?: Partial<ToastType>) => {
        console.warn('Toast provider not found. Please wrap your app with ToastProvider.');
    },
    warning: (title: string, description?: string, options?: Partial<ToastType>) => {
        console.warn('Toast provider not found. Please wrap your app with ToastProvider.');
    },
    info: (title: string, description?: string, options?: Partial<ToastType>) => {
        console.warn('Toast provider not found. Please wrap your app with ToastProvider.');
    },
};