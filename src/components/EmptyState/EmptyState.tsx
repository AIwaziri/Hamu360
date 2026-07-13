import * as React from 'react';

import { Icon } from '@components/Icon';
import { Stack } from '@components/Stack';
import { classNames } from '@utils/index';

import styles from './EmptyState.module.scss';
import type { IEmptyStateProps } from './IEmptyStateProps';

/**
 * "This List has zero items" — a real, expected state a live SharePoint
 * List can be in, distinct from still-loading or errored. Renders in place
 * of whatever list/grid markup a widget would otherwise show.
 *
 * New in Sprint 6 — see `Skeleton`'s docblock for why this component
 * (along with `ErrorState`) didn't exist before this sprint.
 */
export function EmptyState(props: IEmptyStateProps): React.ReactElement {
  const { icon = 'inbox', title, description, className } = props;

  return (
    <Stack direction="column" gap="xs" align="center" className={classNames(styles.root, className)}>
      {/* Sprint A6: `xl` — same 26px rendering as before; `lg` was re-anchored
          to 17px when the icon ladder gained the wireframe's hub-icon step
          (see IIconProps.ts). */}
      <Icon name={icon} size="xl" className={styles.icon} />
      <p className={styles.title}>{title}</p>
      {description ? <p className={styles.description}>{description}</p> : null}
    </Stack>
  );
}
