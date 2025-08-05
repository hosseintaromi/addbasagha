# 🏗️ Component Architecture Guide

## 📋 Overview

This document outlines the component-based architecture implemented for the ABBASAGHA video editing platform. The architecture is designed to be scalable, maintainable, and developer-friendly.

## 🗂️ Project Structure

```
src/
├── components/
│   ├── ui/                 # Core UI components
│   ├── layout/             # Layout components
│   ├── forms/              # Form components
│   ├── icons/              # Icon system
│   ├── compound/           # Compound components
│   ├── optimized/          # Performance-optimized components
│   └── timeline/           # Timeline-specific components
├── hooks/                  # Custom hooks
├── contexts/               # React contexts
├── types/                  # TypeScript definitions
├── design/                 # Design system tokens
├── lib/                    # Utilities and configs
└── store/                  # State management
```

## 🎨 Design System

### Design Tokens

```typescript
import { tokens, colors, spacing } from "@/design/tokens";

// Usage in components
const styles = {
  padding: tokens.spacing[4], // 1rem
  color: tokens.colors.primary[600],
  borderRadius: tokens.borderRadius.md,
};
```

### Color System

- **Primary**: Blue tones for main actions
- **Secondary**: Cyan tones for secondary actions
- **Semantic**: Success (green), Warning (yellow), Error (red), Info (blue)
- **Neutral**: Gray scale for text and backgrounds

## 🧩 Component Library

### Core UI Components

#### Button

```tsx
import { Button } from "@/components/ui";

<Button variant="primary" size="md" isLoading={false}>
  Click me
</Button>;
```

Variants: `primary` | `secondary` | `outline` | `ghost` | `destructive`
Sizes: `sm` | `md` | `lg`

#### Input

```tsx
import { Input } from "@/components/ui";

<Input
  label="Email"
  type="email"
  placeholder="Enter your email"
  error="Invalid email"
  leftIcon={<EmailIcon />}
/>;
```

#### Modal

```tsx
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@/components/ui";

<Modal isOpen={isOpen} onClose={onClose} size="md">
  <ModalHeader>Title</ModalHeader>
  <ModalBody>Content</ModalBody>
  <ModalFooter>
    <Button onClick={onClose}>Close</Button>
  </ModalFooter>
</Modal>;
```

### Form Components

#### TextField

```tsx
import { TextField } from "@/components/forms/FormField";

<TextField
  name="username"
  label="Username"
  required
  placeholder="Enter username"
  error={errors.username}
  help="Choose a unique username"
/>;
```

#### Form with Validation

```tsx
import { useForm, validationRules } from "@/hooks/useForm";

const { values, errors, handleChange, handleSubmit } = useForm({
  initialValues: { email: "", password: "" },
  validationRules: {
    email: validationRules.email(),
    password: validationRules.minLength(8),
  },
});
```

### Layout Components

#### Container

```tsx
import { Container, PageContainer } from "@/components/ui";

<Container size="xl" padding="md">
  <PageContainer>{/* Page content */}</PageContainer>
</Container>;
```

#### Header

```tsx
import { AppHeader, DashboardHeader } from '@/components/ui';

<AppHeader />
// or
<DashboardHeader title="Dashboard" actions={<Button>New</Button>} />
```

### Compound Components

#### Accordion

```tsx
import { Accordion } from "@/components/compound/Accordion";

<Accordion type="single" defaultValue="item-1">
  <Accordion.Item value="item-1">
    <Accordion.Trigger>Section 1</Accordion.Trigger>
    <Accordion.Content>Content 1</Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="item-2">
    <Accordion.Trigger>Section 2</Accordion.Trigger>
    <Accordion.Content>Content 2</Accordion.Content>
  </Accordion.Item>
</Accordion>;
```

#### Tabs

```tsx
import { Tabs } from "@/components/compound/Tabs";

<Tabs defaultValue="tab1">
  <Tabs.List>
    <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
    <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="tab1">Content 1</Tabs.Content>
  <Tabs.Content value="tab2">Content 2</Tabs.Content>
</Tabs>;
```

## 🪝 Custom Hooks

### API Hooks

#### useApi

```tsx
import { useApi } from "@/hooks/useApi";

const api = useApi(fetchUserData, {
  onSuccess: (data) => console.log("Success:", data),
  onError: (error) => console.error("Error:", error),
  retryCount: 3,
});

// Execute API call
const handleFetch = () => api.execute(userId);
```

#### useApiGet

```tsx
import { useApiGet } from "@/hooks/useApi";

const { data, isLoading, error } = useApiGet("/api/users", {
  dependencies: [userId],
  enabled: !!userId,
});
```

### Performance Hooks

#### useDebounce

```tsx
import { useDebounce } from "@/hooks/usePerformance";

const [searchTerm, setSearchTerm] = useState("");
const debouncedSearchTerm = useDebounce(searchTerm, 300);

useEffect(() => {
  if (debouncedSearchTerm) {
    // Perform search
  }
}, [debouncedSearchTerm]);
```

#### useVirtualList

```tsx
import { useVirtualList } from "@/hooks/usePerformance";

const { visibleItems, totalHeight, offsetY, handleScroll } = useVirtualList({
  items: largeDataset,
  itemHeight: 50,
  containerHeight: 400,
});
```

## 🔧 Contexts and Providers

### Theme Context

