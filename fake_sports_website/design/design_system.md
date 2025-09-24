# Sports Inc. Design System

## Overview
Design system for the Sports Inc. NBA Boxscore Replica, based on ESPN's visual design but with Sports Inc. branding.

## Color Palette

### Primary Colors
- **Background**: `rgb(237, 238, 240)` - Light gray background
- **Text Primary**: `rgb(43, 44, 45)` - Dark gray text
- **Text Secondary**: `rgb(102, 102, 102)` - Medium gray text
- **Border**: `rgb(204, 204, 204)` - Light border color

### Accent Colors
- **Sports Inc. Primary**: `rgb(0, 123, 255)` - Blue (to be defined)
- **Sports Inc. Secondary**: `rgb(40, 167, 69)` - Green (to be defined)
- **Error**: `rgb(220, 53, 69)` - Red
- **Success**: `rgb(40, 167, 69)` - Green
- **Warning**: `rgb(255, 193, 7)` - Yellow

### Team Colors
- **Dallas Mavericks**: `rgb(0, 83, 188)` - Blue
- **Philadelphia 76ers**: `rgb(0, 107, 182)` - Blue

## Typography

### Font Stack
```css
font-family: -apple-system, "system-ui", Roboto, Arial, "Helvetica Neue", Helvetica, sans-serif;
```

### Font Sizes
- **H1**: 32px (Game title)
- **H2**: 24px (Section headers)
- **H3**: 20px (Subsection headers)
- **H4**: 18px (Table headers)
- **Body**: 14px (Default text)
- **Small**: 12px (Secondary text)
- **Caption**: 10px (Fine print)

### Font Weights
- **Light**: 300
- **Regular**: 400
- **Medium**: 500
- **Bold**: 700

## Spacing System

### Base Unit
- **Base**: 8px
- **Small**: 4px
- **Medium**: 16px
- **Large**: 24px
- **XLarge**: 32px
- **XXLarge**: 48px

### Layout Spacing
- **Container Padding**: 16px
- **Section Margin**: 24px
- **Element Spacing**: 8px
- **Table Cell Padding**: 8px 12px

## Layout Grid

### Container Widths
- **Desktop**: 1200px max-width
- **Tablet**: 768px max-width
- **Mobile**: 100% width with 16px padding

### Breakpoints
- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px+

### Grid System
- **Desktop**: 12-column grid
- **Tablet**: 8-column grid
- **Mobile**: 4-column grid

## Components

### Header
- **Height**: 60px
- **Background**: White
- **Border**: 1px solid border color
- **Logo**: Left-aligned, 40px height
- **Navigation**: Right-aligned, horizontal menu

### Scoreboard
- **Height**: 80px
- **Background**: White
- **Team Logos**: 28x20px
- **Score Display**: Large, bold numbers
- **Game Status**: Small text, colored

### Tables
- **Header Background**: Light gray
- **Row Hover**: Light blue highlight
- **Border**: 1px solid light gray
- **Cell Padding**: 8px 12px
- **Alternating Rows**: Subtle background difference

### Buttons
- **Primary**: Sports Inc. blue background, white text
- **Secondary**: White background, blue border
- **Small**: Reduced padding and font size
- **Hover**: Darker background, smooth transition

### Forms
- **Input Height**: 40px
- **Border**: 1px solid light gray
- **Focus**: Blue border, subtle shadow
- **Error**: Red border, error message below

## Icons

### Icon Style
- **Style**: Outline icons
- **Size**: 16px, 20px, 24px variants
- **Color**: Inherit from parent or primary color
- **Stroke Width**: 1.5px

### Common Icons
- **Search**: Magnifying glass
- **Menu**: Hamburger (3 lines)
- **User**: Person outline
- **Settings**: Gear
- **Close**: X
- **Arrow**: Chevron right/down

## Shadows and Effects

### Box Shadows
- **Light**: `0 1px 3px rgba(0, 0, 0, 0.1)`
- **Medium**: `0 2px 6px rgba(0, 0, 0, 0.15)`
- **Heavy**: `0 4px 12px rgba(0, 0, 0, 0.2)`

### Transitions
- **Duration**: 0.2s
- **Easing**: `ease-in-out`
- **Properties**: All properties

## Accessibility

### Color Contrast
- **Minimum**: 4.5:1 for normal text
- **Large Text**: 3:1 minimum
- **Interactive Elements**: 3:1 minimum

### Focus States
- **Outline**: 2px solid Sports Inc. blue
- **Offset**: 2px from element
- **Visible**: Always visible on focus

### Screen Reader Support
- **ARIA Labels**: All interactive elements
- **Semantic HTML**: Proper heading hierarchy
- **Alt Text**: All images and icons
- **Skip Links**: Navigation shortcuts

## Responsive Behavior

### Mobile Adaptations
- **Navigation**: Collapsible hamburger menu
- **Tables**: Horizontal scroll or stacked layout
- **Typography**: Slightly smaller font sizes
- **Spacing**: Reduced margins and padding

### Tablet Adaptations
- **Navigation**: Condensed horizontal menu
- **Tables**: Maintain horizontal layout
- **Typography**: Standard font sizes
- **Spacing**: Standard margins and padding

## Animation Guidelines

### Micro-interactions
- **Hover**: Subtle color change, 0.2s
- **Click**: Brief scale down (0.95), 0.1s
- **Focus**: Smooth outline appearance
- **Loading**: Subtle pulse or spinner

### Page Transitions
- **Duration**: 0.3s
- **Easing**: `ease-out`
- **Properties**: Opacity and transform

## Brand Guidelines

### Sports Inc. Logo
- **Usage**: Always maintain aspect ratio
- **Minimum Size**: 20px height
- **Clear Space**: Equal to logo height
- **Placement**: Top-left of header

### Brand Voice
- **Tone**: Professional, authoritative, engaging
- **Language**: Clear, concise, sports-focused
- **Personality**: Confident, knowledgeable, accessible

## Implementation Notes

### CSS Custom Properties
```css
:root {
  --color-bg-primary: rgb(237, 238, 240);
  --color-text-primary: rgb(43, 44, 45);
  --color-text-secondary: rgb(102, 102, 102);
  --color-border: rgb(204, 204, 204);
  --color-sports-inc-primary: rgb(0, 123, 255);
  --spacing-base: 8px;
  --spacing-small: 4px;
  --spacing-medium: 16px;
  --spacing-large: 24px;
  --font-family: -apple-system, "system-ui", Roboto, Arial, "Helvetica Neue", Helvetica, sans-serif;
}
```

### Component Structure
- **Atomic Design**: Atoms, molecules, organisms
- **Modularity**: Reusable components
- **Consistency**: Standardized patterns
- **Scalability**: Easy to extend and modify
