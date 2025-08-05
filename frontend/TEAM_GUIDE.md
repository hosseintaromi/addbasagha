# 👥 Team Development Guide - ABBASAGHA

## 🎯 Quick Start for Team Members

Welcome to the ABBASAGHA video editing platform! This guide will help you get up and running quickly with our component-based architecture.

## 🚀 Setup Instructions

### 1. Clone and Install

```bash
git clone <repository-url>
cd vp/frontend
npm install
npm run dev
```

### 2. VS Code Extensions (Recommended)

- **ES7+ React/Redux/React-Native snippets**
- **Tailwind CSS IntelliSense**
- **TypeScript Importer**
- **Auto Rename Tag**
- **Bracket Pair Colorizer**

## 📁 File Structure You Need to Know

```
src/
├── components/ui/      # ✨ Ready-to-use UI components
├── hooks/             # 🪝 Custom hooks for logic
├── types/             # 📝 TypeScript definitions
├── contexts/          # 🌐 Global state (theme, language)
└── design/           # 🎨 Design tokens (colors, spacing)
```

## 🔥 Most Used Components

### 1. Basic UI Components

```tsx
import { Button, Input, Modal } from '@/components/ui';

// Button with all variants
<Button variant="primary" size="md" isLoading={loading}>
  Save Changes
</Button>

// Input with validation
<Input
  label="Email"
  type="email"
  error={errors.email}
  placeholder="your@email.com"
/>

// Modal
<Modal isOpen={showModal} onClose={closeModal}>
  <Modal.Header>Edit Profile</Modal.Header>
  <Modal.Body>
    {/* Content */}
  </Modal.Body>
  <Modal.Footer>
    <Button onClick={closeModal}>Cancel</Button>
    <Button variant="primary">Save</Button>
  </Modal.Footer>
</Modal>
```

### 2. Form Handling (Super Easy!)

```tsx
import { useForm, validationRules } from "@/hooks/useForm";
import { TextField } from "@/components/forms/FormField";

function MyForm() {
  const { values, errors, handleChange, handleSubmit } = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validationRules: {
      email: validationRules.email(),
      password: validationRules.minLength(8),
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        name="email"
        label="Email"
        value={values.email}
        onChange={(value) => handleChange("email", value)}
        error={errors.email}
      />
      <Button type="submit">Submit</Button>
    </form>
  );
}
```

### 3. API Calls (Zero Boilerplate!)

```tsx
import { useApiGet, useApiPost } from "@/hooks/useApi";

function UserProfile({ userId }) {
  // GET request with auto-loading states
  const { data: user, isLoading } = useApiGet(`/api/users/${userId}`);

  // POST request
  const updateUser = useApiPost("/api/users/update", {
    onSuccess: () => toast.success("User updated!"),
    onError: (error) => toast.error(error),
  });

  const handleUpdate = (userData) => {
    updateUser.execute(userData);
  };

  if (isLoading) return <Loading />;

  return (
    <div>
      <h1>{user.name}</h1>
      <Button
        onClick={() => handleUpdate(user)}
        isLoading={updateUser.isLoading}
      >
        Update Profile
      </Button>
    </div>
  );
}
```

## 🎨 Theming and Styling

### Using Design Tokens

```tsx
import { tokens } from "@/design/tokens";

// In your CSS-in-JS or inline styles
const styles = {
  padding: tokens.spacing[4], // 1rem
  color: tokens.colors.primary[600], // Blue-600
  borderRadius: tokens.borderRadius.md, // 6px
};

// In Tailwind classes (recommended)
<div className="p-4 text-blue-600 rounded-md">Content</div>;
```

### Dark Mode Support

```tsx
import { useTheme } from "@/contexts/ThemeContext";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button onClick={toggleTheme}>{theme === "dark" ? "🌞" : "🌙"}</Button>
  );
}
```

### Multi-language Support

