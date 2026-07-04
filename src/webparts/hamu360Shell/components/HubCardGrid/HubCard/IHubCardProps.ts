import type { IconName } from '@components/Icon';
import type { HubIconVariant } from '@config/hubTiles';

export interface IHubCardProps {
  icon: IconName;
  iconVariant: HubIconVariant;
  title: string;
  subtitle: string;
  /** The full accent-colored border treatment — only the MP Command Centre tile uses this today. @default false */
  highlighted?: boolean;
  /**
   * Fired on activation (click or keyboard). Named `onSelect`, not
   * `onClick`, per the Sprint 4 brief — this is a "the user chose this
   * hub" domain event, not a raw DOM event pass-through; it currently does
   * nothing but log/update local state (see `HubCardShowcase`), the same
   * inert-until-wired pattern as Sprint 2's `NavigationItem.onClick`. Real
   * navigation to the destination hub is explicitly out of scope for this
   * sprint.
   */
  onSelect: () => void;
  className?: string;
}
