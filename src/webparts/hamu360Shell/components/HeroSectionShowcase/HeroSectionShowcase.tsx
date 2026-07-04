import * as React from 'react';

import { Container } from '@components/Container';
import { Section } from '@components/Section';
import { Stack } from '@components/Stack';
import { PRIMARY_NAV_ITEMS } from '@config/navigation';
import { AppShell } from '@layouts/AppShell';

import { HeroSection } from '../HeroSection';
import styles from './HeroSectionShowcase.module.scss';
import type { IHeroSectionShowcaseProps } from './IHeroSectionShowcaseProps';

const CHECKLIST_ITEMS: string[] = [
  'Standalone (below) and inside AppShell (further down) look identical — HeroSection fills whatever width its parent slot gives it, it does not assert its own max-width.',
  'The navy hero band starts flush against the bottom of the sticky header when inside AppShell (mainSpacing="none") — no extra gap.',
  'Partner Message shows a real name, role, quote, and date — sourced from MockPartnerMessageService, not Lorem Ipsum.',
  'Announcements shows exactly 4 items, pinned item first, rest newest-first.',
  'Quick Links shows exactly 8 tiles in a 2-column grid; resize below ~768px to see it stay 2 columns (Sprint 1’s Grid columns=2 default) while the 3 hero cards above it stack to 1 column.',
  'Every Quick Link tile is a real, focusable, keyboard-activatable <button> — Tab through them to check.'
];

/**
 * TEMPORARY Sprint 3 verification page — same lifecycle as Sprint 2's now-
 * removed `AppShellShowcase` (see that component's former docblock, and
 * `Hamu360Shell.tsx`'s own docblock). Delete this whole folder, and the
 * wiring in `Hamu360Shell.tsx`, once this verification is done and Sprint 4
 * replaces it with real Home page content.
 *
 * Renders `HeroSection` twice on purpose, per the Sprint 3 brief's
 * verification requirement: once standalone (just inside a `Container`, to
 * prove it doesn't depend on `AppShell` for anything) and once nested
 * inside a real `AppShell` (to prove the integration — sticky header,
 * `mainSpacing="none"` flush hero band, footer below). Both should render
 * identically; if they don't, something in `HeroSection` is accidentally
 * depending on `AppShell`/`MainLayout` beyond just "being given a width".
 */
export default function HeroSectionShowcase(props: IHeroSectionShowcaseProps): React.ReactElement {
  const { currentUser, partnerMessage, announcements, quickLinks, environment } = props;
  const [activeNavItemId, setActiveNavItemId] = React.useState('home');

  return (
    <>
      <Section spacing="lg">
        <Container maxWidth="desktop">
          <span className={styles.badge}>Temporary verification page</span>
          <h1 className={styles.title}>Hamu360 Hero Section</h1>
          <p className={styles.subtitle}>
            Sprint 3&apos;s Partner Message, Announcements, and Quick Links, composed as <code>HeroSection</code> and
            rendered live inside SharePoint. This page — not <code>HeroSection</code> or its children — is removed
            before Sprint 4 begins.
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
          <h2 className={styles.sectionHeading}>1. Standalone</h2>
          <p className={styles.sectionCaption}>
            <code>HeroSection</code> mounted directly, outside any <code>AppShell</code>.
          </p>
        </Container>
        <Container maxWidth="desktop">
          <HeroSection partnerMessage={partnerMessage} announcements={announcements} quickLinks={quickLinks} />
        </Container>
      </Section>

      <Section spacing="lg">
        <Container maxWidth="desktop">
          <h2 className={styles.sectionHeading}>2. Inside AppShell</h2>
          <p className={styles.sectionCaption}>
            The same data, the same component, now composed as <code>AppShell</code>&apos;s <code>children</code> —
            environment: {environment}, signed in as {currentUser.displayName}.
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
      </AppShell>
    </>
  );
}
