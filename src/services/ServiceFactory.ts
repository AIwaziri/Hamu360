import type { WebPartContext } from '@microsoft/sp-webpart-base';
import type { IEnvironmentConfig } from '@config/environment';
import { MockCurrentUserService } from './Mock/MockCurrentUserService';
import { SharePointCurrentUserService } from './SharePoint/SharePointCurrentUserService';
import type { ICurrentUserService } from './ICurrentUserService';

/**
 * The one place in the codebase that is allowed to know both concrete
 * service implementations exist. It reads `IEnvironmentConfig.useMockData`
 * (see `src/config/environment.ts`) and hands back whichever one applies —
 * every caller just gets an `ICurrentUserService`.
 *
 * As new services are added (`ICaseService`, `IDocumentService`, ...), add
 * one factory function per service here rather than growing a single
 * god-function; keeps each service's construction dependencies explicit.
 */
export function createCurrentUserService(
  context: WebPartContext,
  env: IEnvironmentConfig
): ICurrentUserService {
  return env.useMockData ? new MockCurrentUserService() : new SharePointCurrentUserService(context);
}
