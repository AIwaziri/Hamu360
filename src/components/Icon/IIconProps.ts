/**
 * Closed set of icons this codebase actually uses. Deliberately not an open
 * `string` prop — every icon a component wants must be added here first,
 * which is what keeps this list an honest inventory of "every glyph the
 * approved design uses" rather than an escape hatch for one-off icons.
 *
 * Names match the Tabler Icons glyph name exactly (the `ti-` suffix), e.g.
 * `'home'` renders `ti ti-home` — see `Icon.tsx` and the approved wireframe's
 * own `<i class="ti ti-...">` usage in `HOS_All_Departments_Wireframe_v1.html`.
 */
export type IconName =
  | 'home'
  | 'scale'
  | 'report-money'
  | 'settings'
  | 'users'
  | 'brain'
  | 'help-circle'
  | 'search'
  | 'menu'
  | 'x'
  | 'chevron-down'
  // Added in Sprint 3 for HeroSection (Partner Message / Announcements /
  // Quick Links) — same closed-set discipline, same Tabler glyph names.
  | 'message-circle'
  | 'speakerphone'
  | 'bolt'
  | 'folder-open'
  | 'file-plus'
  | 'template'
  | 'book'
  | 'device-laptop'
  | 'calendar-event';

/**
 * Maps to the type scale's own font-size steps rather than a new bespoke
 * icon scale — `sm`/`md`/`lg` borrow `caption`/`body`/`headingXl`'s sizes
 * (11px/13px/26px), which already span the exact range the wireframe uses
 * for inline nav icons up through its large stat-card icon emphasis. See
 * `Icon.module.scss`.
 */
export type IconSize = 'sm' | 'md' | 'lg';

export interface IIconProps {
  name: IconName;
  /** @default 'md' */
  size?: IconSize;
  className?: string;
  /**
   * Provide only when the icon is the *sole* content of a control (e.g. a
   * hamburger toggle with no visible text) — this makes the icon an
   * accessible `role="img"` with this label. Omit it (the default) for the
   * far more common case of a decorative icon that always sits next to
   * visible text; it is then hidden from assistive tech via `aria-hidden`
   * so screen readers don't announce it twice.
   */
  label?: string;
}
