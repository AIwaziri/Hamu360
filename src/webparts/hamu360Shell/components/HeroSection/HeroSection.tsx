import * as React from 'react';

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
        <PartnerMessageCard message={partnerMessage} />
        <AnnouncementsFeed items={announcements} />
        <QuickLinksGrid items={quickLinks} />
      </Grid>
    </div>
  );
}
