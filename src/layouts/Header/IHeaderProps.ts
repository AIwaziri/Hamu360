import type { INavItemConfig } from '@config/navigation';
import type { ICurrentUser } from '@models/index';

export interface IHeaderProps {
  /**
   * Resolved user identity, passed down from the web part (which asks
   * `ServiceFactory.createCurrentUserService()` for it — see that file and
   * `services/Mock/MockCurrentUserService.ts`). `Header` never calls a
   * service itself; per `src/components/README.md`'s rule ("components take
   * data via props only"), the same boundary this design system already
   * enforces everywhere else.
   *
   * TODO(Sprint 6): confirm the production path still resolves this from
   * `context.pageContext.user` (already implemented in
   * `services/SharePoint/SharePointCurrentUserService.ts`) before sign-off —
   * `Header` itself has no auth logic to change, but this is the prop
   * boundary where a regression would surface.
   */
  currentUser: ICurrentUser;
  navItems: INavItemConfig[];
  activeNavItemId?: string;
  onNavItemSelect?: (id: string) => void;
  className?: string;
}
