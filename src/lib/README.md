# src/lib/

Shared utility functions.

## `utils.ts`

```ts
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

Combines `clsx` (conditional class logic) with `tailwind-merge` (deduplicate conflicting Tailwind utilities). Use this everywhere dynamic Tailwind classes are needed.

### Usage

```tsx
// conditional classes
cn("base-class", isActive && "active-class", { "other-class": condition })

// merging with overrides (tailwind-merge resolves conflicts)
cn("px-4 py-2", className)
```
