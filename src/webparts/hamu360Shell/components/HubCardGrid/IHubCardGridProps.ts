import type { IHubTileConfig } from '@config/hubTiles';

export interface IHubCardGridProps {
  /**
   * Every configured tile, unfiltered — today always `HUB_TILES` from
   * `@config/hubTiles`, but this component doesn't assume that; it just
   * renders whatever it's given, minus whatever `userGroups` doesn't
   * qualify for.
   */
  tiles: IHubTileConfig[];
  /**
   * The current user's group memberships, exactly as `IAudienceService.getUserGroups()`
   * resolves them — a plain `string[]`, nothing more. See this component's
   * own docblock for the full explanation of why this one prop is the
   * entire surface area Sprint 6's real Graph integration needs to change.
   */
  userGroups: string[];
  onSelectTile?: (id: string) => void;
  className?: string;
}
