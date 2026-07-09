import type { IconName } from '@components/Icon';

export interface IEmptyStateProps {
  /** @default 'inbox' */
  icon?: IconName;
  title: string;
  description?: string;
  className?: string;
}
