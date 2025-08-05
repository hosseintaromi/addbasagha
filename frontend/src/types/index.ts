// Core types and interfaces for the application

import { ReactNode, ButtonHTMLAttributes, InputHTMLAttributes } from "react";

// Base component props
export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
  id?: string;
}

// Theme types
export type ThemeMode = "light" | "dark";
export type Language =
  | "en"
  | "fa"
  | "ar"
  | "es"
  | "fr"
  | "de"
  | "it"
  | "pt"
  | "ru"
  | "zh"
  | "ja"
  | "ko";

// Size variants
export type Size = "xs" | "sm" | "md" | "lg" | "xl";
export type ButtonSize = "sm" | "md" | "lg";
export type InputSize = "sm" | "md" | "lg";

// Color variants
export type ColorVariant =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "error"
  | "info";
export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "destructive";

// Loading states
export interface LoadingState {
  isLoading: boolean;
  error?: string | null;
  data?: any;
}

// API response types
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  success: boolean;
  message?: string;
}

// Video editing types
export interface VideoFile {
  id: string;
  name: string;
  url: string;
  duration: number;
  size: number;
  format: string;
  thumbnail?: string;
}

export interface Subtitle {
  id: string;
  text: string;
  startTime: number;
  endTime: number;
  position: {
    x: number;
    y: number;
  };
  style: {
    fontSize: number;
    color: string;
    backgroundColor?: string;
    fontFamily: string;
    fontWeight?: string;
    textAlign?: "left" | "center" | "right";
  };
}

export interface TextOverlay {
  id: string;
  text: string;
  startTime: number;
  endTime: number;
  left?: number;
  top?: number;
  fontSize?: number;
  color?: string;
  fontFamily?: string;
  fontWeight?: string;
  align?: "left" | "center" | "right";
  scaleX?: number;
  scaleY?: number;
  angle?: number;
  opacity?: number;
  animation?: "none" | "fade-in" | "slide-up" | "scale-in" | "bounce-in";
  shadow?: boolean;
  stroke?: string;
  strokeWidth?: number;
  selectable?: boolean;
  moveable?: boolean;
  resizable?: boolean;
}

// Timeline types
export interface TimelineTrack {
  id: string;
  name: string;
  type: "video" | "audio" | "subtitle" | "text";
  enabled: boolean;
  locked: boolean;
  height: number;
  items: TimelineItem[];
}

export interface TimelineItem {
  id: string;
  startTime: number;
  endTime: number;
  trackId: string;
  type: string;
  data: any;
}

// Form types
export interface FormFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  help?: string;
}

// Button component props
export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    BaseComponentProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  isDisabled?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

// Input component props
export interface InputProps
  extends InputHTMLAttributes<HTMLInputElement>,
    BaseComponentProps,
    FormFieldProps {
  size?: InputSize;
  variant?: "outline" | "filled" | "ghost";
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

// Modal props
export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: Size;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
}

// Toast types
export type ToastType = "success" | "error" | "warning" | "info";
export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Project types
export interface Project {
  id: string;
  name: string;
  description?: string;
  thumbnail?: string;
  duration: number;
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
  ownerId: string;
  settings: ProjectSettings;
}

export interface ProjectSettings {
  aspectRatio: string;
  resolution: {
    width: number;
    height: number;
  };
  frameRate: number;
  quality: "low" | "medium" | "high" | "ultra";
}

// User types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  plan: "free" | "pro" | "enterprise";
  createdAt: string;
}

// Export types
export interface ExportSettings {
  format: "mp4" | "webm" | "mov" | "gif";
  quality: "low" | "medium" | "high" | "ultra";
  resolution: string;
  frameRate: number;
  compression: number;
  includeSubtitles: boolean;
  watermark: boolean;
}

// API service types
export interface TranscriptionOptions {
  language?: string;
  model?: "whisper-1" | "whisper-large" | "base";
  temperature?: number;
}

export interface TranslationOptions {
  sourceLanguage: string;
  targetLanguage: string;
  model?: string;
}

export interface DubbingOptions {
  language: string;
  voice: string;
  speed: number;
  pitch: number;
}

// Hook return types
export interface UseApiHook<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface UseFormHook<T> {
  values: T;
  errors: Record<keyof T, string>;
  touched: Record<keyof T, boolean>;
  handleChange: (name: keyof T, value: any) => void;
  handleBlur: (name: keyof T) => void;
  handleSubmit: (
    onSubmit: (values: T) => void | Promise<void>
  ) => Promise<void>;
  reset: () => void;
  isValid: boolean;
  isSubmitting: boolean;
}

// Context types
export interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

export interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

// Store types (Zustand)
export interface SubtitleStore {
  subtitles: Subtitle[];
  addSubtitle: (subtitle: Subtitle) => void;
  updateSubtitle: (id: string, updates: Partial<Subtitle>) => void;
  removeSubtitle: (id: string) => void;
  setSubtitles: (subtitles: Subtitle[]) => void;
  clearSubtitles: () => void;
}

export interface TextStore {
  texts: TextOverlay[];
  addText: (text: TextOverlay) => void;
  updateText: (id: string, updates: Partial<TextOverlay>) => void;
  removeText: (id: string) => void;
  setTexts: (texts: TextOverlay[]) => void;
  clearTexts: () => void;
}

export interface ProjectStore {
  currentProject: Project | null;
  projects: Project[];
  setCurrentProject: (project: Project) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  removeProject: (id: string) => void;
  setProjects: (projects: Project[]) => void;
}

// Component ref types
export interface TimelineRef {
  seek: (time: number) => void;
  play: () => void;
  pause: () => void;
  getCurrentTime: () => number;
  getDuration: () => number;
}

export interface WaveformRef {
  load: (url: string) => Promise<void>;
  play: () => void;
  pause: () => void;
  seek: (time: number) => void;
  setZoom: (zoom: number) => void;
  getCurrentTime: () => number;
}
