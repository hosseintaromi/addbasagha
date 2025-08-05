'use client'

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/Input';
import { FormFieldProps } from '@/types';

export interface FormFieldPropsExtended extends FormFieldProps {
    className?: string;
    children?: React.ReactNode;
    description?: string;
    showOptional?: boolean;
}

export const FormField = forwardRef<HTMLDivElement, FormFieldPropsExtended>(
    ({
        name,
        label,
        placeholder,
        required,
        disabled,
        error,
        help,
        description,
        showOptional = true,
        className,
        children,
        ...props
    }, ref) => {
        const fieldId = name;
        const hasError = !!error;

        return (
            <div ref={ref} className={cn("space-y-2", className)} {...props}>
                {/* Label */}
                {label && (
                    <label
                        htmlFor={fieldId}
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        {label}
                        {required && <span className="ml-1 text-red-500">*</span>}
                        {!required && showOptional && (
                            <span className="ml-1 text-gray-400 text-xs font-normal">(optional)</span>
                        )}
                    </label>
                )}

                {/* Description */}
                {description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {description}
                    </p>
                )}

                {/* Field Content */}
                <div className="relative">
                    {children}
                </div>

                {/* Error Message */}
                {hasError && (
                    <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        {error}
                    </p>
                )}

                {/* Help Text */}
                {help && !hasError && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {help}
                    </p>
                )}
            </div>
        );
    }
);

FormField.displayName = "FormField";

// Specialized form fields
interface TextFieldProps extends Omit<FormFieldPropsExtended, 'children'> {
    type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'search';
    value?: string;
    onChange?: (value: string) => void;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    autoComplete?: string;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
    ({
        type = 'text',
        value,
        onChange,
        leftIcon,
        rightIcon,
        autoComplete,
        ...props
    }, ref) => {
        return (
            <FormField {...props}>
                <Input
                    ref={ref}
                    type={type}
                    value={value}
                    onChange={(e) => onChange?.(e.target.value)}
                    leftIcon={leftIcon}
                    rightIcon={rightIcon}
                    autoComplete={autoComplete}
                    placeholder={props.placeholder}
                    disabled={props.disabled}
                    error={props.error}
                />
            </FormField>
        );
    }
);

TextField.displayName = "TextField";

// Textarea field
interface TextareaFieldProps extends Omit<FormFieldPropsExtended, 'children'> {
    value?: string;
    onChange?: (value: string) => void;
    rows?: number;
    resize?: boolean;
    maxLength?: number;
    showCharCount?: boolean;
}

export const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
    ({
        value = '',
        onChange,
        rows = 4,
        resize = true,
        maxLength,
        showCharCount = false,
        ...props
    }, ref) => {
        const charCount = value.length;
        const isOverLimit = maxLength && charCount > maxLength;

        return (
            <FormField {...props}>
                <div className="relative">
                    <textarea
                        ref={ref}
                        id={props.name}
                        value={value}
                        onChange={(e) => onChange?.(e.target.value)}
                        rows={rows}
                        maxLength={maxLength}
                        disabled={props.disabled}
                        placeholder={props.placeholder}
                        className={cn(
                            "block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm",
                            "placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
                            "disabled:cursor-not-allowed disabled:opacity-50",
                            "dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-400",
                            !resize && "resize-none",
                            props.error && "border-red-500 focus:border-red-500 focus:ring-red-500"
                        )}
                    />

                    {(showCharCount || maxLength) && (
                        <div className={cn(
                            "absolute bottom-2 right-2 text-xs",
                            isOverLimit ? "text-red-500" : "text-gray-400"
                        )}>
                            {maxLength ? `${charCount}/${maxLength}` : charCount}
                        </div>
                    )}
                </div>
            </FormField>
        );
    }
);

TextareaField.displayName = "TextareaField";

// Select field
interface SelectFieldProps extends Omit<FormFieldPropsExtended, 'children'> {
    value?: string;
    onChange?: (value: string) => void;
    options: Array<{ value: string; label: string; disabled?: boolean }>;
    placeholder?: string;
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
    ({
        value,
        onChange,
        options,
        placeholder = "Select an option...",
        ...props
    }, ref) => {
        return (
            <FormField {...props}>
                <select
                    ref={ref}
                    id={props.name}
                    value={value || ''}
                    onChange={(e) => onChange?.(e.target.value)}
                    disabled={props.disabled}
                    className={cn(
                        "block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm",
                        "focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
                        "disabled:cursor-not-allowed disabled:opacity-50",
                        "dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100",
                        props.error && "border-red-500 focus:border-red-500 focus:ring-red-500"
                    )}
                >
                    {placeholder && (
                        <option value="" disabled>
                            {placeholder}
                        </option>
                    )}
                    {options.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                            disabled={option.disabled}
                        >
                            {option.label}
                        </option>
                    ))}
                </select>
            </FormField>
        );
    }
);

SelectField.displayName = "SelectField";

// Checkbox field
interface CheckboxFieldProps extends Omit<FormFieldPropsExtended, 'children'> {
    checked?: boolean;
    onChange?: (checked: boolean) => void;
    indeterminate?: boolean;
}

export const CheckboxField = forwardRef<HTMLInputElement, CheckboxFieldProps>(
    ({
        checked = false,
        onChange,
        indeterminate = false,
        label,
        ...props
    }, ref) => {
        return (
            <FormField {...props} label="">
                <div className="flex items-center gap-2">
                    <input
                        ref={ref}
                        type="checkbox"
                        id={props.name}
                        checked={checked}
                        onChange={(e) => onChange?.(e.target.checked)}
                        disabled={props.disabled}
                        className={cn(
                            "h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500",
                            "disabled:cursor-not-allowed disabled:opacity-50",
                            "dark:border-gray-600 dark:bg-gray-800",
                            props.error && "border-red-500 focus:ring-red-500"
                        )}
                    />
                    {label && (
                        <label
                            htmlFor={props.name}
                            className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
                        >
                            {label}
                            {props.required && <span className="ml-1 text-red-500">*</span>}
                        </label>
                    )}
                </div>
            </FormField>
        );
    }
);

CheckboxField.displayName = "CheckboxField";