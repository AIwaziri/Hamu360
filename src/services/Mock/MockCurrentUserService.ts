import type { ICurrentUser } from '@models/index';

import type { ICurrentUserService } from '../ICurrentUserService';

/**
 * Used in the local SPFx workbench (`gulp serve`) and in unit tests, where
 * there is no real SharePoint context to call. Returns deterministic fixture
 * data so UI development isn't blocked on tenant access.
 */
export class MockCurrentUserService implements ICurrentUserService {
  public async getCurrentUser(): Promise<ICurrentUser> {
    return {
      id: 'mock-user-001',
      displayName: 'Jordan Rivera',
      email: 'jordan.rivera@hamulegal.com',
      loginName: 'i:0#.f|membership|jordan.rivera@hamulegal.com'
    };
  }
}
