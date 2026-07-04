import type { EnvironmentName } from '@config/environment';

export interface IDesignSystemShowcaseProps {
  currentUserDisplayName: string;
  environment: EnvironmentName;
  mode: 'light' | 'dark';
  onToggleMode: () => void;
}
