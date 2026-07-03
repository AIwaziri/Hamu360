import type { ITheme } from '@fluentui/react';

import type { EnvironmentName } from '@config/environment';

/**
 * Deliberately minimal — this component exists to prove the build pipeline
 * (strict TS, path aliases, SCSS modules, theme resolution, the service
 * factory) compiles and runs end to end. It is not a feature and should not
 * grow feature props.
 */
export interface IHamu360ShellProps {
  currentUserDisplayName: string;
  environment: EnvironmentName;
  theme: ITheme;
}
