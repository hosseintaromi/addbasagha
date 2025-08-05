'use client'

import { useState } from 'react';
import Link from 'next/link';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { BaseComponentProps } from '@/types';
import { Container } from './Container';
import { Button } from '@/components/ui/Button';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const headerVariants = cva(
    "w-full border-b backdrop-blur-sm transition-all duration-200",
    {
        variants: {
            variant: {
                default: "bg-white/95 dark:bg-gray-900/95 border-gray-200 dark:border-gray-800",
                transparent: "bg-transparent border-transparent",
                solid: "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800",
            },
            size: {
                sm: "h-12",
                md: "h-16",
                lg: "h-20",
            },
            sticky: {
                true: "sticky top-0 z-40",
                false: "relative",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "md",
            sticky: true,
        },
    }
);

interface HeaderProps
    extends BaseComponentProps,
    VariantProps<typeof headerVariants> {
    logo?: React.ReactNode;
    navigation?: React.ReactNode;
    actions?: React.ReactNode;
    mobileMenuContent?: React.ReactNode;
}

export function Header({
    logo,
    navigation,
    actions,
    mobileMenuContent,
    variant,
    size,
    sticky,
    className,
    children,
    ...props
}: HeaderProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { isRTL } = useLanguage();

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    return (
        <header
            className={cn(headerVariants({ variant, size, sticky }), className)}
            {...props}
        >
            <Container size="full" padding="md">
                <div className={cn(
                    "flex h-full items-center justify-between",
                    isRTL && "flex-row-reverse"
                )}>
                    {/* Logo */}
                    <div className="flex items-center">
                        {logo}
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        {navigation}
                    </nav>

                    {/* Actions */}
                    <div className={cn(
                        "flex items-center gap-2",
                        isRTL && "flex-row-reverse"
                    )}>
                        {actions}

                        {/* Mobile menu button */}
                        {(navigation || mobileMenuContent) && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={toggleMobileMenu}
                                className="md:hidden h-8 w-8 p-0"
                            >
                                {isMobileMenuOpen ? (
                                    <X className="h-4 w-4" />
                                ) : (
                                    <Menu className="h-4 w-4" />
                                )}
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        )}
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (navigation || mobileMenuContent) && (
                    <div className="md:hidden mt-4 pb-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="pt-4 space-y-2">
                            {mobileMenuContent || navigation}
                        </div>
                    </div>
                )}
            </Container>

            {children}
        </header>
    );
}

// Specialized header components
interface AppHeaderProps {
    className?: string;
}

export function AppHeader({ className }: AppHeaderProps) {
    const { isRTL } = useLanguage();

    const logo = (
        <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                A
            </div>
            <span className="font-bold text-xl text-gray-900 dark:text-white">
                ABBASAGHA
            </span>
        </Link>
    );

    const navigation = (
        <>
            <Link
                href="/dashboard"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
            >
                Dashboard
            </Link>
            <Link
                href="/create"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
            >
                Create
            </Link>
            <Link
                href="/timeline"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
            >
                Timeline
            </Link>
        </>
    );

    const actions = (
        <div className={cn(
            "flex items-center gap-2",
            isRTL && "flex-row-reverse"
        )}>
            <Button variant="ghost" size="sm">
                Sign In
            </Button>
            <Button size="sm">
                Get Started
            </Button>
        </div>
    );

    return (
        <Header
            logo={logo}
            navigation={navigation}
            actions={actions}
            className={className}
        />
    );
}

interface DashboardHeaderProps {
    title?: string;
    actions?: React.ReactNode;
    className?: string;
}

export function DashboardHeader({ title, actions, className }: DashboardHeaderProps) {
    const { isRTL } = useLanguage();

    const logo = (
        <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                A
            </div>
            <span className="font-bold text-xl text-gray-900 dark:text-white">
                ABBASAGHA
            </span>
        </Link>
    );

    return (
        <Header
            logo={logo}
            actions={actions}
            variant="solid"
            className={className}
        >
            {title && (
                <Container size="full" padding="md">
                    <div className="py-4 border-t border-gray-200 dark:border-gray-700">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {title}
                        </h1>
                    </div>
                </Container>
            )}
        </Header>
    );
}

export { headerVariants };