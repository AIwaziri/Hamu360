import * as React from 'react';

import type { SpacingToken } from '@theme/spacing';
import { classNames } from '@utils/index';

import type { IStackProps, StackAlign, StackDirection, StackJustify } from './IStackProps';
import styles from './Stack.module.scss';

// Explicit lookup maps rather than dynamic `styles[\`gap${capitalize(x)}\`]`
// string-building: a `Record<Token, string>` must list every token, so
// TypeScript itself catches a map falling out of sync with `SpacingToken`/
// `StackAlign`/etc. (e.g. a new spacing step added without updating this
// map is a compile error, not a silently-missing class at runtime).
const directionClassNames: Record<StackDirection, string> = {
  row: styles.directionRow,
  column: styles.directionColumn
};

const alignClassNames: Record<StackAlign, string> = {
  start: styles.alignStart,
  center: styles.alignCenter,
  end: styles.alignEnd,
  stretch: styles.alignStretch,
  baseline: styles.alignBaseline
};

const justifyClassNames: Record<StackJustify, string> = {
  start: styles.justifyStart,
  center: styles.justifyCenter,
  end: styles.justifyEnd,
  between: styles.justifyBetween,
  around: styles.justifyAround,
  evenly: styles.justifyEvenly
};

const gapClassNames: Record<SpacingToken, string> = {
  none: styles.gapNone,
  xxs: styles.gapXxs,
  xs: styles.gapXs,
  sm: styles.gapSm,
  md: styles.gapMd,
  lg: styles.gapLg,
  xl: styles.gapXl,
  xxl: styles.gapXxl,
  xxxl: styles.gapXxxl
};

/**
 * The single most load-bearing primitive in the system: a flexbox layout
 * box that turns "consistent spacing between children" into a `gap` prop
 * instead of manual margins on every child. Every gap/align/justify value
 * maps to a predefined SCSS class (see `Stack.module.scss`) rather than an
 * inline style — this is a closed set of token-backed choices, not an
 * arbitrary-value escape hatch.
 */
export const Stack = React.forwardRef<HTMLElement, IStackProps>((props, ref) => {
  const {
    direction = 'column',
    gap = 'md',
    align = 'stretch',
    justify = 'start',
    wrap = false,
    as = 'div',
    className,
    children,
    ...rest
  } = props;
  const Component = as as React.ElementType;

  return (
    <Component
      ref={ref}
      className={classNames(
        styles.root,
        directionClassNames[direction],
        alignClassNames[align],
        justifyClassNames[justify],
        gapClassNames[gap],
        wrap && styles.wrap,
        className
      )}
      {...rest}
    >
      {children}
    </Component>
  );
});

Stack.displayName = 'Stack';
