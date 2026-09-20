---
name: Kinetic HUD Tactical
colors:
  surface: '#12131a'
  surface-dim: '#12131a'
  surface-bright: '#383941'
  surface-container-lowest: '#0d0e15'
  surface-container-low: '#1a1b22'
  surface-container: '#1e1f26'
  surface-container-high: '#292931'
  surface-container-highest: '#34343c'
  on-surface: '#e3e1ec'
  on-surface-variant: '#b9cbbd'
  inverse-surface: '#e3e1ec'
  inverse-on-surface: '#2f3038'
  outline: '#849588'
  outline-variant: '#3b4a3f'
  surface-tint: '#00e38f'
  primary: '#cdffdc'
  on-primary: '#003920'
  primary-container: '#00f59b'
  on-primary-container: '#006b41'
  inverse-primary: '#006d42'
  secondary: '#bdf4ff'
  on-secondary: '#00363d'
  secondary-container: '#00e3fd'
  on-secondary-container: '#00616d'
  tertiary: '#fff1e4'
  on-tertiary: '#472a00'
  tertiary-container: '#ffce95'
  on-tertiary-container: '#835200'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#53ffab'
  primary-fixed-dim: '#00e38f'
  on-primary-fixed: '#002111'
  on-primary-fixed-variant: '#005231'
  secondary-fixed: '#9cf0ff'
  secondary-fixed-dim: '#00daf3'
  on-secondary-fixed: '#001f24'
  on-secondary-fixed-variant: '#004f58'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#12131a'
  on-background: '#e3e1ec'
  surface-variant: '#34343c'
typography:
  display-hero:
    fontFamily: Geist
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.03em
  display-hero-mobile:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 34px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Geist
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
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
  body-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  telemetry-metric:
    fontFamily: JetBrains Mono
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.02em
  label-tactical:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.08em
  label-micro:
    fontFamily: JetBrains Mono
    fontSize: 9px
    fontWeight: '700'
    lineHeight: 12px
    letterSpacing: 0.12em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 0.75rem
  margin: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.875rem
  space-lg: 1.25rem
  space-xl: 1.75rem
---

## Brand & Style

This design system establishes a high-performance, distraction-free operations hub engineered for competitive test preparation. The aesthetic fuses tactical telemetry HUDs with ultra-refined modern dark-mode minimalism. Rather than feeling like a sterile utility or a gamified toy, the interface conveys momentum, relentless focus, and technical discipline.

### Personality & Tone
- **Tactical Precision:** Data displays, metrics, and logs emulate mission flight decks with monospaced tabular figures, crisp status beacons, and compartmentalized modules.
- **Relentless Focus:** Deep charcoal foundations eradicate visual noise and reduce cognitive fatigue during prolonged, late-night study sessions.
- **Controlled Kinetic Energy:** Electric neon cyber-emerald accents signal active states, streak completions, and locked-in operational focus without overwhelming visual hierarchy.
- **Mature & Accountability-Driven:** Avoids infantile gamification elements; relies instead on rigorous tracking badges, micro-borders, and disciplined telemetry.

### Visual Style Language
- **Base Surfaces:** Matte, near-black charcoal layers that stack from abyssal voids into elevated structural panels.
- **Outlines & Delimiters:** Hairline borders in muted industrial zinc, functioning like instrument chassis seams.
- **Luminescence:** Laser-precise glows restricted to active telemetry nodes, timer pings, and milestone verifications.

## Colors

The color palette is built upon deep radiation-absorbing charcoal tones paired with high-voltage phosphor accents to replicate precision telemetry instruments.

### Palette Roles
- **Base Canvas (`#090A0F`):** Deepest background plane; minimizes OLED power consumption and eye fatigue.
- **Surface Elevation 1 (`#12131A`):** Core card containers, module chassis, and navigation rails.
- **Surface Elevation 2 (`#1A1C26`):** Floating controls, active input fields, segment plates, and pill backdrops.
- **Structural Outlines (`#27272A`):** Hairline stroke delineation separating visual modules.
- **Primary Cyber Emerald (`#00F59B`):** Mission-critical focus state, streak indicators, primary actions, and validated checks.
- **Secondary Cyan Pulse (`#00E5FF`):** Secondary metrics, subject categorizations (e.g., Physics/Calculus telemetry), and secondary toggles.
- **Tertiary Alert Amber (`#F59E0B`):** Timer critical warnings, pending review alerts, and non-blocking flags.
- **Text White Primary (`#F9FAFB`):** Uncompromised legibility for crucial metrics, labels, and mathematical logic.
- **Text Muted Slate (`#71717A`):** Secondary metadata, inactive states, and structural division marks.

## Typography

The typographic hierarchy prioritizes rapid scannability, mathematical legibility, and technical operational tone.

### Structure
- **Headlines & Body:** Set in `Geist`, providing a clean, neo-grotesque, ultra-legible canvas with geometric neutrality. Headings use negative letter tracking for a tight, disciplined aesthetic.
- **Telemetry & Tactical Labels:** Set in `JetBrains Mono`. Used strictly for numeric counters, time logs, subject identifiers, and uppercase tracking tags (e.g., `JEE PREPARATION // DAILY LOG`, `STATUS: LOCKED IN`).
- **Tabular Figures:** Monospaced numerals (`tnum`) are mandatory across all metric clusters, stopwatches, question tallies, and rank percentiles to prevent horizontal layout shift during dynamic ticks.

