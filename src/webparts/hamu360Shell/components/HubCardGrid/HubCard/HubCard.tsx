import * as React from 'react';

import { Icon } from '@components/Icon';
import type { HubIconVariant } from '@config/hubTiles';
import { classNames } from '@utils/index';

import styles from './HubCard.module.scss';
import type { IHubCardProps } from './IHubCardProps';

const iconBoxClassNames: Record<HubIconVariant, string> = {
  info: styles.iconInfo,
  success: styles.iconSuccess,
  warning: styles.iconWarning,
  accentTint: styles.iconAccentTint,
  primary: styles.iconPrimary
};

/**
 * One Team Hub tile. Renders a real `<button>` (not a styled `<div>` with a
 * click handler) so it's focusable and activatable with both mouse and
 * keyboard out of the box, with no extra ARIA needed — a native button
 * already has the correct implicit role.
 *
 * Has no idea whether it's allowed to be shown to the current user —
 * `HubCardGrid` decides that before this component is ever mounted (see
 * its docblock). `HubCard` receiving `iconVariant="primary"` and
 * `highlighted` for the MP tile is a *styling* fact, not a *security*
 * fact; nothing in this file checks a group membership.
 */
export function HubCard(props: IHubCardProps): React.ReactElement {
  const { icon, iconVariant, title, subtitle, highlighted = false, onSelect, className } = props;

  return (
    <button
      type="button"
      className={classNames(styles.card, highlighted && styles.highlighted, className)}
      onClick={onSelect}
    >
      <span className={classNames(styles.iconBox, iconBoxClassNames[iconVariant])} aria-hidden="true">
        <Icon name={icon} size="md" />
      </span>
      <span className={styles.title}>{title}</span>
      <span className={styles.subtitle}>{subtitle}</span>
    </button>
  );
}
