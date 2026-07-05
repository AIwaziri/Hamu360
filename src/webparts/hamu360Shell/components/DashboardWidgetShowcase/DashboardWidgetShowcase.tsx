import * as React from 'react';

import { Container } from '@components/Container';
import { Section } from '@components/Section';
import { Stack } from '@components/Stack';
import { SG_HOS_ALL_STAFF } from '@config/groups';
import { HUB_TILES } from '@config/hubTiles';
import { PRIMARY_NAV_ITEMS } from '@config/navigation';
import { AppShell } from '@layouts/AppShell';
import { MockAudienceService } from '@services/Mock/MockAudienceService';

import { DashboardWidgetGrid } from '../DashboardWidgetGrid';
import { HeroSection } from '../HeroSection';
import { HubCardGrid } from '../HubCardGrid';
import styles from './DashboardWidgetShowcase.module.scss';
import type { IDashboardWidgetShowcaseProps } from './IDashboardWidgetShowcaseProps';

const CHECKLIST_ITEMS: string[] = [
  'Scroll the "Full Home page preview" section below — Header, Hero, Team Hub Cards, and the four Dashboard Widgets should all be visible together for the first time in this build, matching the approved wireframe\'s Home page top-to-bottom.',
  "Each of the four widget cards (Upcoming events, New joiners, Regulatory updates, Firm wins) shows exactly 4 items, except New Joiners which shows exactly 3 — matching the Platform Readiness Gate's documented seed row counts.",
  "Resize the window (or use devtools' responsive mode) across the mobile/tablet/laptop breakpoints — the 4-widget row should degrade 1 → 2 → 4 columns, independently of the 5-tile hub row above it.",
  "Every widget row is static (no buttons, no links) except the hub cards above them, which remain keyboard-navigable per Sprint 4 — Tab through the page to confirm nothing in this sprint's new widgets traps or skips focus.",
  "None of the four widgets change when the Team Hub Cards row's audience would change (there is no toggle on this page — see this component's own docblock for why) — all four are SG-HOS-AllStaff visible with no per-item filtering, per this sprint's explicit non-goals."
];

/**
 * TEMPORARY Sprint 5 verification page — same lifecycle as every prior
 * sprint's showcase (`HubCardShowcase`, now removed, said to delete itself
 * "once Sprint 5 replaces it", which is exactly what this change is).
 * Delete this whole folder, and the wiring in `Hamu360Shell.tsx`, once this
 * verification is done and Sprint 6 replaces it with the real Home page.
 *
 * ## Why this page has no toggle, unlike `HubCardShowcase`
 *
 * `HubCardGrid` is rendered here too (as part of the "full Home page
 * preview" this sprint's brief specifically asks for), which means it still
 * needs a `userGroups` array to filter against. This component constructs
 * its own `MockAudienceService()` with no arguments — its default,
 * least-privileged `[SG_HOS_ALL_STAFF]` group set — rather than reaching
 * for `ServiceFactory.createAudienceService()`: that factory function needs
 * a real `WebPartContext`/`IEnvironmentConfig`, neither of which reaches
 * this deep into the component tree (`Hamu360Shell` only forwards
 * `environment: EnvironmentName`, a display string, not the full config).
 * This is a different reason for the same "construct `MockAudienceService`
 * directly" exception `HubCardShowcase` used — that one needed two
 * *different* instances to drive a live toggle; this one needs exactly the
 * one instance the real web part would end up with anyway, just without a
 * factory function available at this layer to get it from. Audience
 * filtering itself isn't being re-verified here — Sprint 4 already proved
 * that live, tile-by-tile — so a static default is all the Team Hub Cards
 * row's rendering needs to demonstrate the full page assembling correctly.
 *
 * ## Why `DashboardWidgetGrid` doesn't get the same "standalone + nested" split treated as two different demos
 *
 * Every prior sprint's showcase rendered its new component both in
 * isolation and inside `AppShell`. This page does that too (see the first
 * `Section` below), but the brief for this sprint specifically frames the
 * `AppShell`-nested render as the more important of the two: "the first
 * sprint where the full Home page composition becomes visible in one
 * place... treat this showcase as a preview of the real Home page, not
 * just an isolated component test." The standalone section exists for a
 * quick visual gut-check of `DashboardWidgetGrid` alone; the full
 * `AppShell` composition below it is the actual point of this sprint's
 * showcase.
 */
