---
name: Kinetic Pressure
colors:
  surface: '#16171A'
  surface-dim: '#131314'
  surface-bright: '#3a393a'
  surface-container-lowest: '#0e0e0f'
  surface-container-low: '#1c1b1c'
  surface-container: '#201f20'
  surface-container-high: '#2a2a2b'
  surface-container-highest: '#353436'
  on-surface: '#e5e2e3'
  on-surface-variant: '#d8c3ad'
  inverse-surface: '#e5e2e3'
  inverse-on-surface: '#313031'
  outline: '#a08e7a'
  outline-variant: '#534434'
  surface-tint: '#ffb95f'
  primary: '#ffc174'
  on-primary: '#472a00'
  primary-container: '#f59e0b'
  on-primary-container: '#613b00'
  inverse-primary: '#855300'
  secondary: '#7bd0ff'
  on-secondary: '#00354a'
  secondary-container: '#00a6e0'
  on-secondary-container: '#00374d'
  tertiary: '#ffbcb7'
  on-tertiary: '#68000a'
  tertiary-container: '#ff938c'
  on-tertiary-container: '#8d0012'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffddb8'
  primary-fixed-dim: '#ffb95f'
  on-primary-fixed: '#2a1700'
  on-primary-fixed-variant: '#653e00'
  secondary-fixed: '#c4e7ff'
  secondary-fixed-dim: '#7bd0ff'
  on-secondary-fixed: '#001e2c'
  on-secondary-fixed-variant: '#004c69'
  tertiary-fixed: '#ffdad7'
  tertiary-fixed-dim: '#ffb3ad'
  on-tertiary-fixed: '#410004'
  on-tertiary-fixed-variant: '#930013'
  background: '#131314'
  on-background: '#e5e2e3'
  surface-variant: '#353436'
  text-primary: '#F5F5F5'
  text-muted: '#9CA3AF'
  border-low: '#262626'
typography:
  display-data:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Geist
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-mono:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
  caption:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.02em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 32px
  container-max: 1440px
---

## Brand & Style

The design system is engineered for high-stakes analytical environments where data density and diagnostic precision are paramount. The aesthetic is a fusion of **Technical Minimalism** and **Industrial Futurism**, mimicking the high-contrast interfaces of aerospace telemetry and medical monitoring hardware.

The style prioritizes "Information Velocity"—the speed at which a user can interpret critical failures and throughput status. It is characterized by:
- **Instrumental Logic:** UI elements behave like physical toggles, switches, and illuminated displays on a control panel.
- **Pressure Metaphors:** The interface uses color and gradient transitions to visualize stress and bottlenecks within a funnel, moving from stable states to critical points.
- **Diagnostic Tone:** The design acts as a neutral, high-precision lens that stays out of the way until an anomaly requires attention.

## Colors

The palette is optimized for a low-light, high-focus environment to reduce ocular fatigue during deep data sessions.

- **Foundational Neutrals:** The base is a near-black (#0A0A0B). Surfaces and cards use a slightly elevated Dark Gray (#16171A) to provide structural separation.
- **The Pressure Scale:** 
    - **Cool Teal/Blue (Secondary):** Represents the "nominal" or entry state of the funnel. Used for healthy data flow and active neutral states.
    - **Amber/Orange (Primary):** Signifies "pressure," drop-offs, and cautionary bottlenecks. This is the primary diagnostic color.
    - **Red (Danger):** Reserved exclusively for severe bottlenecks and system failures.
- **Funnel Logic:** Implement gradients that transition from the Cool Teal at the top of the funnel to Amber and finally Red at the bottom or at specific points of friction.
- **Typography:** High-contrast off-white for reading, and muted gray for metadata and labels.

## Typography

This system uses **Geist** for its technical, developer-centric precision. The typography strategy is built around data legibility.

- **Tabular Numerals:** For all numerical data, Geist’s tabular figures must be enabled (`tnum`) to ensure columns of numbers align perfectly for vertical scanning.
- **Data Display:** Large metrics use a heavy weight and tight letter spacing to mimic the appearance of digital readouts.
- **Labels:** Small labels use uppercase with slight tracking to simulate etched hardware text.
- **Inter Selection:** Inter is used sparingly for supplementary captions or labels where a slightly more humanist grotesque aids in rapid word shape recognition.

## Layout & Spacing

The layout follows a **Rigid Technical Grid** with a 4px baseline rhythm.

- **Grid System:** A 12-column fixed-width grid on desktop that provides a structured "chassis" for information modules.
- **Density:** Elements are tightly packed to maximize screen real estate. Use a 16px gutter between modules to maintain a clean but compact instrument-cluster feel.
- **Reflow:** On mobile, all columns collapse to a single stack. Horizontal scrolling is permitted only for wide data tables to preserve the integrity of tabular numerals.
- **Margins:** Page margins are kept thin (32px on desktop) to emphasize the utility-first nature of the interface.

## Elevation & Depth

This design system avoids soft, organic shadows in favor of **Tonal Layering** and **Sharp Contrast**.

- **Surface Tiers:** Background (#0A0A0B) is the lowest level. Cards/Modules (#16171A) sit on top. Modals or overlays use a slightly lighter gray (#202124).
- **Inset Depth:** Form fields and data cells should appear "etched" into the surface. Use a 1px solid border (#262626) instead of an outer shadow.
- **Active Glow:** When an element is focused or active (e.g., a primary amber button), use a 2px-4px subtle outer glow of the same color to simulate a backlit LED display.
- **Glass Effects:** Use background blurs (12px-20px) on dropdown menus and sidebars to maintain context of the underlying data while providing a clear interactive layer.

## Shapes

The shape language is sharp and geometric. Curvature is minimized to maintain the professional, "tool-not-toy" aesthetic.

- **Corner Radius:** A universal 4px (Soft) radius is applied to cards, buttons, and inputs. 
- **Sharp Elements:** Table headers, status ribbons, and vertical funnel segments use 0px sharp corners to reinforce the industrial, structural alignment of the grid.
- **Connectors:** Lines connecting data points or funnel stages should be 1px or 2px wide with no rounded caps (butt caps), ensuring a technical, schematic look.

## Components

### Buttons
- **Primary (Pressure):** Amber background, black text. High contrast, reserved for critical flow-altering actions.
- **Secondary (Nominal):** Cool Teal border with transparent background, Teal text.
- **Ghost:** No background, muted gray text, becomes off-white on hover.

### Inputs & Data Entry
- **Field Style:** Background is darker than the card surface. 1px solid border. Cursor and text use the Secondary Teal color to indicate active "input" mode.
- **Tabular Input:** Monospaced numerals for all numeric inputs.

### Cards & Modules
- **Container:** Dark Gray (#16171A) with a 1px subtle border (#262626). No shadow.
- **Header:** Often features a small "LED" indicator (dot) in the top right to show real-time status.

### Funnel & Visualization
- **The Funnel:** Vertical segments that use the color scale. If a stage has high "leakage," the segment or the arrow exiting it must be Primary Amber.
- **Data Tables:** High-density, no vertical lines. Use subtle row-striping (2% opacity white) for legibility.

### Indicators
- **Bottleneck Tag:** A sharp-edged tag with an Amber background and black Geist Mono text, used specifically to point to "leakage" points in data views.