```tsx
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";

// In app root
<ThemeProvider>
  <App />
</ThemeProvider>;

// In component
const { theme, setTheme, toggleTheme } = useTheme();
```

### Language Context

```tsx
import { LanguageProvider, useLanguage } from "@/contexts/LanguageContext";

const { language, setLanguage, t, isRTL } = useLanguage();

// Usage
<p>{t("welcome.message")}</p>;
```

### Toast Context

```tsx
import { ToastProvider, useToast } from "@/contexts/ToastContext";

const { success, error, warning, info } = useToast();

// Usage
const handleSuccess = () => {
  success("Operation completed!", "Your changes have been saved.");
};
```

## ⚡ Performance Optimizations

### Memoized Components

```tsx
import {
  OptimizedList,
  HeavyComputation,
} from "@/components/optimized/OptimizedComponents";

<OptimizedList
  items={data}
  renderItem={(item) => <ItemComponent item={item} />}
  keyExtractor={(item) => item.id}
/>;
```

### Performance Monitoring

```tsx
import { withPerformanceMonitoring } from "@/components/optimized/OptimizedComponents";

const OptimizedComponent = withPerformanceMonitoring(
  MyComponent,
  "MyComponent"
);
```

### Lazy Loading

```tsx
import { OptimizedImage } from "@/components/optimized/OptimizedComponents";

<OptimizedImage
  src="/large-image.jpg"
  alt="Description"
  lazy={true}
  placeholder="/placeholder.jpg"
/>;
```

## 🛡️ Error Handling

### Error Boundaries

```tsx
import { ErrorBoundary, PageErrorBoundary } from '@/components/ui';

// Component level
<ErrorBoundary
  fallback={<div>Something went wrong</div>}
  onError={(error) => logError(error)}
>
  <MyComponent />
</ErrorBoundary>

// Page level
<PageErrorBoundary title="Page Error">
  <PageContent />
</PageErrorBoundary>
```

### Form Error Handling

```tsx
const { values, errors, handleSubmit } = useForm({
  initialValues,
  validationRules: {
    email: validationRules.required("Email is required"),
  },
  onSubmit: async (values) => {
    try {
      await submitForm(values);
    } catch (error) {
      // Handle submission error
    }
  },
});
```

## 📱 Responsive Design

### Breakpoints

```tsx
// Design tokens include responsive breakpoints
const breakpoints = {
  sm: "640px", // Mobile
  md: "768px", // Tablet
  lg: "1024px", // Desktop
  xl: "1280px", // Large desktop
  "2xl": "1536px", // Extra large
};
```

### Mobile-First Components

```tsx
// All components are mobile-first responsive
<Button className="w-full sm:w-auto">
  Responsive Button
</Button>

<Container className="px-4 sm:px-6 lg:px-8">
  Responsive Container
</Container>
```

## 🧪 Testing Strategy

### Component Testing

```tsx
import { render, screen } from "@testing-library/react";
import { Button } from "@/components/ui";

test("renders button with text", () => {
  render(<Button>Click me</Button>);
  expect(screen.getByRole("button")).toHaveTextContent("Click me");
});
```

### Hook Testing

```tsx
import { renderHook, act } from "@testing-library/react";
import { useForm } from "@/hooks/useForm";

test("form validation works", () => {
  const { result } = renderHook(() =>
    useForm({
      initialValues: { email: "" },
      validationRules: { email: validationRules.email() },
    })
  );

  act(() => {
    result.current.handleChange("email", "invalid-email");
  });

  expect(result.current.errors.email).toBeTruthy();
});
```

## 📦 Build and Deployment

### Component Bundle Analysis

```bash
# Analyze bundle size
npm run build:analyze

# Check component tree shaking
npm run build:tree-shake
```

### Performance Monitoring

```tsx
// Built-in performance monitoring
import { usePerformanceMonitor } from "@/hooks/usePerformance";

const { measure } = usePerformanceMonitor("ComponentName");

const handleExpensiveOperation = () => {
  measure(() => {
    // Expensive operation
  });
};
```

## 🔄 State Management

### Zustand Stores

```tsx
import { create } from "zustand";

interface UserStore {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));
```

### Context for UI State

```tsx
// Use contexts for UI state that doesn't need persistence
const UIContext = createContext<UIState | null>(null);
```

## 🔧 Best Practices

### Component Design

1. **Single Responsibility**: Each component should have one clear purpose
2. **Composition over Inheritance**: Use compound components
3. **Props Interface**: Clear, typed props with good defaults
4. **Accessibility**: ARIA labels, keyboard navigation, screen reader support

### Performance

1. **Memoization**: Use React.memo for expensive components
2. **Lazy Loading**: Code splitting for large components
3. **Virtual Scrolling**: For large lists
4. **Debouncing**: For search inputs and API calls

### Code Organization

1. **Co-location**: Keep related code together
2. **Barrel Exports**: Use index files for clean imports
3. **TypeScript**: Strict typing for better DX
4. **Documentation**: JSDoc comments for complex components

## 🚀 Getting Started

1. **Install Dependencies**:

   ```bash
   npm install
   ```

2. **Start Development**:

   ```bash
   npm run dev
   ```

3. **Import Components**:

   ```tsx
   import { Button, Modal, useApi } from "@/components/ui";
   ```

4. **Follow Patterns**: Use existing components as reference
5. **Extend System**: Add new components following the established patterns

This architecture provides a solid foundation for building scalable, maintainable React applications with excellent developer experience and performance.
