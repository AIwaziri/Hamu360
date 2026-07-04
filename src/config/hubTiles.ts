import type { IconName } from '@components/Icon';

import { SG_HOS_MANAGING_PARTNER } from './groups';

/**
 * Closed set of icon/background treatments `HubCard` knows how to render —
 * lives here (not inside the webpart's `HubCard` folder) because
 * `src/config` is a higher layer than any one webpart's component tree:
 * config is allowed to depend on `@components` (generic, shared), but a
 * webpart-specific component must never be depended on by `src/config` —
 * that direction would let a single web part's internals leak into
 * cross-cutting configuration. `HubCard`'s own props import this type from
 * here, not the other way around.
 *
 * - `info`/`success`/`warning` map straight to existing semantic color
 *   pairs (`infoBackground`+`info`, etc.) — Legal/Finance/Operations.
 * - `accentTint` and `primary` are Sprint 4 additions — see
 *   `HubCard.module.scss` for what each renders and, for `accentTint`, a
 *   flagged token gap.
 */
export type HubIconVariant = 'info' | 'success' | 'warning' | 'accentTint' | 'primary';

/**
 * One Team Hub tile. `requiredGroup`, when present, is the SG-HOS-* group a
 * user must belong to for this tile to render at all — see
 * `HubCardGrid`'s docblock for exactly how that's enforced and why
 * swapping the real group-membership source in Sprint 6 never touches
 * `HubCardGrid`/`HubCard`.
 */
export interface IHubTileConfig {
  id: string;
  title: string;
  subtitle: string;
  icon: IconName;
  iconVariant: HubIconVariant;
  /** Gets the additional full accent-colored border treatment. Only the MP Command Centre tile uses this today. @default false */
  highlighted?: boolean;
  /** Omitted = visible to every staff member (no group check at all, not even an implicit "SG-HOS-AllStaff" check). */
  requiredGroup?: string;
}

/**
 * The five tiles from the approved wireframe's "Team hubs — go to your
 * workspace" row (`HOS_All_Departments_Wireframe_v1.html`'s `.hubs` block),
 * in the same order, with the same icons and subtitles. The fifth tile
 * ("Hamu360" / MP Command Centre) is the one this entire sprint's
 * architecture protects — see its `requiredGroup`.
 */
export const HUB_TILES: IHubTileConfig[] = [
  { id: 'legal', title: 'Legal', subtitle: 'CC · GRC · IP · DR', icon: 'scale', iconVariant: 'info' },
  {
    id: 'finance',
    title: 'Finance',
    subtitle: 'Billing · Reports · Budget',
    icon: 'report-money',
    iconVariant: 'success'
  },
  {
    id: 'operations',
    title: 'Operations',
    subtitle: 'CX · Admin · Procurement',
    icon: 'settings',
    iconVariant: 'warning'
  },
  {
    id: 'people',
    title: 'People & Culture',
    subtitle: 'HR · Recruitment · Performance',
    icon: 'heart',
    iconVariant: 'accentTint'
  },
  {
    id: 'mpCommandCentre',
    title: 'Hamu360',
    subtitle: 'MP dashboard',
    icon: 'chart-dots',
    iconVariant: 'primary',
    highlighted: true,
    requiredGroup: SG_HOS_MANAGING_PARTNER
  }
];
