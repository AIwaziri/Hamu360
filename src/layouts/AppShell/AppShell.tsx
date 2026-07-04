import * as React from 'react';

import { Footer } from '@layouts/Footer';
import { Header } from '@layouts/Header';
import { MainLayout } from '@layouts/MainLayout';
import { classNames } from '@utils/index';

import styles from './AppShell.module.scss';
import type { IAppShellProps } from './IAppShellProps';

/**
 * The top-level frame every Hamu360 page will eventually mount inside:
 * `Header` (sticky) + a skip link + `MainLayout` (grows to fill available
 * height) + `Footer`, in a full-height flex column so the footer stays
 * pinned to the bottom of short pages instead of riding up under the
 * content.
 *
 * ## Why this survives Sprint 4 (audience targeting) and Sprint 6 (real
 * routing/data) without a rewrite
 *
 * Every prop `AppShell` takes is *data*, never *logic*:
 * `navItems` (`INavItemConfig[]`), `activeNavItemId`, and `onNavItemSelect`
 * flow straight through to `Header` -> `Navigation` -> `NavigationItem`
 * unchanged. None of those four components has any opinion on:
 *   - **what** the seven destinations are (that's `src/config/navigation.ts`,
 *     today a static array);
 *   - **which** of them should be visible to the signed-in user (Sprint 4's
 *     audience targeting — filtering `PRIMARY_NAV_ITEMS` down to a subset
 *     before it's passed in as `navItems` is a change to *the caller*, not
 *     to `AppShell`/`Header`/`Navigation`/`NavigationItem`);
 *   - **what happens** when one is clicked (`onNavItemSelect` is currently
 *     wired to a `React.useState` in the showcase; swapping it for a real
 *     router's `navigate(path)` — and swapping `NavigationItem`'s `as`
 *     prop from `'button'` to `'a'` with a real `href` once routes exist —
 *     touches the caller and `NavigationItem`'s two rendered tags, not its
 *     public API or `Navigation`'s).
 *
 * `Header` itself follows the same rule for identity: it receives a
 * resolved `ICurrentUser`, never talks to a service. Swapping
 * `MockCurrentUserService` for a real Graph-backed profile service in a
 * later sprint is a one-line change in `ServiceFactory.ts` — nothing in
 * `src/layouts` needs to know.
 *
 * The practical effect: deleting `AppShell` today costs nothing downstream,
 * because nothing downstream exists yet — and building on top of it later
 * costs nothing upstream, because every future capability arrives as a new
 * *value* passed into an existing prop, not a new code path inside these
 * components.
 */
export function AppShell(props: IAppShellProps): React.ReactElement {
  const { currentUser, navItems, activeNavItemId, onNavItemSelect, mainMaxWidth, className, children } = props;

  return (
    <div className={classNames(styles.root, className)}>
      <a href="#main-content" className={styles.skipLink}>
        Skip to main content
      </a>

      <Header
        currentUser={currentUser}
        navItems={navItems}
        activeNavItemId={activeNavItemId}
        onNavItemSelect={onNavItemSelect}
      />

      <MainLayout maxWidth={mainMaxWidth}>{children}</MainLayout>

      <Footer />
    </div>
  );
}
