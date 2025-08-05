'use client'

import { Component, ReactNode, ErrorInfo } from 'react';
import { Button } from './Button';
import { AppIcons } from '../icons/Icon';

interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
    errorInfo?: ErrorInfo;
}

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
    resetOnPropsChange?: boolean;
    resetKeys?: Array<string | number>;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    private resetTimeoutId: number | null = null;

    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return {
            hasError: true,
            error,
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        this.setState({
            error,
            errorInfo,
        });

        // Call the onError callback if provided
        if (this.props.onError) {
            this.props.onError(error, errorInfo);
        }

        // Log error to console in development
        if (process.env.NODE_ENV === 'development') {
            console.error('ErrorBoundary caught an error:', error, errorInfo);
        }
    }

    componentDidUpdate(prevProps: ErrorBoundaryProps) {
        const { resetOnPropsChange, resetKeys } = this.props;
        const { hasError } = this.state;

        // Reset error state when resetKeys change
        if (hasError && resetOnPropsChange && resetKeys) {
            const hasResetKeyChanged = resetKeys.some(
                (resetKey, idx) => prevProps.resetKeys?.[idx] !== resetKey
            );

            if (hasResetKeyChanged) {
                this.resetErrorBoundary();
            }
        }
    }

    resetErrorBoundary = () => {
        if (this.resetTimeoutId) {
            window.clearTimeout(this.resetTimeoutId);
        }

        this.resetTimeoutId = window.setTimeout(() => {
            this.setState({
                hasError: false,
                error: undefined,
                errorInfo: undefined,
            });
        }, 100);
    };

    componentWillUnmount() {
        if (this.resetTimeoutId) {
            window.clearTimeout(this.resetTimeoutId);
        }
    }

    render() {
        const { hasError, error } = this.state;
        const { children, fallback } = this.props;

        if (hasError) {
            // Return custom fallback if provided
            if (fallback) {
                return fallback;
            }

            // Default error UI
            return (
                <DefaultErrorFallback
                    error={error}
                    resetErrorBoundary={this.resetErrorBoundary}
                />
            );
        }

        return children;
    }
}

// Default error fallback component
interface DefaultErrorFallbackProps {
    error?: Error;
    resetErrorBoundary: () => void;
}

function DefaultErrorFallback({ error, resetErrorBoundary }: DefaultErrorFallbackProps) {
    return (
        <div className="min-h-[400px] flex items-center justify-center p-6">
            <div className="text-center max-w-md">
                <div className="mb-4">
                    <AppIcons.error size="2xl" variant="error" />
                </div>

                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Something went wrong
                </h2>

                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    An unexpected error occurred. Please try again or contact support if the problem persists.
                </p>

                {process.env.NODE_ENV === 'development' && error && (
                    <details className="mb-6 text-left bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
                        <summary className="cursor-pointer font-medium mb-2">
                            Error Details (Development Only)
                        </summary>
                        <pre className="text-xs text-red-600 dark:text-red-400 overflow-auto">
                            {error.toString()}
                            {error.stack && (
                                <>
                                    {'\n\n'}
                                    {error.stack}
                                </>
                            )}
                        </pre>
                    </details>
                )}

                <div className="space-y-2">
                    <Button onClick={resetErrorBoundary} className="w-full">
                        Try Again
                    </Button>

                    <Button
                        variant="outline"
                        onClick={() => window.location.reload()}
                        className="w-full"
                    >
                        Reload Page
                    </Button>
                </div>
            </div>
        </div>
    );
}

// HOC for wrapping components with error boundary
export function withErrorBoundary<P extends object>(
    Component: React.ComponentType<P>,
    errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
    const WrappedComponent = (props: P) => (
        <ErrorBoundary {...errorBoundaryProps}>
            <Component {...props} />
        </ErrorBoundary>
    );

    WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

    return WrappedComponent;
}

// Async error boundary for handling async errors
interface AsyncErrorBoundaryProps extends ErrorBoundaryProps {
    onAsyncError?: (error: Error) => void;
}

export function AsyncErrorBoundary({ onAsyncError, ...props }: AsyncErrorBoundaryProps) {
    // Set up global error handler for unhandled promise rejections
    if (typeof window !== 'undefined') {
        window.addEventListener('unhandledrejection', (event) => {
            if (onAsyncError) {
                onAsyncError(new Error(event.reason));
            }
        });
    }

    return <ErrorBoundary {...props} />;
}

// Page-level error boundary
interface PageErrorBoundaryProps {
    children: ReactNode;
    title?: string;
    description?: string;
}

export function PageErrorBoundary({
    children,
    title = "Page Error",
    description = "This page encountered an error."
}: PageErrorBoundaryProps) {
    return (
        <ErrorBoundary
            fallback={
                <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-900">
                    <div className="text-center max-w-lg">
                        <AppIcons.error size="2xl" variant="error" className="mx-auto mb-6" />

                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            {title}
                        </h1>

                        <p className="text-gray-600 dark:text-gray-400 mb-8">
                            {description}
                        </p>

                        <div className="space-y-4">
                            <Button
                                onClick={() => window.location.reload()}
                                className="w-full"
                            >
                                Reload Page
                            </Button>

                            <Button
                                variant="outline"
                                onClick={() => window.history.back()}
                                className="w-full"
                            >
                                Go Back
                            </Button>
                        </div>
                    </div>
                </div>
            }
        >
            {children}
        </ErrorBoundary>
    );
}