import type { IPartnerMessage } from '@models/index';

import type { IPartnerMessageService } from '../IPartnerMessageService';

/**
 * Seed content is the approved wireframe's own Card 1 content verbatim
 * (`HOS_All_Departments_Wireframe_v1.html`'s `.mp-card` block) — the same
 * real content a real News post from Fali's account will eventually
 * contain, not placeholder text. `authorInitials: 'FW'` also reproduces the
 * wireframe's own `.mp-photo` value exactly, even though it doesn't match
 * `authorName`'s initials — that mismatch is in the approved design, not a
 * bug introduced here.
 */
export class MockPartnerMessageService implements IPartnerMessageService {
  public async getPartnerMessage(): Promise<IPartnerMessage> {
    return {
      id: 'partner-message-current',
      authorName: 'Saadatu Hamu Aliyu',
      authorRole: 'Managing Partner',
      authorPreferredName: 'Fali',
      authorInitials: 'FW',
      message:
        "This week we move into our new home at Wuse 2. It is a symbol of everything we are building together — an institution, not just a firm. Let's make it count.",
      publishedDate: '2026-06-24'
    };
  }
}
