import type { ICurrentUser } from '@models/index';

/**
 * Every service exposed to the app is defined as an interface first. UI code
 * and hooks depend on this interface — never on `Mock/*` or `SharePoint/*`
 * concrete classes directly — so swapping implementations never requires
 * touching a consumer. See `ServiceFactory.ts` for how the concrete
 * implementation gets picked.
 */
export interface ICurrentUserService {
  getCurrentUser(): Promise<ICurrentUser>;
}
