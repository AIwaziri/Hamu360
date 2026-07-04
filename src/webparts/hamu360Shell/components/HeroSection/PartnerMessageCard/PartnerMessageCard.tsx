import * as React from 'react';

import { Icon } from '@components/Icon';
import { classNames, formatDate } from '@utils/index';

import type { IPartnerMessageCardProps } from './IPartnerMessageCardProps';
import styles from './PartnerMessageCard.module.scss';

/** `authorPreferredName` if given, else the first word of `authorName`. */
function getDisplayFirstName(authorName: string, authorPreferredName?: string): string {
  if (authorPreferredName) {
    return authorPreferredName;
  }
  return authorName.trim().split(/\s+/)[0] ?? authorName;
}

/**
 * Wireframe Card 1: "Message from Fali" — a weekly note from the Managing
 * Partner. Per `HOS_Documentation_v1.md` 3.1, the real Sprint 6 source is a
 * SharePoint News post; this component only ever sees the generic
 * `IPartnerMessage` shape (see that model's docblock) via props, never a
 * service directly.
 */
export function PartnerMessageCard(props: IPartnerMessageCardProps): React.ReactElement {
  const { message, className } = props;
  const firstName = getDisplayFirstName(message.authorName, message.authorPreferredName);

  return (
    <div className={classNames(styles.card, className)}>
      <p className={styles.label}>
        <Icon name="message-circle" size="sm" />
        Message from {firstName}
      </p>
      <div className={styles.body}>
        <div className={styles.avatar} aria-hidden="true">
          {message.authorInitials}
        </div>
        <div>
          <p className={styles.name}>{message.authorName}</p>
          <p className={styles.role}>{message.authorRole}</p>
          <p className={styles.message}>&ldquo;{message.message}&rdquo;</p>
          <p className={styles.date}>{formatDate(message.publishedDate)}</p>
        </div>
      </div>
    </div>
  );
}