```tsx
import { useLanguage } from "@/contexts/LanguageContext";

function WelcomeMessage() {
  const { t, language, setLanguage } = useLanguage();

  return (
    <div>
      <h1>{t("welcome.title")}</h1>
      <p>{t("welcome.description")}</p>

      <Button onClick={() => setLanguage("fa")}>فارسی</Button>
    </div>
  );
}
```

## 📱 Responsive Design Made Easy

All components are mobile-first responsive:

```tsx
// Button that's full width on mobile, auto width on desktop
<Button className="w-full sm:w-auto">
  Responsive Button
</Button>

// Different padding on mobile vs desktop
<Container className="p-4 sm:p-6 lg:p-8">
  Responsive Container
</Container>

// Hide on mobile, show on desktop
<div className="hidden lg:block">
  Desktop Only Content
</div>
```

## 🔔 Notifications (Toast System)

```tsx
import { useToast } from "@/contexts/ToastContext";

function MyComponent() {
  const { success, error, warning, info } = useToast();

  const handleSuccess = () => {
    success("Success!", "Operation completed successfully");
  };

  const handleError = () => {
    error("Error!", "Something went wrong");
  };

  return (
    <div>
      <Button onClick={handleSuccess}>Show Success</Button>
      <Button onClick={handleError}>Show Error</Button>
    </div>
  );
}
```

## ⚡ Performance Tips

### 1. Lazy Loading Components

```tsx
import { lazy, Suspense } from "react";
import { Loading } from "@/components/ui";

const HeavyComponent = lazy(() => import("./HeavyComponent"));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <HeavyComponent />
    </Suspense>
  );
}
```

### 2. Debounced Search

```tsx
import { useDebounce } from "@/hooks/usePerformance";

function SearchInput() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (debouncedSearchTerm) {
      // Perform search
      searchAPI(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  return (
    <Input
      value={searchTerm}
      onChange={setSearchTerm}
      placeholder="Search..."
    />
  );
}
```

### 3. Virtual Lists for Large Data

```tsx
import { useVirtualList } from "@/hooks/usePerformance";

function LargeList({ items }) {
  const { visibleItems, totalHeight, offsetY, handleScroll } = useVirtualList({
    items,
    itemHeight: 50,
    containerHeight: 400,
  });

  return (
    <div style={{ height: 400, overflow: "auto" }} onScroll={handleScroll}>
      <div style={{ height: totalHeight, position: "relative" }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map(({ item, index }) => (
            <div key={index} style={{ height: 50 }}>
              {item.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

## 🛠️ Common Patterns

### 1. Loading States

```tsx
import { LoadingOverlay, Skeleton } from "@/components/ui";

// Overlay loading
<LoadingOverlay isLoading={isLoading}>
  <Content />
</LoadingOverlay>;

// Skeleton loading
{
  isLoading ? (
    <div className="space-y-4">
      <Skeleton height="2rem" />
      <Skeleton height="1rem" width="60%" />
      <Skeleton height="1rem" width="80%" />
    </div>
  ) : (
    <ActualContent />
  );
}
```

### 2. Error Handling

```tsx
import { ErrorBoundary } from "@/components/ui";

<ErrorBoundary
  fallback={<div>Something went wrong</div>}
  onError={(error) => console.error(error)}
>
  <MyComponent />
</ErrorBoundary>;
```

### 3. Compound Components

```tsx
import { Accordion, Tabs } from '@/components/compound';

// Accordion
<Accordion type="single">
  <Accordion.Item value="item-1">
    <Accordion.Trigger>What is ABBASAGHA?</Accordion.Trigger>
    <Accordion.Content>
      ABBASAGHA is a professional video editing platform...
    </Accordion.Content>
  </Accordion.Item>
</Accordion>

// Tabs
<Tabs defaultValue="general">
  <Tabs.List>
    <Tabs.Trigger value="general">General</Tabs.Trigger>
    <Tabs.Trigger value="security">Security</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="general">General settings...</Tabs.Content>
  <Tabs.Content value="security">Security settings...</Tabs.Content>
