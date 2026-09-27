---
name: Pressure Gauge
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394d'
  surface-container-lowest: '#060e20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3d'
  surface-container-highest: '#2d3449'
  on-surface: '#dae2fd'
  on-surface-variant: '#bdc8d1'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#87929a'
  outline-variant: '#3e484f'
  surface-tint: '#7bd0ff'
  primary: '#8ed5ff'
  on-primary: '#00354a'
  primary-container: '#38bdf8'
  on-primary-container: '#004965'
  inverse-primary: '#00668a'
  secondary: '#ffb95f'
  on-secondary: '#472a00'
  secondary-container: '#ee9800'
  on-secondary-container: '#5b3800'
  tertiary: '#45e3ce'
  on-tertiary: '#003731'
  tertiary-container: '#07c7b2'
  on-tertiary-container: '#004d44'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#c4e7ff'
  primary-fixed-dim: '#7bd0ff'
  on-primary-fixed: '#001e2c'
  on-primary-fixed-variant: '#004c69'
  secondary-fixed: '#ffddb8'
  secondary-fixed-dim: '#ffb95f'
  on-secondary-fixed: '#2a1700'
  on-secondary-fixed-variant: '#653e00'
  tertiary-fixed: '#62fae3'
  tertiary-fixed-dim: '#3cddc7'
  on-tertiary-fixed: '#00201c'
  on-tertiary-fixed-variant: '#005047'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  data-display:
    fontFamily: JetBrains Mono
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.02em
  data-label:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  caption:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  gutter: 16px
  margin: 24px
  cell-padding: 8px 12px
---

## Brand & Style
The design system is engineered for high-stakes recruitment environments where data density and diagnostic precision are paramount. The aesthetic is inspired by professional laboratory equipment and medical vitals monitors, prioritizing legibility and functional clarity over decorative elements.

The style is **Precision Modernism**, characterized by:
- **High Information Density:** Maximum data visualization per square inch without sacrificing legibility.
- **Instrumental Logic:** UI elements behave like physical toggles and switches on a control panel.
- **Diagnostic Tone:** The interface acts as a neutral lens, highlighting anomalies and "leakage" in the recruitment funnel through targeted color signals rather than aesthetic flourishes.

## Colors
The palette is optimized for a dark-mode professional environment to reduce eye strain during long analytical sessions.

- **Backgrounds:** The foundation is a deep Slate/Charcoal (#0F172A). Surface containers use a slightly lighter Slate (#1E293B) to create structural depth.
- **Electric Blue (Primary):** Used for volume indicators, progress bars, and primary actions. It represents the "standard state."
- **Amber (Warning):** Reserved strictly for drop-offs, bottlenecks, and "leakage" indicators in the recruitment funnel.
- **Teal (Success):** Indicates completions, successful hires, and positive trend vectors.
- **Borders:** Sharp, high-contrast Slate (#334155) is used to define the "instrument cells" of the dashboard.

## Typography
This design system utilizes a dual-font approach to separate narrative content from analytical data.

- **Inter:** Used for general interface text, navigation, and headers. It provides a clean, neutral foundation that remains legible at small sizes.
- **JetBrains Mono:** Used for all numerical data points, metric labels, and timestamps. The monospaced nature ensures that columns of numbers align perfectly, facilitating rapid comparison and scanability.

**Hierarchy Note:** 
Headlines should be kept compact. Data labels always use uppercase with slight letter-spacing to mimic the etched labels on hardware gauges.

## Layout & Spacing
The layout follows a **Rigid Grid System** designed for complex dashboards.

- **Grid:** A 12-column fixed grid for desktop, collapsing to a single column for mobile.
- **Rhythm:** A 4px baseline grid governs all spacing. Vertical rhythm is tight to maximize the visibility of data tables.
- **Density:** Elements are packed closely (8px-12px gaps) to mimic a cockpit environment. Large voids of whitespace are avoided; instead, use borders and tonal shifts to separate logical groups.
- **Breakpoints:**
  - Desktop: 1280px+ (12 columns)
  - Tablet: 768px - 1279px (6 columns)
  - Mobile: Under 768px (Fluid)

## Elevation & Depth
In keeping with the "instrument" aesthetic, this design system avoids soft ambient shadows. Depth is communicated through:

- **Tonal Stepping:** Elements closer to the user (like modals or dropdowns) use lighter shades of Slate.
- **Inset Outlines:** Form inputs and data cells should appear slightly "recessed" into the dashboard surface using 1px internal borders.
- **High-Contrast Borders:** Rather than shadows, use 1px solid borders (#334155) to define surface boundaries. 
- **Active State Glow:** Primary buttons and active indicators may use a subtle outer glow (0-2px) of their own color (e.g., Electric Blue) to simulate a backlit LED.

## Shapes
The shape language is sharp and structural. To maintain a serious, professional tool feel, we avoid organic curves.

- **Standard Radius:** 4px (Soft) for buttons, cards, and input fields.
- **Sharp Corners:** 0px for table headers, segmented control groups, and vertical "gauge" bars.
- **Functional Shapes:** Use 45-degree chamfers for "leakage" indicators or status tags to reinforce the technical nature of the tool.

## Components

### Buttons & Controls
- **Primary Action:** Solid Electric Blue background, white text, 4px radius. 
- **Segmented Controls:** Grouped buttons with 0px internal radius, using a "pressed" tonal state (darker slate) to show selection.
- **Inputs:** Darker background than the container, 1px border, JetBrains Mono font for entered values.

### Data Visualization
- **Gauge-style KPIs:** Semicircular or linear "stress" bars showing current recruitment load against capacity.
- **Funnel Components:** Stepped vertical blocks. "Leakage" is visualized by an Amber arrow or line exiting the side of the funnel step.
- **Tables:** High-density, no vertical borders, 1px horizontal dividers. Alternating row colors (Zebra striping) using 2% opacity shifts.

### Feedback & Status
- **Vitals Monitor:** Real-time pulse indicators (small 4px dots) next to active recruitment channels.
- **Tooltips:** Square-edged, high-contrast black backgrounds with mono-spaced caption text.