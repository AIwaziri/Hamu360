import * as React from 'react';

import type { RadiusToken } from '@theme/radius';
import { classNames } from '@utils/index';

import type { ISkeletonProps } from './ISkeletonProps';
import styles from './Skeleton.module.scss';

// Explicit lookup map rather than dynamic `styles[\`radius${capitalize(x)}\`]`
// string-building — same precedent as `Stack.tsx`'s `directionClassNames`/
// `alignClassNames`/etc.: a `Record<RadiusToken, string>` must list every
// token, so TypeScript catches a map falling out of sync with `RadiusToken`
// at compile time, and (the concrete bug this fixed) a generated CSS-module
// type with no index signature can't be indexed by a template-literal
// expression at all under this project's strict `tsconfig.json`.
const radiusClassNames: Record<RadiusToken, string> = {
  small: styles.radiusSmall,
  medium: styles.radiusMedium,
  large: styles.radiusLarge,
  xl: styles.radiusXl,
  pill: styles.radiusPill,
  circle: styles.radiusCircle
};

/**
 * A single placeholder block shown while real data is loading. Deliberately
 * a leaf primitive with no opinion about layout — a widget composes one or
 * more `Skeleton`s (in a `Stack`, matching its own real content's shape)
 * rather than this component trying to guess what a "loading events widget"
 * or "loading avatar" should look like.
 *
 * `aria-hidden` because the loading state itself is communicated to
 * assistive tech by the *consumer* (e.g. an `aria-busy="true"` on the
 * containing region, or a visually-hidden "Loading…" string) — a screen
 * reader has no use for N identical decorative shimmer blocks.
 *
 * New in Sprint 6 — this component, `EmptyState`, and `ErrorState` did not
 * exist before this sprint despite being referenced by name in this
 * sprint's brief; see `SPRINT_6_INTEGRATION_CHECKLIST.md`'s preamble for
 * why (Sprint 1 never built them, the same gap Sprint 2 hit with
 * Button/Icon/Typography).
 */
export function Skeleton(props: ISkeletonProps): React.ReactElement {
  const { width = '100%', height = '1em', radius = 'small', className } = props;

  return (
    <span
      aria-hidden="true"
      className={classNames(styles.root, radiusClassNames[radius], className)}
      style={{ width, height }}
    />
  );
}
