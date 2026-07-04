import * as React from 'react';

import { Button } from '@components/Button';
import { Container } from '@components/Container';
import { Section } from '@components/Section';
import { Stack } from '@components/Stack';
import { SG_HOS_ALL_STAFF, SG_HOS_MANAGING_PARTNER } from '@config/groups';
import { HUB_TILES } from '@config/hubTiles';
import { PRIMARY_NAV_ITEMS } from '@config/navigation';
import { AppShell } from '@layouts/AppShell';
import { MockAudienceService } from '@services/Mock/MockAudienceService';

import { HeroSection } from '../HeroSection';
import { HubCardGrid } from '../HubCardGrid';
import styles from './HubCardShowcase.module.scss';
import type { IHubCardShowcaseProps } from './IHubCardShowcaseProps';

const CHECKLIST_ITEMS: string[] = [
  'Toggle to "Simulate: All Staff" — only 4 tiles render (Legal, Finance, Operations, People & Culture). The MP Command Centre tile is not just hidden, it is not in the DOM at all — inspect the page.',
  'Toggle to "Simulate: Managing Partner" — a 5th tile ("Hamu360", gold border) appears.',
  'The only thing that changes between the two states is the userGroups array HubCardGrid receives — open the React DevTools props panel on HubCardGrid to see it directly.',
  'Every visible tile is a real <button> — Tab through them to confirm keyboard focus and activation (Enter/Space) both work.',
  'Clicking a tile updates "Last selected" below via an inert onSelectTile callback — no navigation happens yet, by design.'
];

/**
 * TEMPORARY Sprint 4 verification page — same lifecycle as Sprint 3's now-
 * removed `HeroSectionShowcase`. Delete this whole folder, and the wiring
 * in `Hamu360Shell.tsx`, once this verification is done and Sprint 5
 * replaces it with real Home page content.
 *
 * The toggle below is the whole point of this file. It does NOT flip a
 * boolean that `HubCardGrid` reads — it constructs two different
 * `MockAudienceService` instances (one per simulated identity) and asks
 * each one, through the real `IAudienceService` interface, what groups it
 * has. `HubCardGrid` only ever sees the resulting `string[]`; it has no
 * idea a toggle exists. This is deliberately the *only* place in the whole
 * codebase allowed to construct `MockAudienceService` directly with a
 * non-default argument — everywhere else (the real web part), it's only
 * ever asked for through `ServiceFactory.createAudienceService()`, which
 * always returns the least-privileged default (see that function's
 * docblock).
 */
export default function HubCardShowcase(props: IHubCardShowcaseProps): React.ReactElement {
  const { currentUser, partnerMessage, announcements, quickLinks, environment } = props;
  const [activeNavItemId, setActiveNavItemId] = React.useState('home');
  const [simulateManagingPartner, setSimulateManagingPartner] = React.useState(false);
  const [userGroups, setUserGroups] = React.useState<string[]>([SG_HOS_ALL_STAFF]);
  const [lastSelectedTileId, setLastSelectedTileId] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    let isCancelled = false;
    const simulatedGroups = simulateManagingPartner ? [SG_HOS_ALL_STAFF, SG_HOS_MANAGING_PARTNER] : [SG_HOS_ALL_STAFF];
    const audienceService = new MockAudienceService(simulatedGroups);

    audienceService
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
  }, [simulateManagingPartner]);

  return (
    <>
      <Section spacing="lg">
        <Container maxWidth="desktop">
          <span className={styles.badge}>Temporary verification page</span>
          <h1 className={styles.title}>Hamu360 Team Hub Cards</h1>
          <p className={styles.subtitle}>
            Sprint 4&apos;s <code>HubCardGrid</code>/<code>HubCard</code>, gated by <code>MockAudienceService</code>.
            This page — not <code>HubCardGrid</code> or its children — is removed before Sprint 5 begins.
          </p>

          <div className={styles.togglePanel}>
            <span className={styles.toggleLabel}>Simulate signed-in user</span>
            <Stack direction="row" gap="sm" wrap>
              <Button
                variant={simulateManagingPartner ? 'secondary' : 'primary'}
                onClick={() => setSimulateManagingPartner(false)}
                aria-pressed={!simulateManagingPartner}
              >
                Simulate: All Staff
              </Button>
              <Button
                variant={simulateManagingPartner ? 'primary' : 'secondary'}
                onClick={() => setSimulateManagingPartner(true)}
                aria-pressed={simulateManagingPartner}
              >
                Simulate: Managing Partner
              </Button>
            </Stack>
            <p className={styles.statusLine}>
              Current simulated groups: <span className={styles.statusValue}>{userGroups.join(', ')}</span>
            </p>
          </div>

          <Stack direction="column" gap="none" className={styles.checklist}>
            {CHECKLIST_ITEMS.map((item) => (
              <p key={item} className={styles.checklistItem}>
                {item}
              </p>
            ))}
          </Stack>

          <p className={styles.statusLine}>
            Last selected tile: <span className={styles.statusValue}>{lastSelectedTileId ?? '(none yet)'}</span>{' '}
            &middot; Environment: {environment} &middot; Signed in as: {currentUser.displayName}
          </p>
        </Container>
      </Section>

      <Section spacing="lg">
        <Container maxWidth="desktop">
          <h2 className={styles.sectionHeading}>Team hubs — go to your workspace</h2>
          <p className={styles.sectionCaption}>
            Standalone, outside <code>AppShell</code> — the same <code>HubCardGrid</code> that also renders below,
            inside <code>AppShell</code>.
          </p>
          <HubCardGrid tiles={HUB_TILES} userGroups={userGroups} onSelectTile={setLastSelectedTileId} />
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
      </AppShell>
    </>
  );
}
