import * as React from 'react';

import { classNames } from '@utils/index';

import styles from './Button.module.scss';
import type { ButtonSize, ButtonVariant, IButtonProps } from './IButtonProps';

const variantClassNames: Record<ButtonVariant, string> = {
  primary: styles.variantPrimary,
  secondary: styles.variantSecondary,
  ghost: styles.variantGhost,
  icon: styles.variantIcon
};

const sizeClassNames: Record<ButtonSize, string> = {
  sm: styles.sizeSm,
  md: styles.sizeMd
};

/**
 * Generic, presentational button primitive — no business meaning, same as
 * every other Sprint 1 primitive. `type="button"` is the default (not the
 * native `"submit"` default) because every current consumer is a toggle or
 * a no-op placeholder action, never a form submission; pass `type="submit"`
 * explicitly wherever that changes.
 */
export const Button = React.forwardRef<HTMLButtonElement, IButtonProps>((props, ref) => {
  const { variant = 'primary', size = 'md', fullWidth = false, type = 'button', className, children, ...rest } = props;

  return (
    <button
      ref={ref}
      type={type}
      className={classNames(
        styles.root,
        variantClassNames[variant],
        variant !== 'icon' && sizeClassNames[size],
        fullWidth && styles.fullWidth,
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';
