"use client";

import { useState, useCallback, useRef } from "react";
import { UseFormHook } from "@/types";

type ValidationRule<T> = {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any, values: T) => string | null;
};

type ValidationRules<T> = {
  [K in keyof T]?: ValidationRule<T>;
};

interface UseFormOptions<T> {
  initialValues: T;
  validationRules?: ValidationRules<T>;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  onSubmit?: (values: T) => void | Promise<void>;
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  validationRules = {},
  validateOnChange = false,
  validateOnBlur = true,
  onSubmit,
}: UseFormOptions<T>): UseFormHook<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<keyof T, string>>(
    {} as Record<keyof T, string>
  );
  const [touched, setTouched] = useState<Record<keyof T, boolean>>(
    {} as Record<keyof T, boolean>
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialValuesRef = useRef(initialValues);

  // Validate a single field
  const validateField = useCallback(
    (name: keyof T, value: any, allValues: T): string => {
      const rules = validationRules[name];
      if (!rules) return "";

      // Required validation
      if (
        rules.required &&
        (!value || (typeof value === "string" && value.trim() === ""))
      ) {
        return `${String(name)} is required`;
      }

      // Skip other validations if value is empty and not required
      if (!value || (typeof value === "string" && value.trim() === "")) {
        return "";
      }

      // Min length validation
      if (
        rules.minLength &&
        typeof value === "string" &&
        value.length < rules.minLength
      ) {
        return `${String(name)} must be at least ${rules.minLength} characters`;
      }

      // Max length validation
      if (
        rules.maxLength &&
        typeof value === "string" &&
        value.length > rules.maxLength
      ) {
        return `${String(name)} must be no more than ${
          rules.maxLength
        } characters`;
      }

      // Pattern validation
      if (
        rules.pattern &&
        typeof value === "string" &&
        !rules.pattern.test(value)
      ) {
        return `${String(name)} format is invalid`;
      }

      // Custom validation
      if (rules.custom) {
        const customError = rules.custom(value, allValues);
        if (customError) return customError;
      }

      return "";
    },
    [validationRules]
  );

  // Validate all fields
  const validateForm = useCallback(
    (formValues: T): Record<keyof T, string> => {
      const newErrors = {} as Record<keyof T, string>;

      Object.keys(validationRules).forEach((field) => {
        const fieldName = field as keyof T;
        const error = validateField(
          fieldName,
          formValues[fieldName],
          formValues
        );
        if (error) {
          newErrors[fieldName] = error;
        }
      });

      return newErrors;
    },
    [validateField, validationRules]
  );

  // Handle field change
  const handleChange = useCallback(
    (name: keyof T, value: any) => {
      const newValues = { ...values, [name]: value };
      setValues(newValues);

      if (validateOnChange) {
        const error = validateField(name, value, newValues);
        setErrors((prev) => ({ ...prev, [name]: error }));
      } else {
        // Clear error if field was previously invalid
        if (errors[name]) {
          setErrors((prev) => ({ ...prev, [name]: "" }));
        }
      }
    },
    [values, validateOnChange, validateField, errors]
  );

  // Handle field blur
  const handleBlur = useCallback(
    (name: keyof T) => {
      setTouched((prev) => ({ ...prev, [name]: true }));

      if (validateOnBlur) {
        const error = validateField(name, values[name], values);
        setErrors((prev) => ({ ...prev, [name]: error }));
      }
    },
    [values, validateOnBlur, validateField]
  );

  // Handle form submission
  const handleSubmit = useCallback(
    async (submitHandler?: (values: T) => void | Promise<void>) => {
      const handler = submitHandler || onSubmit;
      if (!handler) {
        console.warn("No submit handler provided");
        return;
      }

      setIsSubmitting(true);

      try {
        // Validate all fields
        const validationErrors = validateForm(values);
        setErrors(validationErrors);

        // Mark all fields as touched
        const allTouched = Object.keys(values).reduce((acc, key) => {
          acc[key as keyof T] = true;
          return acc;
        }, {} as Record<keyof T, boolean>);
        setTouched(allTouched);

        // Check if form is valid
        const hasErrors = Object.values(validationErrors).some(
          (error) => error !== ""
        );
        if (hasErrors) {
          return;
        }

        // Submit form
        await handler(values);
      } catch (error) {
        console.error("Form submission error:", error);
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validateForm, onSubmit]
  );

  // Reset form
  const reset = useCallback(() => {
    setValues(initialValuesRef.current);
    setErrors({} as Record<keyof T, string>);
    setTouched({} as Record<keyof T, boolean>);
    setIsSubmitting(false);
  }, []);

  // Check if form is valid
  const isValid =
    Object.values(errors).every((error) => !error) &&
    Object.keys(validationRules).every(
      (field) =>
        !validateField(field as keyof T, values[field as keyof T], values)
    );

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    isValid,
    isSubmitting,
  };
}

// Commonly used validation rules
export const validationRules = {
  required: (message?: string): ValidationRule<any> => ({
    required: true,
    custom: (value: any) => {
      if (!value || (typeof value === "string" && value.trim() === "")) {
        return message || "This field is required";
      }
      return null;
    },
  }),

  email: (message?: string): ValidationRule<any> => ({
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    custom: (value: string) => {
      if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return message || "Please enter a valid email address";
      }
      return null;
    },
  }),

  minLength: (min: number, message?: string): ValidationRule<any> => ({
    minLength: min,
    custom: (value: string) => {
      if (value && value.length < min) {
        return message || `Must be at least ${min} characters`;
      }
      return null;
    },
  }),

  maxLength: (max: number, message?: string): ValidationRule<any> => ({
    maxLength: max,
    custom: (value: string) => {
      if (value && value.length > max) {
        return message || `Must be no more than ${max} characters`;
      }
      return null;
    },
  }),

  pattern: (regex: RegExp, message?: string): ValidationRule<any> => ({
    pattern: regex,
    custom: (value: string) => {
      if (value && !regex.test(value)) {
        return message || "Invalid format";
      }
      return null;
    },
  }),

  url: (message?: string): ValidationRule<any> => ({
    custom: (value: string) => {
      if (value) {
        try {
          new URL(value);
        } catch {
          return message || "Please enter a valid URL";
        }
      }
      return null;
    },
  }),

  number: (message?: string): ValidationRule<any> => ({
    custom: (value: any) => {
      if (value && isNaN(Number(value))) {
        return message || "Must be a valid number";
      }
      return null;
    },
  }),

  integer: (message?: string): ValidationRule<any> => ({
    custom: (value: any) => {
      if (
        value &&
        (!Number.isInteger(Number(value)) ||
          Number(value) !== Math.floor(Number(value)))
      ) {
        return message || "Must be a whole number";
      }
      return null;
    },
  }),

  min: (minimum: number, message?: string): ValidationRule<any> => ({
    custom: (value: any) => {
      if (value && Number(value) < minimum) {
        return message || `Must be at least ${minimum}`;
      }
      return null;
    },
  }),

  max: (maximum: number, message?: string): ValidationRule<any> => ({
    custom: (value: any) => {
      if (value && Number(value) > maximum) {
        return message || `Must be no more than ${maximum}`;
      }
      return null;
    },
  }),

  match: (fieldName: string, message?: string): ValidationRule<any> => ({
    custom: (value: any, values: any) => {
      if (value && value !== values[fieldName]) {
        return message || `Must match ${fieldName}`;
      }
      return null;
    },
  }),
};
