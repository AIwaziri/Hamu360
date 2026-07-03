/**
 * Single source of truth for "which environment am I running in, and what
 * should that change about runtime behavior". Everything that varies by
 * environment (mock vs. real services, verbose logging, etc.) reads from
 * here rather than checking `window.location` or `context.isServedFromLocalhost`
 * ad hoc in random files.
 */

export type EnvironmentName = 'local' | 'sharepoint';

export interface IEnvironmentConfig {
  /** The environment we detected. */
  environment: EnvironmentName;
  /**
   * When true, services must resolve to their `services/Mock` implementation
   * instead of `services/SharePoint`. True in the local workbench (there is
   * no real SharePoint context to call), false everywhere else.
   */
  useMockData: boolean;
  /** Verbose console logging for service calls, theme resolution, etc. */
  enableDebugLogging: boolean;
}

/**
 * `isServedFromLocalhost` comes from `WebPartContext` (SPFx sets it based on
 * how the page was loaded — local workbench vs. a real SharePoint site) so
 * this file takes it as a plain boolean rather than importing SPFx context
 * types, keeping `src/config` free of any SPFx-specific dependency.
 */
export function resolveEnvironment(isServedFromLocalhost: boolean): IEnvironmentConfig {
  const environment: EnvironmentName = isServedFromLocalhost ? 'local' : 'sharepoint';

  return {
    environment,
    useMockData: environment === 'local',
    enableDebugLogging: environment === 'local'
  };
}
