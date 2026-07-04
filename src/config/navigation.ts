import type { IconName } from '@components/Icon';

/**
 * The shape `Navigation`/`NavigationItem` (both in `src/layouts`) render —
 * `id` is a stable key with no meaning attached to it yet (not a route, not
 * a SharePoint list item ID). Sprint 4's audience-targeting and Sprint 6's
 * real routing both extend this shape rather than replace it: a real
 * `path`/`href` and an `audience` field can be added here later without
 * `Navigation` or `NavigationItem` changing at all, since those components
 * only ever render whatever fields they're told to (see `AppShell`'s
 * docblock for the full explanation of this boundary).
 */
export interface INavItemConfig {
  id: string;
  label: string;
  icon: IconName;
}

/**
 * The seven top-level destinations from the approved wireframe's shared nav
 * (`HOS_All_Departments_Wireframe_v1.html`'s `.nav` block), in the exact
 * order and with the exact Tabler icon the wireframe uses for each
 * (`ti-home`, `ti-scale`, `ti-report-money`, `ti-settings`, `ti-users`,
 * `ti-brain`, `ti-help-circle`).
 *
 * This is the ONE place this list is allowed to exist. `Navigation` and
 * `Header` take `items` as a prop precisely so this config can live here —
 * content the shell renders, not content the shell knows about (see
 * `src/layouts/README.md`).
 */
export const PRIMARY_NAV_ITEMS: INavItemConfig[] = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'legal', label: 'Legal', icon: 'scale' },
  { id: 'finance', label: 'Finance', icon: 'report-money' },
  { id: 'operations', label: 'Operations', icon: 'settings' },
  { id: 'people', label: 'People', icon: 'users' },
  { id: 'knowledge', label: 'Knowledge', icon: 'brain' },
  { id: 'itHelp', label: 'IT Help', icon: 'help-circle' }
];
