import * as React from 'react';

import { EmptyState } from '@components/EmptyState';
import { Grid } from '@components/Grid';
import { classNames } from '@utils/index';

import { AnnouncementsFeed } from './AnnouncementsFeed';
import styles from './HeroSection.module.scss';
import type { IHeroSectionProps } from './IHeroSectionProps';
import { PartnerMessageCard } from './PartnerMessageCard';
import { QuickLinksGrid } from './QuickLinksGrid';

/** `"TUESDAY, 4 JULY 2026"` — computed from the real current date, not the wireframe's frozen "24 JUNE 2026". */
function getTodayEyebrow(): string {
  return new Date()
    .toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    .toUpperCase();
}

/**
 * The Home page hero band from the approved wireframe (`.hero`): a live
 * date + static "Good morning, Hamu Legal." greeting over a 3-column grid
 * of `PartnerMessageCard` / `AnnouncementsFeed` / `QuickLinksGrid`.
 *
 * "Hamu Legal" (the firm), not the signed-in user's name, is greeted —
 * matching `HOS_Documentation_v1.md` section 3's "identical for every staff
 * member" home page, and keeping this sprint's explicit non-goal (no
 * audience targeting or personalization anywhere yet) intact.
 *
 * Composed *inside* `AppShell`'s content area, not inside `AppShell`
 * itself — `AppShell`/`MainLayout` remain page-agnostic layout (see their
 * own docblocks); this is real Home page content that gets passed as
 * `AppShell`'s `children`, the same extension point `AppShell`'s docblock
 * already described Sprint 3+ would use.
 *
 * Has no `Container`/max-width of its own — see `HeroSection.module.scss`'s
 * `.root` docblock for why it fills 100% of whatever width its parent slot
 * (`MainLayout`'s own `Container`, normally) already provides, rather than
 * nesting a second one.
 *
 * ## Sprint 6 closeout: this file is now touched, deliberately
 *
 * Sprint 6's brief said `HeroSection` should not be changed to accommodate
 * real data, with reshaping happening entirely in service files. The
 * partner-message author-filter fix requires exactly one exception to that,
 * flagged here rather than made silently: `SharePointPartnerMessageService`
 * can now legitimately resolve to `undefined` ("no post from her this
 * week" — see that service's docblock), and per the fix's own requirement,
 * that must render the existing `EmptyState` component, never
 * `PartnerMessageCard` with fabricated or stale content. `PartnerMessageCard`
 * itself was explicitly off-limits and remains completely unchanged — its
 * props still require a real, fully-populated `IPartnerMessage` whenever it
 * renders at all. The rendering *decision* ("do we have a message to show
 * or not") has to live somewhere, and `HeroSection` — the one component
 * that already owns "which of these three cards go in this grid" — is the
 * smallest-blast-radius place for it: one ternary, no new state, no change
 * to `AnnouncementsFeed`/`QuickLinksGrid`/`PartnerMessageCard`'s own
 * contracts.
 */
export function HeroSection(props: IHeroSectionProps): React.ReactElement {
  const { partnerMessage, announcements, quickLinks, className } = props;

  return (
    <div className={classNames(styles.root, className)}>
      <p className={styles.eyebrow}>{getTodayEyebrow()}</p>
      <h1 className={styles.title}>
        Good morning, <span className={styles.titleAccent}>Hamu Legal.</span>
      </h1>

      <Grid columns={3} gap="sm">
        {partnerMessage ? (
          <PartnerMessageCard message={partnerMessage} />
        ) : (
          <EmptyState icon="message-circle" title="No message from Fali this week" />
        )}
        <AnnouncementsFeed items={announcements} />
        <QuickLinksGrid items={quickLinks} />
      </Grid>
    </div>
  );
}
