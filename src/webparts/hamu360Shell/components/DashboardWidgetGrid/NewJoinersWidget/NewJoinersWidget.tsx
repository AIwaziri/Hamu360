import * as React from 'react';

import { Icon } from '@components/Icon';
import { Stack } from '@components/Stack';
import { classNames, formatMonthYear, getInitials } from '@utils/index';

import type { INewJoinersWidgetProps } from './INewJoinersWidgetProps';
import styles from './NewJoinersWidget.module.scss';

/**
 * Wireframe widget 2 of 4: "New joiners" (`.wt` "New joiners" + three `.jr`
 * rows + a static "Birthdays & work anniversaries — coming in V2" note).
 *
 * ## Why this component has no `selectRecent*`/sort function, unlike its three siblings
 *
 * `EventsWidget`, `RegulatoryUpdatesWidget`, and `FirmWinsWidget` all do
 * their own "top N" selection over a full, unsorted dataset, because their
 * three source Lists (Events, Regulatory Updates, Firm Wins) each have only
 * a "Default" view configured (`HOS_Platform_Readiness_Gate_v1.md` §3.4) —
 * nothing upstream does that filtering/ordering for them.
 *
 * "Employee Onboarding" (this widget's source List) is different: it has a
 * dedicated, purpose-built "90-Day filtered view" — the only one of this
 * sprint's four Lists with a named view rather than "Default". A view like
 * that exists specifically so a caller queries *through* it and gets
 * already-windowed results back, rather than pulling the full List and
 * filtering client-side. Re-implementing a "last 90 days" date check here
 * would mean this component and the live SharePoint view would both be
 * enforcing the same rule in two places — and if they ever drifted (e.g.
 * the view's window changes to 60 days), this component would silently
 * disagree with the platform of record. So this component trusts its input
 * completely: whatever `newJoiners` it receives is exactly what renders, in
 * that order, no re-filtering, no re-sorting. `INewJoinersService`'s own
 * docblock places the corresponding responsibility on Sprint 6's real
 * implementation (query through the view, or reproduce its filter
 * server-side) — never on this component.
 *
 * Avatar initials come from `getInitials` (promoted this sprint from a
 * private `Header.tsx` helper — see that util's docblock) rather than a
 * modeled `initials` field, since initials are trivially derivable from
 * `name` and the real List has no separate initials column to mirror.
 */
export function NewJoinersWidget(props: INewJoinersWidgetProps): React.ReactElement {
  const { newJoiners, className } = props;

  return (
    <div className={classNames(styles.card, className)}>
      <p className={styles.title}>
        <Icon name="user-plus" size="sm" />
        New joiners
      </p>
      <Stack as="ul" direction="column" gap="none">
        {newJoiners.map((joiner) => (
          <li key={joiner.id} className={styles.row}>
            <span
              className={classNames(styles.avatar, joiner.avatarVariant === 'primary' && styles.avatarPrimary)}
              aria-hidden="true"
            >
              {getInitials(joiner.name)}
            </span>
            <div className={styles.info}>
              <p className={styles.name}>{joiner.name}</p>
              {/* Reproduces the wireframe's own inconsistency faithfully —
                  two of three seed rows show "Department · Role", the third
                  shows Department alone (no `role`). See `INewJoiner.role`'s
                  docblock. */}
              <p className={styles.roleLine}>
                {joiner.role ? `${joiner.department} · ${joiner.role}` : joiner.department}
              </p>
            </div>
            <span className={styles.badge}>{formatMonthYear(joiner.joinDate)}</span>
          </li>
        ))}
      </Stack>

      {/* Static, non-interactive placeholder — reproduces the wireframe's
          own "coming in V2" note verbatim. Not a real feature; explicitly
          out of scope per this sprint's brief (only the four named widgets
          are being built), included here purely for visual fidelity to the
          approved wireframe's New Joiners card. */}
      <p className={styles.comingSoon}>
        <Icon name="cake" size="sm" />
        Birthdays &amp; work anniversaries — coming in V2
      </p>
    </div>
  );
}