## Layout & Spacing

The layout is built for high information density within ergonomic thumb reach, avoiding dead space while retaining clarity.

### Grid & Canvas Rhythm
- **Mobile-First Canvas:** 4-column fluid mobile grid with 12px (`0.75rem`) gutters and 16px (`1rem`) horizontal screen safe margins.
- **Tablet / Expanded Viewport:** Switches to an 8-column layout with 24px margins, pinning the command console to a centered 480px max-width tactical strip when viewed on wider hardware.
- **Vertical Rhythm:** 4px baseline grid. Padding and gap dimensions scale through disciplined increments (`0.25rem`, `0.5rem`, `0.875rem`, `1.25rem`, `1.75rem`), prioritizing modular stacking where cards fit seamlessly above the bottom navigation zone.

## Elevation & Depth

This system avoids soft, atmospheric drop shadows in favor of tonal surface stepping, structural hairline outlines, and precision phosphor edge luminescence.

### Surface Tiers
- **Tier 0 (Abyssal Base):** `#090A0F` — The root viewport canvas.
- **Tier 1 (Tactical Housing):** `#12131A` — Primary container cards and structural headers. Bound by a 1px border of `#27272A`.
- **Tier 2 (Interactive Modules):** `#1A1C26` — Embedded sub-cards, nested logs, and input wells. Bound by a 1px border of `#3F3F46` on focus.
- **Tier 3 (Floating HUD Overlays):** `#12131A` at 92% opacity with a `backdrop-filter: blur(12px)` and a top rim stroke of `rgba(255, 255, 255, 0.1)`.

### Tactical Glow Architecture
- Active timers, live session streaks, and primary execution toggles emit an inner and contact aura:
  - `box-shadow: 0 0 16px -2px rgba(0, 245, 155, 0.35), inset 0 1px 0 rgba(0, 245, 155, 0.4)`.
- Default resting surfaces rely entirely on 1px stroke boundaries (`#27272A`) without external drop shadows, preserving an instrument-grade matte finish.

## Shapes

The interface balances tactical precision with modern mobile ergonomics by employing a distinct corner-radius hierarchy.

### Corner Radius Mapping
- **Primary Modules & Dash Cards:** Utilize 16px (`rounded-2xl` equivalent) radii to soften container edges and frame telemetry cleanly.
- **Buttons & Interactive Blocks:** Utilize 10px–12px (`rounded-xl` equivalent) radii to create tactile, pressable affordance.
- **Pills, Micro-Badges & Telemetry Nodes:** Utilize fully rounded pill caps (`9999px`) to immediately denote non-card dynamic data tags (e.g., subject badges, status pings).
- **Segmented Controls:** Enclosed in a 10px chassis with inner 8px sliding blocks, maintaining an airtight mechanical fit.

## Components

### Buttons
- **Primary Action (Execute / Start Session):** High-voltage background `#00F59B` with `#090A0F` bold typography (`Geist` 14px, 600 weight). Subtle edge highlight, active pulse effect on press, no blur halo until engaged.
- **Secondary / Ghost Tactical:** `#1A1C26` surface, 1px `#27272A` border, `#F9FAFB` label with `#71717A` hover transition.
- **Destructive / Reset:** `#12131A` surface with 1px border of `rgba(239, 68, 68, 0.4)` and `#EF4444` label.

### Cards & Modules
- Structured chassis with a 1px `#27272A` outline, `#12131A` fill, and a top-edge micro-label in `JetBrains Mono` tracked uppercase (e.g., `SECTION: ELECTRODYNAMICS // DRILL 04`).
- Corner-pinned tactical metadata icons or binary verification dots.

### Binary Segmented Switches & Toggles
- Dual-state switch for binary tracking (`DONE` vs `SKIPPED`, `ACCURATE` vs `RETRY`):
  - Recessed `#090A0F` tray with a 1px border.
  - Active sliding pill in `#1A1C26` bounded by an electric `#00F59B` hairline border and neon micro-label.

### Checkboxes & Binary Verification Checks
- 20x20px rounded squares (4px radius).
- Unchecked: `#12131A` interior with a 1.5px `#27272A` border.
- Checked: `#00F59B` fill with `#090A0F` sharp vector checkmark, projecting a localized 6px neon aura.

### Chips & Tactical Badges
- 24px height pills featuring `JetBrains Mono` 10px uppercase tracking.
- Composed of an elevated background (`#1A1C26`), an inset 1px tint border, and a 6px status LED dot on the left perimeter (`#00F59B` for green-flagged, `#00E5FF` for theory/formulas, `#F59E0B` for revision backlog).

### Input Fields & Mathematical Work Logs
- Input surfaces set to `#12131A` with a 1px `#27272A` border and 12px rounded corner radius.
- On focus: Border transitions to `#00F59B` with a microscopic label tag pinned to the top-right reading `INPUT // ACTIVE`. Tabular numeric keypad integration.

### Telemetry Dial / Session HUD (Unique Product Component)
- Centered circular or segmented linear progress indicator with electric cyber-emerald track fill and `#1A1C26` background track.
- Center displays high-contrast monospaced timer with dynamic milliseconds counter (`JetBrains Mono`, 32px), bordered by an uppercase operational state badge (`LOCKED IN // DEEP WORK`).