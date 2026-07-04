import type { INavItemConfig } from '@config/navigation';

export interface INavigationProps {
  /**
   * Data-driven on purpose — `Navigation` renders whatever it's given and
   * has no opinion on what the seven destinations are. Today the caller
   * passes `PRIMARY_NAV_ITEMS` from `src/config/navigation.ts` verbatim;
   * Sprint 4 can filter that same list by audience before handing it down,
   * and Sprint 6 can attach real `href`s to each entry — neither requires
   * touching this component.
   */
  items: INavItemConfig[];
  /** id of the currently-active item, if any. Purely cosmetic in Sprint 2 — see `NavigationItem`'s `active` prop docblock. */
  activeItemId?: string;
  /** Fired with an item's `id` on click. Sprint 2's showcase just updates local state with this; a router's navigate function is a drop-in replacement. */
  onItemSelect?: (id: string) => void;
  /** Forwarded to the rendered `<nav>` so `Header`'s hamburger toggle can point `aria-controls` at it. */
  id?: string;
  className?: string;
}
