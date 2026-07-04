import type * as React from 'react';

import type { ContainerMaxWidth } from '@components/Container';
import type { INavItemConfig } from '@config/navigation';
import type { ICurrentUser } from '@models/index';
import type { SpacingToken } from '@theme/spacing';

export interface IAppShellProps {
  currentUser: ICurrentUser;
  navItems: INavItemConfig[];
  activeNavItemId?: string;
  onNavItemSelect?: (id: string) => void;
  /** Forwarded to `MainLayout`. @default 'desktop' */
  mainMaxWidth?: ContainerMaxWidth;
  /**
   * Forwarded to `MainLayout`'s `Section`. Added in Sprint 3 so a full-bleed
   * page section (e.g. `HeroSection`'s navy band, which wants to start
   * immediately below `Header` with no extra gap) can opt into
   * `spacing="none"` — every existing caller is unaffected, since omitting
   * this prop still falls through to `Section`'s own default (`'xl'`).
   */
  mainSpacing?: SpacingToken;
  className?: string;
  /** The page content rendered inside `MainLayout` — Sprint 3's `HeroSection` is the first real example; see the temporary `HeroSectionShowcase` in the web part for how it's wired up. */
  children: React.ReactNode;
}
