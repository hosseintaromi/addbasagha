'use client'

import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

const iconVariants = cva(
    "inline-flex items-center justify-center",
    {
        variants: {
            size: {
                xs: "w-3 h-3",
                sm: "w-4 h-4",
                md: "w-5 h-5",
                lg: "w-6 h-6",
                xl: "w-8 h-8",
                "2xl": "w-10 h-10",
            },
            variant: {
                default: "text-current",
                primary: "text-blue-600 dark:text-blue-400",
                secondary: "text-gray-600 dark:text-gray-400",
                success: "text-green-600 dark:text-green-400",
                warning: "text-yellow-600 dark:text-yellow-400",
                error: "text-red-600 dark:text-red-400",
                muted: "text-gray-400 dark:text-gray-500",
            },
        },
        defaultVariants: {
            size: "md",
            variant: "default",
        },
    }
);

interface IconProps extends VariantProps<typeof iconVariants> {
    name: keyof typeof LucideIcons;
    className?: string;
    strokeWidth?: number;
}

export const Icon = forwardRef<SVGSVGElement, IconProps>(
    ({ name, size, variant, className, strokeWidth = 2, ...props }, ref) => {
        const IconComponent = LucideIcons[name] as LucideIcon;

        if (!IconComponent) {
            console.warn(`Icon "${name}" not found in Lucide icons`);
            return null;
        }

        return (
            <IconComponent
                ref={ref}
                className={cn(iconVariants({ size, variant }), className)}
                strokeWidth={strokeWidth}
                {...props}
            />
        );
    }
);

Icon.displayName = "Icon";

