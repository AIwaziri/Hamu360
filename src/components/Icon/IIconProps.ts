/**
 * Closed set of icons this codebase actually uses. Deliberately not an open
 * `string` prop — every icon a component wants must be added here first,
 * which is what keeps this list an honest inventory of "every glyph the
 * approved design uses" rather than an escape hatch for one-off icons.
 *
 * Names match the Tabler Icons glyph name exactly (the `ti-` suffix), e.g.
 * `'home'` renders `ti ti-home` — see `Icon.tsx` and the approved wireframe's
 * own `<i class="ti ti-...">` usage in `HOS_All_Departments_Wireframe_v1.html`.
 *
 * A `const` array, not a hand-written `type X = 'a' | 'b' | ...` union —
 * `IconName` is derived from it (`(typeof ICON_NAMES)[number]`) rather than
 * the other way around. This exists so Sprint 6's
 * `SharePointQuickLinksService` (which must validate a List's free-text
 * `Icon` column against this same closed set at *runtime*, not just
 * compile time) has one real array to check against, instead of that
 * service hand-duplicating every icon name a second time — a TypeScript
 * union type has no runtime representation to reflect on, so one of these
 * two forms has to be the source of truth and the other derived from it.
 * Every prior sprint's addition here becomes an addition to this array
 * instead — the type itself, and every consumer of `IconName`, is
 * unaffected by this being a refactor rather than a net-new type.
 */
export const ICON_NAMES = [
  'home',
  'scale',
  'report-money',
  'settings',
  'users',
  'brain',
  'help-circle',
  'search',
  'menu',
  'x',
  'chevron-down',
  // Added in Sprint 3 for HeroSection (Partner Message / Announcements /
  // Quick Links) — same closed-set discipline, same Tabler glyph names.
  'message-circle',
  'speakerphone',
  'bolt',
  'folder-open',
  'file-plus',
  'template',
  'book',
  'device-laptop',
  'calendar-event',
  // Added in Sprint 4 for the Team Hub Cards row.
  'heart',
  'chart-dots',
  // Added in Sprint 5 for the four Dashboard Widgets (widget title icons +
  // Firm Wins' per-category icon).
  'calendar',
  'user-plus',
  'news',
  'trophy',
  'award',
  'handshake',
  'file-check',
  'star',
  'cake',
  // Added in Sprint 6 for `EmptyState`/`ErrorState`. Unlike every prior
  // addition to this array, these two do NOT come from the approved
  // wireframe — a static mockup has no way to depict a loading failure or
  // an empty SharePoint List, so there is no `<i class="ti ti-...">`
  // reference to match. Chosen as the closest semantically-appropriate
  // Tabler glyphs for "nothing here yet" and "something went wrong"
  // respectively; flagged here as the one exception to this file's own
  // "matches the approved wireframe's own icon markup" rule.
  'inbox',
  'alert-triangle'
] as const;

export type IconName = (typeof ICON_NAMES)[number];

/**
 * Maps to the type scale's own font-size steps rather than a new bespoke
 * icon scale — `sm`/`md`/`lg`/`xl` borrow `caption`/`body`/`headingS`/
 * `headingXl`'s sizes (11px/13px/17px/26px). Sprint A6 inserted `lg` (17px
 * — the wireframe's `.hub-ic i` hub-tile icon size, previously
 * unreachable: the old three-step ladder jumped 13px → 26px straight over
 * it) and moved the former `lg` consumers (EmptyState/ErrorState's 26px
 * state icons) to the new `xl`, keeping the t-shirt ladder monotonic. See
 * `Icon.module.scss`.
 */
export type IconSize = 'sm' | 'md' | 'lg' | 'xl';

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
