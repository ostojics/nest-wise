# UI Improvements Guideline

This document outlines the design principles and technical approach for the "Sleek, Modern, and Calm" UI refactor of the NestWise application. The goal is to modernize the interface while maintaining a natural, accessible, and consistent user experience.

## Core Philosophy

- **Sleek & Modern**: Move away from heavy borders and dense layouts. Use depth (shadows), transparency, and whitespace to create structure.
- **Calm**: Avoid aggressive typography (excessive uppercase, massive fonts) and high-contrast borders. The UI should feel lightweight.
- **Natural**: Typography should feel standard and readable. Avoid over-stylization like forced uppercase for labels or excessive letter spacing.

## Component Patterns

### Cards & Containers

The primary building block of the UI is the Card. We are moving away from the default outlined cards to a softer, borderless style.

**Standard Card Classes:**

```tsx
className = 'border-none shadow-sm bg-card/50 hover:bg-card hover:shadow-md transition-all duration-300';
```

- **`border-none`**: Removes the harsh 1px border.
- **`shadow-sm`**: Provides the initial layer of depth.
- **`bg-card/50`**: Adds a subtle transparency, allowing the background to bleed through slightly, creating a "glass-like" or lighter feel.
- **`hover:...`**: Adds interactivity. The card becomes fully opaque (`bg-card`) and lifts up (`shadow-md`) on hover.

### Typography

We prioritize readability and a natural feel over stylized "dashboard" aesthetics.

| Element              | Style Classes                     | Notes                                                          |
| :------------------- | :-------------------------------- | :------------------------------------------------------------- |
| **Page Titles**      | `text-2xl font-bold`              | Removed `tracking-tight`. Keep it standard.                    |
| **Section Headers**  | `text-lg font-semibold`           | Used for lists or groups of cards.                             |
| **Card Titles**      | `text-lg font-semibold`           | Name of the entity (e.g., Account Name).                       |
| **Primary Values**   | `text-2xl font-bold tabular-nums` | For balances and main stats. `tabular-nums` ensures alignment. |
| **Secondary Labels** | `text-sm text-muted-foreground`   | **Do not use** `uppercase tracking-wider`. Keep it natural.    |
| **Body Text**        | `text-base text-muted-foreground` | For descriptions and help text.                                |

### Iconography

Icons should be used to anchor content but shouldn't dominate. Use soft backgrounds to integrate them.

**Icon Container Pattern:**

```tsx
<div className="p-1.5 bg-primary/10 rounded-full text-primary">
  <IconWallet className="h-4 w-4" />
</div>
```

### Separators

When dividing content inside a card, use a subtle separator that doesn't span the full width if possible, or use a very light color.

```tsx
<div className="w-full h-px bg-border/50" />
```

## Layout & Spacing

- **Padding**: Increase padding to let content breathe. Use `p-6` or `p-8` for empty states or large containers, and `p-4` for standard cards.
- **Grids**: Use `grid-cols-1 md:grid-cols-2` for dashboard layouts to maintain readability on larger screens without stretching content too wide.

## Implementation Checklist (Do's and Don'ts)

### ✅ Do

- Use `bg-card/50` for container backgrounds.
- Use `shadow-sm` instead of borders.
- Use `tabular-nums` for all financial data.
- Keep labels in sentence case (e.g., "Current balance", not "CURRENT BALANCE").
- Use `text-muted-foreground` for secondary information to establish hierarchy.

### ❌ Don't

- **Do not** use `border` classes on main cards (unless for specific active states).
- **Do not** use `uppercase` and `tracking-wider` for standard field labels.
- **Do not** use massive font sizes (e.g., `text-4xl`) for standard dashboard values; keep them grounded (`text-2xl`).
- **Do not** change the global color palette variables (oklch). Work within the existing theme.

## Example Refactor

**Before:**

```tsx
<Card className="border p-4">
  <div className="text-xs uppercase text-muted-foreground">Balance</div>
  <div className="text-3xl font-bold">$1,000.00</div>
</Card>
```

**After:**

```tsx
<Card className="border-none shadow-sm bg-card/50">
  <CardHeader>
    <CardDescription className="text-sm text-muted-foreground">Balance</CardDescription>
    <CardTitle className="text-2xl font-bold tabular-nums">$1,000.00</CardTitle>
  </CardHeader>
</Card>
```
