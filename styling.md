# macOS Design System - Styling Language

A Tailwind-based styling language for macOS/Apple-inspired interfaces.

## Color Tokens

### Backgrounds
```
bg-gradient-to-br from-slate-50 to-slate-100    // Page background
bg-white/50 backdrop-blur-xl                     // Glass panels (light)
bg-slate-50/80 backdrop-blur-xl                  // Glass panels (neutral)
bg-white/60 backdrop-blur-sm                     // Input fields
bg-blue-500                                      // Selected state
bg-slate-200/60                                  // Hover state
bg-slate-200/50                                  // Subtle hover
bg-red-100                                       // Destructive hover
```

### Text
```
text-slate-800        // Primary text
text-slate-600        // Secondary headers
text-slate-500        // Secondary text
text-slate-400        // Tertiary/icons
text-white            // On blue background
text-blue-100         // On blue background (muted)
text-red-600          // Destructive actions
```

### Borders
```
border-slate-200/60           // Standard borders
border-r border-slate-200/60  // Sidebar divider
border-b border-slate-200/60  // Section divider
```

## Component Patterns

### Glass Panel
```
bg-slate-50/80 backdrop-blur-xl border-r border-slate-200/60
```

### Glass Surface
```
bg-white/50 backdrop-blur-xl
```

### Input Field
```
bg-white/60 backdrop-blur-sm border border-slate-200/60 rounded-md 
focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50
```

### Icon Button
```
p-1.5 rounded-md hover:bg-slate-200/60 text-slate-600 hover:text-slate-800 
transition-all active:scale-95
```

### List Item (Unselected)
```
px-3 py-2.5 mb-1 rounded-lg cursor-pointer hover:bg-slate-200/50 
text-slate-800 transition-all
```

### List Item (Selected)
```
px-3 py-2.5 mb-1 rounded-lg cursor-pointer bg-blue-500 text-white 
shadow-sm transition-all
```

### Divider/Resize Handle
```
w-[1px] bg-slate-200/60 hover:bg-blue-400/50 transition-colors cursor-col-resize
```

### Delete Button (on hover)
```
p-1 rounded hover:bg-red-100 text-slate-400 hover:text-red-600 transition-all
```

## Typography Scale

```
text-sm font-semibold          // Sidebar title
text-sm font-medium            // List item title
text-xs                        // Metadata, timestamps
text-sm placeholder:text-slate-400  // Input placeholders
leading-relaxed                // Body text line height
```

## Spacing System

### Container Padding
```
px-4 py-3     // Compact sections (sidebar header)
px-8 py-4     // Spacious headers
px-8 py-6     // Content areas
p-2           // List container
```

### Gaps
```
gap-2         // Related elements
gap-3         // Section spacing
mb-1          // List item spacing
mb-2          // Icon spacing
mb-3          // Header element spacing
```

## Interactive States

### Hover
```
hover:bg-slate-200/60         // Buttons
hover:bg-slate-200/50         // List items  
hover:bg-blue-400/30          // Resize handle
hover:bg-red-100              // Destructive
```

### Active/Pressed
```
active:scale-95               // Button press feedback
```

### Focus
```
focus:outline-none 
focus:ring-2 focus:ring-blue-400/50 
focus:border-blue-400/50
```

### Selected
```
bg-blue-500 text-white shadow-sm
```

## Transitions

```
transition-all         // Multi-property changes
transition-colors      // Color-only changes
```

## Layout Utilities

```
size-full                      // Fill container
flex flex-col                  // Vertical stack
flex items-center justify-between  // Horizontal spread
flex-shrink-0                  // Prevent shrinking
flex-1 min-w-0                // Grow and allow shrinkage
overflow-hidden                // Clip content
overflow-y-auto                // Vertical scroll
```

## Border Radius

```
rounded-md     // Inputs, buttons (medium)
rounded-lg     // List items, cards (large)
```

## Shadows

```
shadow-sm      // Selected items (subtle only)
```

## Icon Sizing

```
size={12}      // Tiny icons (metadata)
size={14}      // Small icons (list items)
size={18}      // Medium icons (buttons)
size={20}      // Large icons (headers)
size={40}      // Empty state icons
```

## Application Rules

1. **Always use opacity modifiers**: `/50`, `/60`, `/80` for layering
2. **Always use backdrop-blur**: `backdrop-blur-xl` or `backdrop-blur-sm`
3. **Always add transitions**: `transition-all` or `transition-colors`
4. **Use slate for neutrals**: Slate palette only (no gray)
5. **Use blue for accents**: `blue-400`, `blue-500` for interactive states
6. **Minimal shadows**: Only `shadow-sm` when absolutely needed
7. **Consistent spacing**: Use defined padding/gap patterns above

---

