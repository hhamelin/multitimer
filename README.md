# MultiTimer — Multi-Timer Dashboard

Responsive countdown timer dashboard designed for service environments where multiple customers need to be tracked simultaneously. Supports up to 21 independent countdown timers with bulk selection controls, quick time adjustments, manual time entry, drag-and-drop reordering, and per-timer color tags. State persists across page reloads via `localStorage`.

## Live Deployment

- [MultiTimer Live Preview](https://projects.havenhamelin.work/multitimer/)

## Key Features

- **Multi-Timer Dashboard**: Create and manage up to 21 independent countdown timers, each with a custom name, color tag, and independently controlled playback state.
- **Bulk Selection & Group Controls**: Select individual or all timers simultaneously; apply play/pause, time adjustments, manual time entry, clear, and delete operations across the entire selection in one action.
- **Quick Time Adjustment**: One-click time chip buttons (`+30 sec`, `+1 min`, `+5 min`, `+15 min`, etc.) adjust time across all selected timers instantly; toggleable `+`/`−` mode adds or subtracts from current countdowns.
- **Manual Time Entry**: Modal time picker sets an exact `HH:MM:SS` value across all selected timers simultaneously.
- **Expiry Alerts**: Audio alarm and canvas-confetti burst fire automatically when any timer reaches zero.
- **Three View Modes**: Spacious card grid, compact grid, and list view switchable from the header toolbar.
- **Dark / Light Theme**: Persistent theme preference stored in `localStorage`; toggleable from the header.
- **Fullscreen Mode**: Native browser fullscreen toggle for distraction-free kiosk-style use.
- **Drag-and-Drop Reorder**: Timer cards are repositionable by dragging to reorder the display sequence.
- **Portfolio Navigation Integration**: Auto-detecting banner component for seamless navigation back to Haven Hamelin's portfolio site.

## Tech & Architecture

- **UI Framework**: React 19 + TypeScript, bundled with Vite 8.
- **Styling**: SCSS (`src/scss/`) with CSS custom property design tokens for dark/light theming.
- **State Management**: Single custom hook `useMultiTimer` (`src/hooks/useMultiTimer.ts`) encapsulates all timer state, selection logic, persistence, and audio/confetti side effects.
- **Timer Engine**: `setInterval`-based tick at 200ms; timers store an absolute `targetEndTime` timestamp to remain accurate across tab switches and system sleep.
- **Audio**: `src/utils/audio.ts` sound engine triggers a chime on timer expiry.
- **Icons**: Lucide React icon set.

## App Structure

- `src/hooks/useMultiTimer.ts` – Core state hook; manages timer CRUD, bulk operations, play/pause logic, time adjustment, persistence, and expiry side effects.
- `src/components/HeaderToolbar.tsx` – Sticky top toolbar with brand, view controls, theme/fullscreen toggles, selection controls, quick-add chips, and bulk action menu.
- `src/components/TimerCard.tsx` – Individual timer card rendering countdown display, color tag, name editing, and card-level controls.
- `src/components/TimerGrid.tsx` – Drag-and-drop grid container that renders timer cards in the selected view mode.
- `src/components/ManualTimeModal.tsx` – Modal dialog for precise `HH:MM:SS` time input.
- `src/components/PortfolioReturnBanner.tsx` – Referrer-detecting portfolio navigation banner.
- `src/types/timer.ts` – `TimerItem`, `ViewMode`, `PlusMinusMode` type definitions and `QUICK_ADD_OPTIONS` registry.
- `src/utils/audio.ts` – Sound engine for timer expiry alerts.
- `src/scss/` – SCSS source with design tokens, component styles, and theme definitions.

## Quick Start

1. Install dependencies  
`npm install`

2. Run the development server  
`npm run dev`

3. Build for production  
`npm run build`
