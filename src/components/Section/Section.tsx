import * as React from 'react';

import type { SpacingToken } from '@theme/spacing';
import { classNames } from '@utils/index';

import type { ISectionProps } from './ISectionProps';
import styles from './Section.module.scss';

const spacingClassNames: Record<SpacingToken, string> = {
  none: styles.spacingNone,
  xxs: styles.spacingXxs,
  xs: styles.spacingXs,
  sm: styles.spacingSm,
  md: styles.spacingMd,
  lg: styles.spacingLg,
  xl: styles.spacingXl,
  xxl: styles.spacingXxl,
  xxxl: styles.spacingXxxl
};

/**
 * Owns vertical rhythm between major page regions. Renders a semantic
 * `<section>` by default (screen-reader/landmark friendly) — pass `as`
 * only when the surrounding document structure calls for something else.
 */
export const Section = React.forwardRef<HTMLElement, ISectionProps>((props, ref) => {
  const { spacing = 'xl', as = 'section', className, children, ...rest } = props;
  const Component = as as React.ElementType;

  return (
    <Component ref={ref} className={classNames(styles.root, spacingClassNames[spacing], className)} {...rest}>
      {children}
    </Component>
  );
});

Section.displayName = 'Section';
