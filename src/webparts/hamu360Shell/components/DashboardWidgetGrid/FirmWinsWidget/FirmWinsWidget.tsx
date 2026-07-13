import * as React from 'react';

import { EmptyState } from '@components/EmptyState';
import { Icon, type IconName } from '@components/Icon';
import { Stack } from '@components/Stack';
import type { IFirmWin } from '@models/index';
import { classNames } from '@utils/index';

import styles from './FirmWinsWidget.module.scss';
import type { IFirmWinsWidgetProps } from './IFirmWinsWidgetProps';

const DISPLAY_LIMIT = 4;

/**
 * `category` is real List data (a choice column); the icon and display
 * label per category are presentation-only derivations of it, not
 * themselves List columns — the real "Firm Wins" List has no "icon name"
 * field to mirror, so inventing one on `IFirmWin` would misrepresent the
 * List's actual schema. Matches the wireframe's fixed pairing exactly:
 * Ranking → award, NewClient → handshake, MatterClosed → file-check,
 * Knowledge → star.
 */
const CATEGORY_ICON: Record<IFirmWin['category'], IconName> = {
  Ranking: 'award',
  NewClient: 'handshake',
  MatterClosed: 'file-check',
  Knowledge: 'star'
};

/** `category`'s raw PascalCase List value → the wireframe's upper-case-with-spaces display text (`.wrtag`). */
const CATEGORY_LABEL: Record<IFirmWin['category'], string> = {
  Ranking: 'RANKING',
  NewClient: 'NEW CLIENT',
  MatterClosed: 'MATTER CLOSED',
  Knowledge: 'KNOWLEDGE'
};

/**
 * "Top 4, most recent first" selection lives here, not in `IFirmWinsService`
 * — same division of responsibility as `EventsWidget`/
 * `RegulatoryUpdatesWidget`. The real "Firm Wins" List has a "Default" view
 * (no server-side sort configured), so this component owns ordering.
 */
function selectRecentWins(items: IFirmWin[]): IFirmWin[] {
  return [...items].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, DISPLAY_LIMIT);
}

/**
 * Wireframe widget 4 of 4: "Firm wins" (`.wt` "Firm wins" + four `.wr`
 * entries, each a category icon + category tag + summary text).
 *
 * Same "grouped by Category" reading as `RegulatoryUpdatesWidget` applies
 * here — the wireframe renders a flat list with an inline per-row category
 * tag, not four category-headed sections. See that component's docblock for
 * the full reasoning; this component makes the identical interpretive
 * choice for consistency between the two "grouped by X" widgets in this
 * sprint.
 *
 * ## Sprint 6: empty state, no props change
 *
 * `firmWins` can legitimately be `[]` — rendering `EmptyState` in that case
 * is an internal branch on the same `IFirmWin[]` prop.
 */
export function FirmWinsWidget(props: IFirmWinsWidgetProps): React.ReactElement {
  const { firmWins, className } = props;
  const recent = selectRecentWins(firmWins);

  return (
    <div className={classNames(styles.card, className)}>
      {/* Sprint A3: `size="md"` — see NewJoinersWidget.tsx's identical note.
          (The per-row category icon below, `.wric i` in the wireframe, is
          already an exact 11px match at `size="sm"` and is left unchanged.) */}
      <p className={styles.title}>
        <Icon name="trophy" size="md" className={styles.titleIcon} />
        Firm wins
      </p>
      {recent.length === 0 ? (
        <EmptyState title="No firm wins yet" />
      ) : (
        <Stack as="ul" direction="column" gap="none">
          {recent.map((win) => (
            <li key={win.id} className={styles.row}>
              <span className={styles.iconBox} aria-hidden="true">
                <Icon name={CATEGORY_ICON[win.category]} size="sm" />
              </span>
              <div>
                <span className={styles.tag}>{CATEGORY_LABEL[win.category]}</span>
                <p className={styles.winTitle}>{win.title}</p>
              </div>
            </li>
          ))}
        </Stack>
      )}
    </div>
  );
}
