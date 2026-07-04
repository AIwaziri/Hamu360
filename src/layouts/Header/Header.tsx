import * as React from 'react';

import { Button } from '@components/Button';
import { Container } from '@components/Container';
import { Icon } from '@components/Icon';
import { Navigation } from '@layouts/Navigation';
import { classNames } from '@utils/index';

import styles from './Header.module.scss';
import type { IHeaderProps } from './IHeaderProps';
import { Logo } from './Logo';

const PRIMARY_NAVIGATION_ID = 'primary-navigation';

/** `"Saadatu Hamu Aliyu"` -> `"SH"`. Falls back to the first two characters of a single-word name. */
function getInitials(displayName: string): string {
  const words = displayName.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) {
    return '';
  }
  if (words.length === 1) {
    return words[0]?.slice(0, 2).toUpperCase() ?? '';
  }
  const first = words[0]?.[0] ?? '';
  const last = words[words.length - 1]?.[0] ?? '';
  return `${first}${last}`.toUpperCase();
}

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
            User menu placeholder. Intentionally inert (no dropdown, no
            sign-out) — there is no real auth context in Sprint 2. `currentUser`
            is sourced from `ServiceFactory.createCurrentUserService()` one
            layer up (the web part), which already resolves to
            `context.pageContext.user` in production and only falls back to
            `MockCurrentUserService` in the local workbench — see
            `IHeaderProps.ts`'s docblock.
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
