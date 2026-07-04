import { escape } from '@microsoft/sp-lodash-subset';
import * as React from 'react';

import { Container } from '@components/Container';
import { Grid } from '@components/Grid';
import { Section } from '@components/Section';
import { Spacer } from '@components/Spacer';
import { Stack } from '@components/Stack';

import styles from './DesignSystemShowcase.module.scss';
import type { IDesignSystemShowcaseProps } from './IDesignSystemShowcaseProps';

const TYPOGRAPHY_SAMPLES: Array<{ role: string; className: string; sampleText: string }> = [
  { role: 'display', className: styles.typeDisplay, sampleText: 'Hamu360 Design System' },
  { role: 'headingXl', className: styles.typeHeadingXl, sampleText: 'Hamu360 Design System' },
  { role: 'headingL', className: styles.typeHeadingL, sampleText: 'Hamu360 Design System' },
  { role: 'headingM', className: styles.typeHeadingM, sampleText: 'Hamu360 Design System' },
  { role: 'headingS', className: styles.typeHeadingS, sampleText: 'Hamu360 Design System' },
  { role: 'title', className: styles.typeTitle, sampleText: 'Hamu360 Design System' },
  { role: 'bodyLarge', className: styles.typeBodyLarge, sampleText: 'The quick brown fox jumps over the lazy dog.' },
  { role: 'body', className: styles.typeBody, sampleText: 'The quick brown fox jumps over the lazy dog.' },
  { role: 'bodySmall', className: styles.typeBodySmall, sampleText: 'The quick brown fox jumps over the lazy dog.' },
  { role: 'caption', className: styles.typeCaption, sampleText: 'The quick brown fox jumps over the lazy dog.' },
  { role: 'label', className: styles.typeLabel, sampleText: 'STATUS LABEL' },
  { role: 'button', className: styles.typeButton, sampleText: 'Primary action' },
  { role: 'code', className: styles.typeCode, sampleText: 'const total = items.reduce((a, b) => a + b, 0);' }
];

const COLOR_SWATCHES: Array<{ name: string; className: string }> = [
  { name: 'primary', className: styles.swatchPrimary },
  { name: 'secondary', className: styles.swatchSecondary },
  { name: 'accent', className: styles.swatchAccent },
  { name: 'success', className: styles.swatchSuccess },
  { name: 'successBackground', className: styles.swatchSuccessBackground },
  { name: 'warning', className: styles.swatchWarning },
  { name: 'warningBackground', className: styles.swatchWarningBackground },
  { name: 'danger', className: styles.swatchDanger },
  { name: 'dangerBackground', className: styles.swatchDangerBackground },
  { name: 'info', className: styles.swatchInfo },
  { name: 'infoBackground', className: styles.swatchInfoBackground },
  { name: 'surface', className: styles.swatchSurface },
  { name: 'surfaceSubtle', className: styles.swatchSurfaceSubtle },
  { name: 'background', className: styles.swatchBackground },
  { name: 'border', className: styles.swatchBorder },
  { name: 'textPrimary', className: styles.swatchTextPrimary },
  { name: 'textSecondary', className: styles.swatchTextSecondary },
  { name: 'muted', className: styles.swatchMuted },
  { name: 'hover', className: styles.swatchHover },
  { name: 'active', className: styles.swatchActive },
  { name: 'disabled', className: styles.swatchDisabled },
  { name: 'focus', className: styles.swatchFocus }
];

const SPACING_SAMPLES: Array<{ key: string; className: string }> = [
  { key: 'none (0px)', className: styles.spacingBarNone },
  { key: 'xxs (2px)', className: styles.spacingBarXxs },
  { key: 'xs (4px)', className: styles.spacingBarXs },
  { key: 'sm (8px)', className: styles.spacingBarSm },
  { key: 'md (16px)', className: styles.spacingBarMd },
  { key: 'lg (24px)', className: styles.spacingBarLg },
  { key: 'xl (32px)', className: styles.spacingBarXl },
  { key: 'xxl (48px)', className: styles.spacingBarXxl },
  { key: 'xxxl (64px)', className: styles.spacingBarXxxl }
];

