/**
 * Color tokens — the only file in the design system allowed to contain a raw
 * hex/rgba value. Every other file (components, other token files) must
 * consume color through the semantic names exported here, never through the
 * private palette below. This is what "no hardcoded colors in components"
 * actually means in practice: there is exactly one place a color literal is
 * allowed to appear.
 *
 * The palette itself is not a guess — it's lifted directly from the approved
 * Hamu360 wireframe's own `:root` custom properties
 * (`HOS_All_Departments_Wireframe_v1.html`), so semantic tokens built on top
 * of it reproduce the wireframe exactly rather than approximating it.
 */

/**
 * Raw palette, private to this module. Never imported anywhere else —
 * always go through `lightColors` / `darkColors` below.
 */
const palette = {
  // Navy — primary brand color family (wireframe: --nv, --nv2)
  navy900: '#0d1f3c',
  navy700: '#1a3160',
  navy500: '#2a4a85',

  // Gold — accent color family (wireframe: --g, --gl, --gd)
  gold500: '#ddaa39',
  gold300: '#f5e4b0',
  gold700: '#b8861a',

  // Ink — neutral text family (wireframe: --t1, --t2, --t3)
  ink900: '#2c2c2a',
  ink700: '#555759',
  ink400: '#888780',
  ink300: '#b3b1ab',

  // Neutrals — surfaces, canvas, hairlines (wireframe: --sf, --wh, --bd, body bg)
  white: '#ffffff',
  surfaceSubtle: '#f8f7f4',
  canvas: '#eceae4',
  hairline: '#e8e6e0',

  // Status — each has a foreground and a pastel background tint (wireframe:
  // --red/--redbg, --grn/--grnbg, --blu/--blubg, --amb/--ambbg)
  red700: '#a32d2d',
  red50: '#fcebeb',
  green800: '#3b6d11',
  green50: '#eaf3de',
  blue700: '#185fa5',
  blue50: '#e6f1fb',
  amber800: '#854f0b',
  amber50: '#fff4e5'
} as const;

/**
 * Every semantic role a component is allowed to ask for. The literal list in
 * the Sprint 1 brief (Primary, Secondary, Accent, Success, Warning, Danger,
 * Surface, Background, Border, Text Primary, Text Secondary, Muted, Hover,
 * Active, Disabled, Focus) is extended with a small number of additions,
 * each justified:
 *
 * - `*Background` pairs for success/warning/danger/info: the wireframe pairs
 *   every status color with a pastel background tint for badges/pills
 *   (`--redbg`, `--grnbg`, `--blubg`, `--ambbg`). Reproducing the wireframe
 *   at "99% visual accuracy" requires both halves of that pair, not just the
 *   foreground color.
 * - `info` / `infoBackground`: the wireframe's blue (`--blu`/`--blubg`) is
 *   used as a status/tag color distinct from success/warning/danger. There
 *   is no "info" in the brief's example list, but the color exists in the
 *   approved design and needs a home.
 * - `surfaceSubtle`: the wireframe uses two distinct light neutrals for
 *   elevation — pure white (`--wh`) for primary cards and an off-white
 *   (`--sf`) for nested/secondary panels. Collapsing these into a single
 *   `surface` token would lose a real, visible distinction from the
 *   approved design.
 * - `textOnPrimary`: required for WCAG AA contrast wherever text sits on a
 *   `primary`/`accent`-colored background (e.g. the wireframe's active
 *   selector chip: gold background, navy text — see `darkColors` below,
 *   where this exact pairing reappears).
 */
export interface ISemanticColorTokens {
  primary: string;
  secondary: string;
  accent: string;
  success: string;
  successBackground: string;
  warning: string;
  warningBackground: string;
  danger: string;
  dangerBackground: string;
  info: string;
  infoBackground: string;
  surface: string;
  surfaceSubtle: string;
  background: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  textOnPrimary: string;
  muted: string;
  hover: string;
  active: string;
  disabled: string;
  focus: string;
}

/**
 * Light theme — the approved wireframe's palette, verbatim.
 */
export const lightColors: ISemanticColorTokens = {
  primary: palette.navy900,
  secondary: palette.navy700,
  accent: palette.gold500,
  success: palette.green800,
  successBackground: palette.green50,
  warning: palette.amber800,
  warningBackground: palette.amber50,
  danger: palette.red700,
  dangerBackground: palette.red50,
  info: palette.blue700,
  infoBackground: palette.blue50,
  surface: palette.white,
  surfaceSubtle: palette.surfaceSubtle,
  background: palette.canvas,
  border: palette.hairline,
  textPrimary: palette.ink900,
  textSecondary: palette.ink700,
  textOnPrimary: palette.white,
  muted: palette.ink400,
  // Neutral washes for hover/active backgrounds on interactive rows — not a
  // single wireframe swatch, but the standard low-opacity-of-primary
  // technique that keeps every future hover/active state visually related
  // to the brand color instead of a disconnected gray.
  hover: 'rgba(13, 31, 60, 0.04)',
  active: 'rgba(13, 31, 60, 0.08)',
  disabled: palette.ink300,
  // Focus uses `info` blue rather than primary/accent: it must be visually
  // distinct from both brand colors so a focus ring is never mistaken for a
  // selected/active state, and blue is the most universally recognized
  // focus-affordance color for WCAG-conscious UI.
  focus: palette.blue700
};

/**
 * Dark theme — not speculative. The wireframe's own header chrome already
 * proves this exact combination works: navy surfaces, gold accent, white
 * text (`.hos`/`.htitle` render white text on a navy background), and the
 * active selector chip already proves navy text on a gold background
 * (`.sel-btn.active .av`). Dark mode here is that same combination promoted
 * from "one section's chrome" to "the whole surface."
 */
export const darkColors: ISemanticColorTokens = {
  primary: palette.gold500,
  secondary: palette.navy500,
  accent: palette.gold300,
  success: '#6fa83a',
  successBackground: 'rgba(59, 109, 17, 0.18)',
  warning: '#e0ac4e',
  warningBackground: 'rgba(133, 79, 11, 0.22)',
  danger: '#e2685f',
  dangerBackground: 'rgba(163, 45, 45, 0.2)',
  info: '#5b9fe0',
  infoBackground: 'rgba(24, 95, 165, 0.22)',
  surface: palette.navy700,
  surfaceSubtle: '#22386b',
  background: '#081527',
  border: 'rgba(255, 255, 255, 0.12)',
  textPrimary: palette.surfaceSubtle,
  textSecondary: 'rgba(255, 255, 255, 0.72)',
  // Text on the gold primary/accent must stay dark for contrast — exactly
  // the `.sel-btn.active .av` pairing from the wireframe (gold bg, navy text).
  textOnPrimary: palette.navy900,
  muted: 'rgba(255, 255, 255, 0.5)',
  hover: 'rgba(255, 255, 255, 0.06)',
  active: 'rgba(255, 255, 255, 0.1)',
  disabled: 'rgba(255, 255, 255, 0.28)',
  focus: '#5b9fe0'
};
