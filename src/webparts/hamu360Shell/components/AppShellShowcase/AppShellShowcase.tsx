import * as React from 'react';

import { Stack } from '@components/Stack';
import { PRIMARY_NAV_ITEMS } from '@config/navigation';
import { AppShell } from '@layouts/AppShell';

import styles from './AppShellShowcase.module.scss';
import type { IAppShellShowcaseProps } from './IAppShellShowcaseProps';

const CHECKLIST_ITEMS: string[] = [
  'All seven nav items are visible, in order: Home · Legal · Finance · Operations · People · Knowledge · IT help.',
  'Clicking a nav item highlights it (gold, active state) — nothing navigates, by design.',
  'Scroll this page: the navy header bar stays pinned to the top of the viewport.',
  'Resize the window below ~768px (the Sprint 1 "tablet" breakpoint): the nav collapses behind a hamburger toggle in the header’s top-right.',
  'The user menu in the header shows initials + name sourced from the mock identity service (local workbench) or the real signed-in user (a real SharePoint site).'
];

/**
 * TEMPORARY Sprint 2 verification page. Exists only to prove `AppShell`
 * renders correctly inside a real SharePoint page before Sprint 3 feature
 * work begins — same lifecycle Sprint 1's `DesignSystemShowcase` had (see
 * that component's now-removed docblock, and `Hamu360Shell.tsx`'s own
 * docblock). Delete this whole folder, and the wiring in `Hamu360Shell.tsx`,
 * once that verification is done and Sprint 3 replaces this with real page
 * content rendered inside `AppShell`'s `children`.
 *
 * Owns the one piece of local state (`activeNavItemId`) that stands in for
 * a router in this sprint — see `AppShell`'s docblock for why swapping this
 * `useState` for a real router later doesn't require touching `AppShell`,
 * `Header`, `Navigation`, or `NavigationItem`.
 */
export default function AppShellShowcase(props: IAppShellShowcaseProps): React.ReactElement {
  const { currentUser, environment } = props;
  const [activeNavItemId, setActiveNavItemId] = React.useState('home');

  return (
    <AppShell
      currentUser={currentUser}
      navItems={PRIMARY_NAV_ITEMS}
      activeNavItemId={activeNavItemId}
      onNavItemSelect={setActiveNavItemId}
    >
      <span className={styles.badge}>Temporary verification page</span>
      <h1 className={styles.title}>Hamu360 Application Shell</h1>
      <p className={styles.subtitle}>
        Sprint 2&apos;s Header, Navigation, Footer, and Main Layout, composed as <code>AppShell</code> and rendered live
        inside SharePoint. This page — not <code>AppShell</code> itself — is removed before Sprint 3 begins.
      </p>

      <Stack direction="column" gap="none" className={styles.checklist}>
        {CHECKLIST_ITEMS.map((item) => (
          <p key={item} className={styles.checklistItem}>
            {item}
          </p>
        ))}
      </Stack>

      <p className={styles.statusLine}>
        Active nav item: <span className={styles.statusValue}>{activeNavItemId}</span> &middot; Environment:{' '}
        <span className={styles.statusValue}>{environment}</span> &middot; Signed in as:{' '}
        <span className={styles.statusValue}>{currentUser.displayName}</span>
      </p>

      <Stack direction="column" gap="lg" className={styles.checklist} as="div">
        <div className={styles.fillerBlock}>
          Scroll filler block 1 of 3 — keep scrolling to watch the header stay stuck to the top.
        </div>
        <div className={styles.fillerBlock}>Scroll filler block 2 of 3.</div>
        <div className={styles.fillerBlock}>
          Scroll filler block 3 of 3 — you should be able to see the Footer&apos;s dark band just below this.
        </div>
      </Stack>
    </AppShell>
  );
}