// Custom app icons
export const AppIcons = {
    // Brand icons
    logo: (props: Omit<IconProps, 'name'>) => (
        <div className={cn(iconVariants(props), "bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg text-white font-bold")}>
            A
        </div>
    ),

    // Video editing icons
    play: (props: Omit<IconProps, 'name'>) => <Icon name="Play" {...props} />,
    pause: (props: Omit<IconProps, 'name'>) => <Icon name="Pause" {...props} />,
    stop: (props: Omit<IconProps, 'name'>) => <Icon name="Square" {...props} />,
    skipForward: (props: Omit<IconProps, 'name'>) => <Icon name="SkipForward" {...props} />,
    skipBack: (props: Omit<IconProps, 'name'>) => <Icon name="SkipBack" {...props} />,
    volume: (props: Omit<IconProps, 'name'>) => <Icon name="Volume2" {...props} />,
    volumeOff: (props: Omit<IconProps, 'name'>) => <Icon name="VolumeX" {...props} />,
    fullscreen: (props: Omit<IconProps, 'name'>) => <Icon name="Maximize" {...props} />,
    exitFullscreen: (props: Omit<IconProps, 'name'>) => <Icon name="Minimize" {...props} />,

    // Timeline icons
    timeline: (props: Omit<IconProps, 'name'>) => <Icon name="Clock" {...props} />,
    cut: (props: Omit<IconProps, 'name'>) => <Icon name="Scissors" {...props} />,
    split: (props: Omit<IconProps, 'name'>) => <Icon name="Split" {...props} />,
    merge: (props: Omit<IconProps, 'name'>) => <Icon name="Merge" {...props} />,
    trim: (props: Omit<IconProps, 'name'>) => <Icon name="Crop" {...props} />,

    // Text and subtitle icons
    text: (props: Omit<IconProps, 'name'>) => <Icon name="Type" {...props} />,
    subtitle: (props: Omit<IconProps, 'name'>) => <Icon name="Subtitles" {...props} />,
    translate: (props: Omit<IconProps, 'name'>) => <Icon name="Languages" {...props} />,
    microphone: (props: Omit<IconProps, 'name'>) => <Icon name="Mic" {...props} />,
    speaker: (props: Omit<IconProps, 'name'>) => <Icon name="Speaker" {...props} />,

    // File and media icons
    upload: (props: Omit<IconProps, 'name'>) => <Icon name="Upload" {...props} />,
    download: (props: Omit<IconProps, 'name'>) => <Icon name="Download" {...props} />,
    file: (props: Omit<IconProps, 'name'>) => <Icon name="File" {...props} />,
    video: (props: Omit<IconProps, 'name'>) => <Icon name="Video" {...props} />,
    audio: (props: Omit<IconProps, 'name'>) => <Icon name="AudioLines" {...props} />,
    image: (props: Omit<IconProps, 'name'>) => <Icon name="Image" {...props} />,

    // UI icons
    menu: (props: Omit<IconProps, 'name'>) => <Icon name="Menu" {...props} />,
    close: (props: Omit<IconProps, 'name'>) => <Icon name="X" {...props} />,
    chevronLeft: (props: Omit<IconProps, 'name'>) => <Icon name="ChevronLeft" {...props} />,
    chevronRight: (props: Omit<IconProps, 'name'>) => <Icon name="ChevronRight" {...props} />,
    chevronUp: (props: Omit<IconProps, 'name'>) => <Icon name="ChevronUp" {...props} />,
    chevronDown: (props: Omit<IconProps, 'name'>) => <Icon name="ChevronDown" {...props} />,
    plus: (props: Omit<IconProps, 'name'>) => <Icon name="Plus" {...props} />,
    minus: (props: Omit<IconProps, 'name'>) => <Icon name="Minus" {...props} />,
    edit: (props: Omit<IconProps, 'name'>) => <Icon name="Edit" {...props} />,
    trash: (props: Omit<IconProps, 'name'>) => <Icon name="Trash2" {...props} />,
    copy: (props: Omit<IconProps, 'name'>) => <Icon name="Copy" {...props} />,
    duplicate: (props: Omit<IconProps, 'name'>) => <Icon name="Copy" {...props} />,

    // Status icons
    loading: (props: Omit<IconProps, 'name'>) => <Icon name="Loader2" {...props} />,
    check: (props: Omit<IconProps, 'name'>) => <Icon name="Check" {...props} />,
    warning: (props: Omit<IconProps, 'name'>) => <Icon name="AlertTriangle" {...props} />,
    error: (props: Omit<IconProps, 'name'>) => <Icon name="AlertCircle" {...props} />,
    info: (props: Omit<IconProps, 'name'>) => <Icon name="Info" {...props} />,
    success: (props: Omit<IconProps, 'name'>) => <Icon name="CheckCircle" {...props} />,

    // Settings and preferences
    settings: (props: Omit<IconProps, 'name'>) => <Icon name="Settings" {...props} />,
    preferences: (props: Omit<IconProps, 'name'>) => <Icon name="Sliders" {...props} />,
    theme: (props: Omit<IconProps, 'name'>) => <Icon name="Palette" {...props} />,
    language: (props: Omit<IconProps, 'name'>) => <Icon name="Globe" {...props} />,

    // Social and sharing
    share: (props: Omit<IconProps, 'name'>) => <Icon name="Share2" {...props} />,
    link: (props: Omit<IconProps, 'name'>) => <Icon name="Link" {...props} />,
    external: (props: Omit<IconProps, 'name'>) => <Icon name="ExternalLink" {...props} />,

    // User and account
    user: (props: Omit<IconProps, 'name'>) => <Icon name="User" {...props} />,
    users: (props: Omit<IconProps, 'name'>) => <Icon name="Users" {...props} />,
    profile: (props: Omit<IconProps, 'name'>) => <Icon name="UserCircle" {...props} />,
    logout: (props: Omit<IconProps, 'name'>) => <Icon name="LogOut" {...props} />,
    login: (props: Omit<IconProps, 'name'>) => <Icon name="LogIn" {...props} />,

    // Project and workspace
    folder: (props: Omit<IconProps, 'name'>) => <Icon name="Folder" {...props} />,
    project: (props: Omit<IconProps, 'name'>) => <Icon name="FolderOpen" {...props} />,
    workspace: (props: Omit<IconProps, 'name'>) => <Icon name="Layout" {...props} />,
    dashboard: (props: Omit<IconProps, 'name'>) => <Icon name="LayoutDashboard" {...props} />,

    // Export and render
    export: (props: Omit<IconProps, 'name'>) => <Icon name="FileDown" {...props} />,
    render: (props: Omit<IconProps, 'name'>) => <Icon name="Clapperboard" {...props} />,
    publish: (props: Omit<IconProps, 'name'>) => <Icon name="Send" {...props} />,
} as const;

// Icon button component
interface IconButtonProps extends VariantProps<typeof iconVariants> {
    icon: keyof typeof AppIcons;
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
    'aria-label'?: string;
    title?: string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
    ({ icon, size, variant, onClick, disabled, className, ...props }, ref) => {
        const IconComponent = AppIcons[icon];

        return (
            <button
                ref={ref}
                onClick={onClick}
                disabled={disabled}
                className={cn(
                    "inline-flex items-center justify-center rounded-md p-1 transition-colors",
                    "hover:bg-gray-100 dark:hover:bg-gray-800",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    className
                )}
                {...props}
            >
                <IconComponent size={size} variant={variant} />
            </button>
        );
    }
);

IconButton.displayName = "IconButton";

export { iconVariants };