import * as React from 'react';

import { Container } from '@components/Container';
import { ErrorState } from '@components/ErrorState';
import { Section } from '@components/Section';
import { Skeleton } from '@components/Skeleton';
import { HUB_TILES } from '@config/hubTiles';
import { PRIMARY_NAV_ITEMS } from '@config/navigation';
import { AppShell } from '@layouts/AppShell';

import { DashboardWidgetGrid } from '../DashboardWidgetGrid';
import { HeroSection } from '../HeroSection';
import { HubCardGrid } from '../HubCardGrid';
import styles from './HomePage.module.scss';
import type { IHomePageProps } from './IHomePageProps';

/**
 * The real Hamu360 Home page. Replaces Sprint 5's `DashboardWidgetShowcase`
 * (temporary verification page, now deleted — see this sprint's checklist)
 * as what `Hamu360Shell` mounts. The composition below is identical to the
 * "Full Home page preview" section of that showcase — `AppShell` wrapping
 * `HeroSection`, a "Team hubs" section rendering `HubCardGrid`, and a
 * "What's happening at Hamu Legal" section rendering `DashboardWidgetGrid`
 * — because that composition was already verified against the wireframe in
 * Sprint 5. Sprint 6 changes what *feeds* this tree (real services instead
 * of mocks), not the tree itself, per the brief's explicit instruction not
 * to touch `HeroSection`/`HubCardGrid`/`DashboardWidgetGrid`.
 *
 * ## Where loading / error / empty handling actually lives
 *
 * The brief asks for "every widget" to handle loading, empty, and error
 * states. The individual child widgets (`AnnouncementsFeed`,
 * `QuickLinksGrid`, `EventsWidget`, `NewJoinersWidget`,
 * `RegulatoryUpdatesWidget`, `FirmWinsWidget`) already handle their own
 * *empty* case internally (Sprint 6 addition, props unchanged — see their
 * docblocks). But *loading* and *page-critical error* cannot be pushed down
 * to those same widgets without changing what data they're given: every
 * one of them still takes a plain `T[]` prop, and the brief explicitly
 * forbids reshaping `HeroSection`/`HubCardGrid`/`DashboardWidgetGrid` (or
 * their children) to accommodate anything richer, such as the
 * already-unused `AsyncState<T, E>` type sitting in `src/types/common.ts`
 * since Sprint 0's `ARCHITECTURE.md`. So this component is where that
 * handling is forced to live instead:
 *
 * - `pageStatus === 'loading'` — a full-page `Skeleton` treatment. `Hamu360ShellWebPart.onInit()`
 *   calls `this.render()` synchronously before its first `await`, so this
 *   branch is what a user actually sees for the (usually sub-second, but
 *   not zero) time between the web part mounting and `currentUser`
 *   resolving.
 * - `pageStatus === 'error'` — a single page-critical `ErrorState`, shown
 *   only when `currentUser` itself failed to load (see
 *   `Hamu360ShellWebPart.onInit()`): with no identity, there is no page to
 *   render at all, so this is the one failure treated as blocking rather
 *   than degrading.
 * - `failedSections.length > 0` — a single non-blocking notice banner
 *   above the page content, naming which of the eight non-critical
 *   datasets silently fell back to an empty/safe value (see
 *   `Hamu360ShellWebPart.onInit()`'s `Promise.allSettled` handling). This
 *   is coarse-grained (page-level, not per-widget) for the same reason:
 *   there is nowhere inside `HeroSection`/`HubCardGrid`/`DashboardWidgetGrid`
 *   this sprint is allowed to plumb a per-section error flag into.
 *
 * This is the "genuine architecture gap" the brief's closing question asks
 * to have surfaced: today's component props can express "I have data" or
 * "I have no data" but not "I don't know yet" or "I failed to find out."
 * Wiring `AsyncState<T, E>` all the way down through
 * `HeroSection`/`HubCardGrid`/`DashboardWidgetGrid`'s child props would be
 * the real fix, and is a worthwhile Sprint 7 candidate — deliberately not
 * done here, per this sprint's explicit scope boundary.
 */
export default function HomePage(props: IHomePageProps): React.ReactElement {
  const {
    currentUser,
    partnerMessage,
    announcements,
    quickLinks,
    userGroups,
    events,
    newJoiners,
    regulatoryUpdates,
    firmWins,
    pageStatus,
    loadError,
    failedSections
  } = props;

  const [activeNavItemId, setActiveNavItemId] = React.useState('home');

  if (pageStatus === 'loading') {
    return (
      <div className={styles.loadingRoot}>
        <Skeleton height="48px" className={styles.loadingBar} />
        <Skeleton height="220px" className={styles.loadingBar} />
        <Skeleton height="140px" className={styles.loadingBar} />
        <Skeleton height="280px" />
      </div>
    );
  }

  if (pageStatus === 'error') {
    return (
      <Section spacing="lg">
        <Container maxWidth="desktop">
          <ErrorState
            title="We couldn't load your Hamu360 home page"
            description={loadError ?? 'Your account details could not be retrieved. Try reloading the page.'}
          />
        </Container>
      </Section>
    );
  }

  return (
    <>
      {failedSections.length > 0 ? (
        <Section spacing="sm" className={styles.failedSectionsNotice}>
          <Container maxWidth="desktop">
            <ErrorState
              title="Some sections couldn't be updated"
              description={`The following sections are showing no items instead of the latest data: ${failedSections.join(
                ', '
              )}. The rest of the page loaded normally.`}
            />
          </Container>
        </Section>
      ) : undefined}

      <AppShell
        currentUser={currentUser}
        navItems={PRIMARY_NAV_ITEMS}
        activeNavItemId={activeNavItemId}
        onNavItemSelect={setActiveNavItemId}
        mainSpacing="none"
      >
        <HeroSection partnerMessage={partnerMessage} announcements={announcements} quickLinks={quickLinks} />

        {/*
          Sprint A1: matches the wireframe's `.body { padding: 14px 18px;
          display: flex; flex-direction: column; gap: 13px; }` — the single
          flex wrapper holding the "Team hubs" and "What's happening" blocks
          directly below the hero band. See `HomePage.module.scss`'s
          `.sectionsBody` docblock for why this replaced two independent
          `<Section spacing="lg"><Container maxWidth="desktop">` blocks (a
          real, measured spacing regression fixed this sprint): those
          produced a ~48px gap between the two rows against the wireframe's
          13px, and nested a redundant second `Container` inside the one
          `MainLayout` already provides.
        */}
        <div className={styles.sectionsBody}>
          <div>
            <h2 className={styles.sectionHeading}>Team hubs — go to your workspace</h2>
            {/*
              No `onSelectTile` handler yet — there is still no router in
              this codebase (see `AppShell`'s own docblock), so there is
              nothing real to do with a tile selection yet. The Sprint 4/5
              showcases wired this to local `useState` purely to prove the
              callback fires; the real Home page has nothing to wire it to
              until routing exists, so it is left `undefined` (the prop is
              optional) rather than kept as unused placeholder state.
            */}
            <HubCardGrid tiles={HUB_TILES} userGroups={userGroups} />
          </div>

          <div>
            <h2 className={styles.sectionHeading}>What&apos;s happening at Hamu Legal</h2>
            <DashboardWidgetGrid
              events={events}
              newJoiners={newJoiners}
              regulatoryUpdates={regulatoryUpdates}
              firmWins={firmWins}
            />
          </div>
        </div>
      </AppShell>
    </>
  );
}