const RADIUS_SAMPLES: Array<{ name: string; className: string }> = [
  { name: 'small', className: styles.radiusSmall },
  { name: 'medium', className: styles.radiusMedium },
  { name: 'large', className: styles.radiusLarge },
  { name: 'xl', className: styles.radiusXl },
  { name: 'pill', className: styles.radiusPill },
  { name: 'circle', className: styles.radiusCircle }
];

const SHADOW_SAMPLES: Array<{ name: string; className: string }> = [
  { name: 'elevation-0', className: styles.shadowElevation0 },
  { name: 'elevation-1', className: styles.shadowElevation1 },
  { name: 'elevation-2', className: styles.shadowElevation2 },
  { name: 'elevation-3', className: styles.shadowElevation3 },
  { name: 'elevation-4', className: styles.shadowElevation4 },
  { name: 'hover', className: styles.shadowHover },
  { name: 'dropdown', className: styles.shadowDropdown },
  { name: 'modal', className: styles.shadowModal }
];

/**
 * TEMPORARY Sprint 1 verification page. Exists only to prove the design
 * system (`src/theme`, `src/components`) renders correctly inside a real
 * SharePoint page before Sprint 2 feature work begins — it is not a
 * feature, dashboard, or business component, and should be deleted (this
 * whole folder, plus the wiring in `Hamu360Shell.tsx`) once that
 * verification is done.
 */
