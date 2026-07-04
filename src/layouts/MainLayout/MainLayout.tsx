import * as React from 'react';

import { Container } from '@components/Container';
import { Section } from '@components/Section';
import { classNames } from '@utils/index';

import type { IMainLayoutProps } from './IMainLayoutProps';
import styles from './MainLayout.module.scss';

/**
 * The page-content wrapper `AppShell` places between `Header` and `Footer`.
 * Composes `Container` (horizontal max-width/gutter) and `Section` (vertical
 * rhythm) — the exact same Sprint 1 primitives every other page-level layout
 * in this codebase uses — so it adds no layout rules of its own beyond
 * `id="main-content"` (the skip link's target, see `AppShell`) and the
 * flex-grow needed for a sticky footer.
 *
 * No business content, no page-specific composition — per
 * `src/layouts/README.md`'s rule, that belongs to whatever page/web part
 * renders inside `children`, never to this file.
 */
export function MainLayout(props: IMainLayoutProps): React.ReactElement {
  const { maxWidth = 'desktop', spacing, className, children } = props;

  return (
    <main id="main-content" className={classNames(styles.root, className)}>
      <Container maxWidth={maxWidth}>
        <Section spacing={spacing}>{children}</Section>
      </Container>
    </main>
  );
}
