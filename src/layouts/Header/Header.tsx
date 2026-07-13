import * as React from 'react';

import { Button } from '@components/Button';
import { Container } from '@components/Container';
import { Icon } from '@components/Icon';
import { Navigation } from '@layouts/Navigation';
import { classNames, getInitials } from '@utils/index';

import styles from './Header.module.scss';
import type { IHeaderProps } from './IHeaderProps';
import { Logo } from './Logo';

const PRIMARY_NAVIGATION_ID = 'primary-navigation';

/**
 * The application's top chrome: logo, primary navigation, and a user menu
 * placeholder, sticky on scroll. Below the `tablet` breakpoint, `Navigation`
 * collapses into a dropdown panel toggled by a hamburger `Button` — see
 * `Header.module.scss`'s `.nav`/`.navOpen` rules for the breakpoint-driven
 * CSS half of that, and this file's `isMobileNavOpen` state for the toggle
 * half.
 *
 * Everything content-specific (which seven destinations exist, which one is
 * active, what happens on click) arrives entirely through props — `Header`
 * itself has no routing or audience-targeting logic and never will. See
 * `AppShell`'s docblock for the full explanation of why that boundary is
 * what lets Sprint 4/6 extend this without a rewrite.
 */
export function Header(props: IHeaderProps): React.ReactElement {
  const { currentUser, navItems, activeNavItemId, onNavItemSelect, className } = props;
  const [isMobileNavOpen, setIsMobileNavOpen] = React.useState(false);

  const closeMobileNav = React.useCallback(() => setIsMobileNavOpen(false), []);

  const handleNavItemSelect = React.useCallback(
    (id: string) => {
      onNavItemSelect?.(id);
      closeMobileNav();
    },
    [onNavItemSelect, closeMobileNav]
  );

  // Keyboard escape hatch for the mobile dropdown — cheap to add, expected
  // behavior for any dismissible panel under WCAG's keyboard-operability
  // guidance.
  React.useEffect(() => {
    if (!isMobileNavOpen) {
      return undefined;
    }
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        closeMobileNav();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileNavOpen, closeMobileNav]);

  return (
    <header className={classNames(styles.root, className)}>
      <Container maxWidth="desktop" className={styles.bar}>
        <Logo />

        <Navigation
          id={PRIMARY_NAVIGATION_ID}
          items={navItems}
          activeItemId={activeNavItemId}
          onItemSelect={handleNavItemSelect}
          className={classNames(styles.nav, isMobileNavOpen && styles.navOpen)}
        />

        <div className={styles.right}>
          {/*
            Sprint A2: decorative search box, matching the wireframe's
            `.srch` (`<div class="srch"><i class="ti ti-search"></i> Search
            HOS…</div>`) — a static placeholder in the wireframe itself, not
            a working control. There is no search service anywhere in this
            codebase yet (no `ISearchService`, no hook, nothing in
            `ServiceFactory`), so this is rendered as an inert `<div>`, not a
            `<button>`/`<input>` — a real interactive element that did
            nothing on activation would be a worse, actively misleading
            outcome than reproducing the wireframe's own non-interactive
            treatment faithfully. `aria-hidden` on the whole block for the
            same reason decorative icons get it elsewhere in this codebase:
            there is nothing here for assistive tech to usefully announce
            until this becomes a real control. See `Header.module.scss`'s
            `.search` docblock for the token approximation this uses, and
            `HubCardGrid`'s existing "IT help" nav item / this same search
            box for why an inert placeholder is preferable to a fake one.
          */}
          <div className={styles.search} aria-hidden="true">
            <Icon name="search" size="sm" className={styles.searchIcon} />
            <span className={styles.searchText}>Search HOS…</span>
          </div>

          {/*
            User menu placeholder. Intentionally inert (no dropdown, no
            sign-out) — there is no real auth context in Sprint 2. `currentUser`
            is sourced from `ServiceFactory.createCurrentUserService()` one
            layer up (the web part), which already resolves to
            `context.pageContext.user` in production and only falls back to
            `MockCurrentUserService` in the local workbench — see
            `IHeaderProps.ts`'s docblock.

            Sprint A2: the wireframe's `.nav-av` is the avatar alone — no
            adjacent name text in the nav bar (`.nav-r` only has `.srch` and
            `.nav-av`). `.userName` is kept in the DOM (visually hidden, not
            removed) rather than deleted outright: the button's own
            `aria-label` already carries "Signed in as {name}" as the
            accessible name, so a *visible* second copy of the same text was
            both a wireframe mismatch and redundant for screen reader users
            (who would otherwise hear the name twice — once from the
            `aria-label`, once from the visible text node). Hiding it is a
            strict improvement on both axes, not just a visual-match
            compromise.
          */}
          <button type="button" className={styles.userMenu} aria-label={`Signed in as ${currentUser.displayName}`}>
            <span className={styles.avatar} aria-hidden="true">
              {getInitials(currentUser.displayName)}
            </span>
            <span className={styles.userName}>{currentUser.displayName}</span>
          </button>

          <Button
            variant="icon"
            className={styles.mobileToggle}
            aria-label={isMobileNavOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMobileNavOpen}
            aria-controls={PRIMARY_NAVIGATION_ID}
            onClick={() => setIsMobileNavOpen((current) => !current)}
          >
            <Icon name={isMobileNavOpen ? 'x' : 'menu'} />
          </Button>
        </div>
      </Container>
    </header>
  );
}