export default function DashboardWidgetShowcase(props: IDashboardWidgetShowcaseProps): React.ReactElement {
  const {
    currentUser,
    partnerMessage,
    announcements,
    quickLinks,
    events,
    newJoiners,
    regulatoryUpdates,
    firmWins,
    environment
  } = props;
  const [activeNavItemId, setActiveNavItemId] = React.useState('home');
  const [lastSelectedTileId, setLastSelectedTileId] = React.useState<string | undefined>(undefined);
  const [userGroups, setUserGroups] = React.useState<string[]>([SG_HOS_ALL_STAFF]);

  React.useEffect(() => {
    let isCancelled = false;
    // See this component's own docblock for why this constructs
    // `MockAudienceService` directly (with its default argument) instead of
    // going through `ServiceFactory.createAudienceService()`.
    new MockAudienceService()
      .getUserGroups()
      .then((groups) => {
        if (!isCancelled) {
          setUserGroups(groups);
        }
      })
      .catch(() => {
        /* MockAudienceService never rejects; this exists only to satisfy no-floating-promises. */
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <>
      <Section spacing="lg">
        <Container maxWidth="desktop">
          <span className={styles.badge}>Temporary verification page</span>
          <h1 className={styles.title}>Hamu360 Dashboard Widgets</h1>
          <p className={styles.subtitle}>
            Sprint 5&apos;s <code>DashboardWidgetGrid</code> (Upcoming events, New joiners, Regulatory updates, Firm
            wins) — plus the first full assembly of every sprint built so far. This page is removed before Sprint 6
            begins; <code>DashboardWidgetGrid</code> and its four children are not.
          </p>
          <p className={styles.statusLine}>
            Environment: <span className={styles.statusValue}>{environment}</span> &middot; Signed in as:{' '}
            {currentUser.displayName}
          </p>
          <Stack direction="column" gap="none" className={styles.checklist}>
            {CHECKLIST_ITEMS.map((item) => (
              <p key={item} className={styles.checklistItem}>
                {item}
              </p>
            ))}
          </Stack>
        </Container>
      </Section>

      <Section spacing="lg">
        <Container maxWidth="desktop">
          <h2 className={styles.sectionHeading}>Dashboard widgets — standalone</h2>
          <p className={styles.sectionCaption}>
            <code>DashboardWidgetGrid</code> on its own, outside <code>AppShell</code>, for a quick isolated check.
          </p>
          <DashboardWidgetGrid
            events={events}
            newJoiners={newJoiners}
            regulatoryUpdates={regulatoryUpdates}
            firmWins={firmWins}
          />
        </Container>
      </Section>

      <Section spacing="lg">
        <Container maxWidth="desktop">
          <h2 className={styles.sectionHeading}>Full Home page preview</h2>
          <p className={styles.sectionCaption}>
            Header, Hero, Team Hub Cards, and Dashboard Widgets together — the same order as the approved
            wireframe&apos;s Home page, assembled for the first time in this build.
          </p>
        </Container>
      </Section>

      <AppShell
        currentUser={currentUser}
        navItems={PRIMARY_NAV_ITEMS}
        activeNavItemId={activeNavItemId}
        onNavItemSelect={setActiveNavItemId}
        mainSpacing="none"
      >
        <HeroSection partnerMessage={partnerMessage} announcements={announcements} quickLinks={quickLinks} />
        <Section spacing="lg">
          <Container maxWidth="desktop">
            <h2 className={styles.sectionHeading}>Team hubs — go to your workspace</h2>
            <HubCardGrid tiles={HUB_TILES} userGroups={userGroups} onSelectTile={setLastSelectedTileId} />
          </Container>
        </Section>
        <Section spacing="lg">
          <Container maxWidth="desktop">
            <h2 className={styles.sectionHeading}>What&apos;s happening at Hamu Legal</h2>
            <DashboardWidgetGrid
              events={events}
              newJoiners={newJoiners}
              regulatoryUpdates={regulatoryUpdates}
              firmWins={firmWins}
            />
          </Container>
        </Section>
        <p className={styles.statusLine}>
          Last selected hub tile: <span className={styles.statusValue}>{lastSelectedTileId ?? '(none yet)'}</span>
        </p>
      </AppShell>
    </>
  );
}