export default function DesignSystemShowcase(props: IDesignSystemShowcaseProps): React.ReactElement {
  const { currentUserDisplayName, environment, mode, onToggleMode } = props;

  return (
    <Container maxWidth="desktop">
      <Section spacing="lg" className={styles.header}>
        <span className={styles.badge}>Temporary verification page</span>
        <h1 className={styles.pageTitle}>Hamu360 Design System</h1>
        <p className={styles.pageSubtitle}>
          Sprint 1 design system rendered live inside SharePoint. Every value on this page comes from a design token —
          nothing here is hardcoded. This page will be removed before Sprint 2 feature work begins.
        </p>
        <Stack direction="row" align="center" gap="md" wrap>
          <button type="button" className={styles.toggleButton} onClick={onToggleMode}>
            Switch to {mode === 'light' ? 'dark' : 'light'} theme
          </button>
          <span className={styles.statusLine}>
            Current theme: {mode} &middot; Environment: {environment} &middot; Signed in as:{' '}
            {escape(currentUserDisplayName)}
          </span>
        </Stack>
      </Section>

      <Section spacing="lg">
        <h2 className={styles.sectionTitle}>Typography</h2>
        <p className={styles.sectionCaption}>
          Every role in the type scale, rendered with its actual token — font family, size, weight, line height, and
          letter spacing.
        </p>
        <Stack direction="column" gap="none">
          {TYPOGRAPHY_SAMPLES.map((sample) => (
            <div key={sample.role} className={styles.typeRow}>
              <span className={styles.typeRoleLabel}>{sample.role}</span>
              <div className={sample.className}>{sample.sampleText}</div>
            </div>
          ))}
        </Stack>
      </Section>

      <Section spacing="lg">
        <h2 className={styles.sectionTitle}>Color</h2>
        <p className={styles.sectionCaption}>
          Semantic color tokens only &mdash; no component in this codebase is allowed to reference a raw hex value.
        </p>
        <Grid columns={4} gap="md">
          {COLOR_SWATCHES.map((swatch) => (
            <div key={swatch.name}>
              <div className={`${styles.swatch} ${swatch.className}`} />
              <span className={styles.swatchLabel}>{swatch.name}</span>
            </div>
          ))}
        </Grid>
      </Section>

      <Section spacing="lg">
        <h2 className={styles.sectionTitle}>Spacing</h2>
        <p className={styles.sectionCaption}>
          The full spacing scale, each bar&apos;s width set by <code className={styles.typeCode}>space()</code>.
        </p>
        <Stack direction="column" gap="xxs">
          {SPACING_SAMPLES.map((sample) => (
            <div key={sample.key} className={styles.spacingRow}>
              <span className={styles.spacingRowLabel}>{sample.key}</span>
              <div className={`${styles.spacingBar} ${sample.className}`} />
            </div>
          ))}
        </Stack>
      </Section>

      <Section spacing="lg">
        <h2 className={styles.sectionTitle}>Border radius</h2>
        <p className={styles.sectionCaption}>Every radius token, applied to an identical box.</p>
        <Grid columns={6} gap="md">
          {RADIUS_SAMPLES.map((sample) => (
            <div key={sample.name}>
              <div className={`${styles.radiusBox} ${sample.className}`} />
              <span className={styles.radiusLabel}>{sample.name}</span>
            </div>
          ))}
        </Grid>
      </Section>

      <Section spacing="lg">
        <h2 className={styles.sectionTitle}>Elevation (shadows)</h2>
        <p className={styles.sectionCaption}>
          The navy-tinted elevation system &mdash; <code className={styles.typeCode}>hover</code> is a verbatim match
          for the approved wireframe&apos;s one observed <code className={styles.typeCode}>box-shadow</code> value.
        </p>
        <Grid columns={4} gap="lg">
          {SHADOW_SAMPLES.map((sample) => (
            <div key={sample.name}>
              <div className={`${styles.shadowBox} ${sample.className}`} />
              <span className={styles.shadowLabel}>{sample.name}</span>
            </div>
          ))}
        </Grid>
      </Section>

      <Section spacing="lg">
        <h2 className={styles.sectionTitle}>Layout primitives</h2>
        <p className={styles.sectionCaption}>
          This entire page is built from the five Sprint 1 primitives &mdash;{' '}
          <code className={styles.typeCode}>Container</code> wraps it at{' '}
          <code className={styles.typeCode}>maxWidth=&quot;desktop&quot;</code> (1180px, matching the approved wireframe
          exactly), and every block above is a <code className={styles.typeCode}>Section</code>. The three below
          demonstrate the rest directly.
        </p>

        <Stack direction="column" gap="lg">
          <div className={styles.demoFrame}>
            <p className={styles.sectionCaption}>
              <code className={styles.typeCode}>Stack direction=&quot;row&quot; gap=&quot;md&quot;</code>
            </p>
            <Stack direction="row" gap="md" wrap>
              <div className={styles.demoBox}>Item A</div>
              <div className={styles.demoBox}>Item B</div>
              <div className={styles.demoBox}>Item C</div>
            </Stack>
          </div>

          <div className={styles.demoFrame}>
            <p className={styles.sectionCaption}>
              <code className={styles.typeCode}>Grid columns=4</code> &mdash; resize the browser window to see the
              mobile-first column ramp (1 column below tablet, 2 from tablet, 4 from laptop).
            </p>
            <Grid columns={4} gap="sm">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <div key={n} className={styles.demoBox}>
                  Cell {n}
                </div>
              ))}
            </Grid>
          </div>

          <div className={styles.demoFrame}>
            <p className={styles.sectionCaption}>
              <code className={styles.typeCode}>Spacer</code> &mdash; flexible (pushes content apart) on the left, fixed{' '}
              <code className={styles.typeCode}>size=&quot;lg&quot;</code> on the right.
            </p>
            <Stack direction="row" gap="none">
              <div className={styles.demoBoxAccent}>Start</div>
              <Spacer axis="horizontal" />
              <div className={styles.demoBoxAccent}>End</div>
            </Stack>
            <Spacer size="md" />
            <Stack direction="row" gap="none">
              <div className={styles.demoBoxAccent}>Before</div>
              <Spacer axis="horizontal" size="lg" />
              <div className={styles.demoBoxAccent}>After</div>
            </Stack>
          </div>
        </Stack>
      </Section>
    </Container>
  );
}
