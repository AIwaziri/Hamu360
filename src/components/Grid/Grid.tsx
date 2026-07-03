import * as React from 'react';

import type { SpacingToken } from '@theme/spacing';
import { classNames } from '@utils/index';

import styles from './Grid.module.scss';
import type { GridColumns, IGridProps } from './IGridProps';

const columnsClassNames: Record<GridColumns, string> = {
  1: styles.columns1,
  2: styles.columns2,
  3: styles.columns3,
  4: styles.columns4,
  6: styles.columns6,
  12: styles.columns12
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
 * CSS Grid layout primitive. `columns` describes the column count from
 * `laptop` up — every step automatically renders fewer columns on smaller
 * viewports (see `Grid.module.scss`), so mobile-first responsiveness is
 * the default behavior, not something a consumer opts into.
 */
export const Grid = React.forwardRef<HTMLElement, IGridProps>((props, ref) => {
  const { columns = 12, gap = 'md', as = 'div', className, children, ...rest } = props;
  const Component = as as React.ElementType;

  return (
    <Component
      ref={ref}
      className={classNames(styles.root, columnsClassNames[columns], gapClassNames[gap], className)}
      {...rest}
    >
      {children}
    </Component>
  );
});

Grid.displayName = 'Grid';