</Tabs>
```

## 📦 Adding New Components

### 1. Create Component File

```tsx
// src/components/ui/NewComponent.tsx
"use client";

import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const newComponentVariants = cva("base-styles-here", {
  variants: {
    variant: {
      default: "default-styles",
      secondary: "secondary-styles",
    },
    size: {
      sm: "small-styles",
      md: "medium-styles",
      lg: "large-styles",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});

interface NewComponentProps extends VariantProps<typeof newComponentVariants> {
  children: React.ReactNode;
  className?: string;
}

export const NewComponent = forwardRef<HTMLDivElement, NewComponentProps>(
  ({ variant, size, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(newComponentVariants({ variant, size }), className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

NewComponent.displayName = "NewComponent";
```

### 2. Export from Index

```tsx
// src/components/ui/index.ts
export { NewComponent } from "./NewComponent";
```

## 🐛 Debugging Tips

### 1. React DevTools

- Install React Developer Tools browser extension
- Use Components tab to inspect state and props
- Use Profiler tab for performance analysis

### 2. Console Debugging

```tsx
// Debug component renders
useEffect(() => {
  console.log("Component rendered with:", { props, state });
});

// Debug API calls
const api = useApi(fetchData, {
  onSuccess: (data) => console.log("API Success:", data),
  onError: (error) => console.error("API Error:", error),
});
```

### 3. Performance Monitoring

```tsx
import { usePerformanceMonitor } from "@/hooks/usePerformance";

function MyComponent() {
  const { measure } = usePerformanceMonitor("MyComponent");

  const handleExpensiveOperation = () => {
    measure(() => {
      // Your expensive operation
    });
  };
}
```

## 📝 Code Style Guidelines

### 1. Component Naming

- **PascalCase** for components: `UserProfile`, `VideoPlayer`
- **camelCase** for functions and variables: `handleSubmit`, `isLoading`
- **kebab-case** for files: `user-profile.tsx`, `video-player.tsx`

### 2. Import Order

```tsx
// 1. React imports
import { useState, useEffect } from "react";

// 2. Third-party imports
import { cva } from "class-variance-authority";

// 3. Internal imports
import { Button } from "@/components/ui";
import { useApi } from "@/hooks/useApi";
import { User } from "@/types";
```

### 3. TypeScript

- Always type your props
- Use interfaces over types for objects
- Prefer `unknown` over `any`

## 🤝 Team Collaboration

### 1. Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-component

# Commit with descriptive messages
git commit -m "feat: add NewComponent with variants"

# Push and create PR
git push origin feature/new-component
```

### 2. PR Guidelines

- **Title**: Clear description of changes
- **Description**: What, why, and how
- **Screenshots**: For UI changes
- **Tests**: Include relevant tests

### 3. Code Review Checklist

- [ ] Follows component patterns
- [ ] Proper TypeScript typing
- [ ] Responsive design
- [ ] Accessibility considerations
- [ ] Performance optimizations
- [ ] Error handling

## 📚 Learning Resources

### Internal Documentation

- `COMPONENT_ARCHITECTURE.md` - Complete architecture guide
- `src/components/ui/index.ts` - All available components
- `src/types/index.ts` - TypeScript definitions

### External Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Headless UI](https://headlessui.com)

## 🆘 Getting Help

### 1. Check Examples

Look at existing components for patterns:

- `src/components/ui/Button.tsx` - Basic component
- `src/components/compound/Accordion.tsx` - Compound component
- `src/hooks/useApi.ts` - Custom hook

### 2. Ask the Team

- Slack #frontend-help channel
- Code review discussions
- Pair programming sessions

### 3. Documentation

- This guide for quick reference
- Architecture guide for deep dives
- Component Storybook (if available)

---

## 🎉 You're Ready!

This architecture is designed to make your development experience smooth and productive. The patterns are consistent, the types guide you, and the components are flexible.

**Happy coding! 🚀**
