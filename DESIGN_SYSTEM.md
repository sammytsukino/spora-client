# SPORA Design System

## Color Tokens

### Primary Colors
- `--color-primary`: #262626 (Dark text, borders, primary backgrounds)
- `--color-primary-light`: #E9E9E9 (Main background)
- `--color-primary-lighter`: #e3e3e3 (Secondary backgrounds, Laboratory sidebar)
- `--color-primary-lightest`: #e6e6e6 (Hero section background)

### Accent Colors
- `--color-accent`: #ff6b4a (Hero section accent line)
- `--color-accent-secondary`: lime-300 (Hover states, active states)
- `--color-accent-tertiary`: stone-200 (Text on dark backgrounds)

### Text Colors
- `--color-text-primary`: #262626 (Primary text)
- `--color-text-secondary`: stone-200 (Text on dark backgrounds)
- `--color-text-muted`: gray-500 (Muted text, loading states)

### Border Colors
- `--color-border`: #262626 (All borders)

## Typography

### Font Families
- `--font-serif`: "BIZ UDPMincho", serif (Headings, quotes, declarative text)
- `--font-mono`: "Supply Mono", ui-monospace (UI elements, labels, navigation)

### Font Sizes
- `--font-size-xs`: 0.625rem (10px) - Small labels, metadata
- `--font-size-sm`: 0.6875rem (11px) - Card metadata, form labels
- `--font-size-base`: 0.875rem (14px) - Base body text
- `--font-size-lg`: 1rem (16px) - Large body text
- `--font-size-xl`: 1.125rem (18px) - Small headings
- `--font-size-2xl`: 1.75rem (28px) - Card titles
- `--font-size-3xl`: 1.875rem (30px) - Section headings
- `--font-size-4xl`: 2.25rem (36px) - Page titles (md)
- `--font-size-5xl`: 3rem (48px) - Page titles (lg)
- `--font-size-6xl`: 3.75rem (60px) - Page titles (xl)

### Letter Spacing
- `--tracking-tight`: 0.25em (Tight tracking for labels)
- `--tracking-normal`: 0.3em (Standard tracking for navigation, buttons)
- `--tracking-wide`: 0.5em (Wide tracking for emphasis)

### Font Weights
- `--font-weight-normal`: 400 (Regular text)
- `--font-weight-bold`: 700 (Bold headings)

## Spacing Scale

Base unit: 4px

- `--space-1`: 0.25rem (4px)
- `--space-2`: 0.5rem (8px)
- `--space-3`: 0.75rem (12px)
- `--space-4`: 1rem (16px)
- `--space-6`: 1.5rem (24px)
- `--space-8`: 2rem (32px)
- `--space-12`: 3rem (48px)
- `--space-16`: 4rem (64px)

### Standard Padding Patterns
- Container horizontal: `px-6 md:px-12 lg:px-16` (24px / 48px / 64px)
- Section vertical: `py-4 md:py-6 lg:py-8` (16px / 24px / 32px)
- Card padding: `p-4 md:p-5 lg:p-6` (16px / 20px / 24px)

### Standard Gap Patterns
- Tight: `gap-2` (8px) - Related elements
- Normal: `gap-4` (16px) - Standard spacing
- Loose: `gap-6` (24px) - Section spacing
- Wide: `gap-8` (32px) - Major section spacing

## Borders

- `--border-width`: 2px (Standard border width)
- `--border-color`: var(--color-border)
- `--border-radius`: 0 (No border radius - sharp corners)

## Breakpoints

- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

## Component Variants

### Navbar
- `default`: Dark background (#262626), light text
- `transparent`: Transparent background, dark text, scroll-activated background
- `laboratory`: Light background, right-aligned navigation
- `team`: Light background, left-aligned navigation with logo

### Button
- `default`: Border, transparent background, hover fill
- `compact`: Thicker border (2px), same behavior
- `navbar`: Light border, for dark backgrounds

### Card
- `garden`: Full card with image, title, excerpt, metadata
- `greenhouse`: Compact card for grid layouts

### Footer
- `default`: Full footer with logo, navigation, copyright
- `alter`: Simplified footer with logo and navigation
- `team`: Minimal footer with copyright and navigation
