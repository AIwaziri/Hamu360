import * as React from 'react';

import { Button } from '@components/Button';
import { Icon } from '@components/Icon';
import { Stack } from '@components/Stack';
import { classNames } from '@utils/index';

import styles from './ErrorState.module.scss';
import type { IErrorStateProps } from './IErrorStateProps';

/**
 * "This List couldn't be read" — unreachable, permission-denied, timed out,
 * or any other rejected service call. Renders in place of whatever
 * list/grid markup a widget would otherwise show.
 *
 * Deliberately generic about *why* the call failed — `description` is the
 * caller's opportunity to be specific (e.g. "You don't have access to this
 * list.") when the failure is known, but this component itself never
 * inspects an error object or tries to classify it; that's the calling
 * code's job, per this build's "components take data via props only" rule.
 *
 * New in Sprint 6 — see `Skeleton`'s docblock for why this component
 * (along with `EmptyState`) didn't exist before this sprint.
 */
export function ErrorState(props: IErrorStateProps): React.ReactElement {
  const { title = 'Something went wrong', description, onRetry, className } = props;

  return (
    // `role="alert"` needs a plain element — `IStackProps` doesn't accept
    // arbitrary ARIA attributes (see its own file: a closed, semantic prop
    // set on purpose), so it's applied to a wrapping `div` instead of
    // passed through to `Stack`.
    <div role="alert" className={classNames(styles.root, className)}>
      <Stack direction="column" gap="xs" align="center">
        <Icon name="alert-triangle" size="lg" className={styles.icon} />
        <p className={styles.title}>{title}</p>
        {description ? <p className={styles.description}>{description}</p> : null}
        {onRetry ? (
          <Button variant="secondary" size="sm" onClick={onRetry} className={styles.retryButton}>
            Try again
          </Button>
        ) : null}
      </Stack>
    </div>
  );
}
