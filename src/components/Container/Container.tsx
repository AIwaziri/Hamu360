import * as React from 'react';

import { classNames } from '@utils/index';

import styles from './Container.module.scss';
import type { ContainerMaxWidth, IContainerProps } from './IContainerProps';

const maxWidthClassNames: Record<ContainerMaxWidth, string> = {
  laptop: styles.maxWidthLaptop,
  desktop: styles.maxWidthDesktop,
  full: styles.maxWidthFull
};

/**
 * Horizontally centers content and caps it at a token-defined max width,
 * with responsive horizontal gutters (16px mobile, 24px tablet+, from
 * `@theme/grid`). This is the outermost wrapper every page-level layout
 * starts with — it owns horizontal rhythm only; vertical rhythm between
 * sections is `Section`'s job, not this component's.
 */
export const Container = React.forwardRef<HTMLElement, IContainerProps>((props, ref) => {
  const { maxWidth = 'desktop', as = 'div', className, children, ...rest } = props;
  const Component = as as React.ElementType;

  return (
    <Component ref={ref} className={classNames(styles.root, maxWidthClassNames[maxWidth], className)} {...rest}>
      {children}
    </Component>
  );
});

Container.displayName = 'Container';
