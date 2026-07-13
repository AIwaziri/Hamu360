import * as React from 'react';

import type { TypographyRole } from '@theme/typography';
import { classNames } from '@utils/index';

import type { ITypographyProps, TypographyColor } from './ITypographyProps';
import styles from './Typography.module.scss';

const roleClassNames: Record<TypographyRole, string> = {
  display: styles.roleDisplay,
  headingXl: styles.roleHeadingXl,
  headingL: styles.roleHeadingL,
  headingM: styles.roleHeadingM,
  headingS: styles.roleHeadingS,
  title: styles.roleTitle,
  bodyLarge: styles.roleBodyLarge,
  body: styles.roleBody,
  bodySmall: styles.roleBodySmall,
  captionStrong: styles.roleCaptionStrong,
  caption: styles.roleCaption,
  labelStrong: styles.roleLabelStrong,
  label: styles.roleLabel,
  micro: styles.roleMicro,
  microLabel: styles.roleMicroLabel,
  badge: styles.roleBadge,
  button: styles.roleButton,
  code: styles.roleCode
};

const colorClassNames: Record<TypographyColor, string> = {
  primary: styles.colorPrimary,
  secondary: styles.colorSecondary,
  onPrimary: styles.colorOnPrimary,
  muted: styles.colorMuted,
  accent: styles.colorAccent,
  inherit: styles.colorInherit
};

const alignClassNames: Record<'left' | 'center' | 'right', string> = {
  left: styles.alignLeft,
  center: styles.alignCenter,
  right: styles.alignRight
};

/**
 * Renders any role from the type scale (`src/theme/typography.ts`) as text,
 * with no hardcoded font value anywhere in this file — every visual property
 * comes from the `typography()` SCSS mixin, which reads the same
 * `--h360-font-*` CSS variables every other component does.
 */
export const Typography = React.forwardRef<HTMLElement, ITypographyProps>((props, ref) => {
  const { role = 'body', as = 'p', color = 'primary', align, truncate = false, className, children, ...rest } = props;
  const Component = as as React.ElementType;

  return (
    <Component
      ref={ref}
      className={classNames(
        styles.root,
        roleClassNames[role],
        colorClassNames[color],
        align && alignClassNames[align],
        truncate && styles.truncate,
        className
      )}
      {...rest}
    >
      {children}
    </Component>
  );
});

Typography.displayName = 'Typography';
