import type * as React from 'react';

import type { ContainerMaxWidth } from '@components/Container';
import type { INavItemConfig } from '@config/navigation';
import type { ICurrentUser } from '@models/index';

export interface IAppShellProps {
  currentUser: ICurrentUser;
  navItems: INavItemConfig[];
  activeNavItemId?: string;
  onNavItemSelect?: (id: string) => void;
  /** Forwarded to `MainLayout`. @default 'desktop' */
  mainMaxWidth?: ContainerMaxWidth;
  className?: string;
  /** The page content Sprint 3+ will render inside `MainLayout`. Sprint 2 has none of its own — see the temporary `AppShellShowcase` in the web part for verification content. */
  children: React.ReactNode;
}
