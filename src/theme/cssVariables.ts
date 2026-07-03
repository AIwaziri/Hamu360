import type { IDesignTokens } from './tokens';
import type { ITypographyToken, TypographyRole } from './typography';

/**
 * Bridges the TypeScript token objects to the CSS custom properties that
 * SCSS Modules actually consume. This is the one place `IDesignTokens` gets
 * flattened into `--h360-*` variable names — every SCSS Module in the
 * codebase should be able to assume these names exist without knowing this
 * file is what put them there.
 *
 * Namespaced with an `h360` prefix so these never collide with SharePoint's
 * own theme custom properties, or with Fluent UI's.
 */
export const CSS_VAR_PREFIX = 'h360';

function cssVarName(...parts: string[]): string {
  return `--${CSS_VAR_PREFIX}-${parts.join('-')}`;
}

/** camelCase/PascalCase token key -> kebab-case CSS variable segment (`successBackground` -> `success-background`, `elevation1` -> `elevation-1`). */
function toKebabCase(key: string): string {
  return key
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([a-zA-Z])([0-9])/g, '$1-$2')
    .toLowerCase();
}

function flattenColors(tokens: IDesignTokens): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(tokens.colors)) {
    result[cssVarName('color', toKebabCase(key))] = value;
  }
  return result;
}

function flattenTypography(tokens: IDesignTokens): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [role, token] of Object.entries(tokens.typography) as Array<[TypographyRole, ITypographyToken]>) {
    const roleKebab = toKebabCase(role);
    result[cssVarName('font', roleKebab, 'family')] = token.fontFamily;
    result[cssVarName('font', roleKebab, 'size')] = token.fontSize;
    result[cssVarName('font', roleKebab, 'weight')] = String(token.fontWeight);
    result[cssVarName('font', roleKebab, 'line-height')] = String(token.lineHeight);
    result[cssVarName('font', roleKebab, 'letter-spacing')] = token.letterSpacing;
  }
  return result;
}

function flattenSpacing(tokens: IDesignTokens): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(tokens.spacing)) {
    result[cssVarName('space', toKebabCase(key))] = `${value}px`;
  }
  return result;
}

function flattenRadius(tokens: IDesignTokens): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(tokens.radius)) {
    result[cssVarName('radius', toKebabCase(key))] = value;
  }
  return result;
}

function flattenShadows(tokens: IDesignTokens): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(tokens.shadows)) {
    result[cssVarName('shadow', toKebabCase(key))] = value;
  }
  return result;
}

function flattenMotion(tokens: IDesignTokens): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(tokens.motion.duration)) {
    result[cssVarName('duration', toKebabCase(key))] = value;
  }
  for (const [key, value] of Object.entries(tokens.motion.easing)) {
    result[cssVarName('ease', toKebabCase(key))] = value;
  }
  for (const [key, value] of Object.entries(tokens.motion.presets)) {
    result[cssVarName('motion', toKebabCase(key))] = value;
  }
  return result;
}

function flattenGrid(tokens: IDesignTokens): Record<string, string> {
  return {
    [cssVarName('grid', 'max-content-width')]: `${tokens.grid.maxContentWidth}px`,
    [cssVarName('grid', 'columns')]: String(tokens.grid.columns),
    [cssVarName('grid', 'gutter')]: `${tokens.grid.gutter}px`
  };
}

function flattenZIndex(tokens: IDesignTokens): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(tokens.zIndex)) {
    result[cssVarName('z', toKebabCase(key))] = String(value);
  }
  return result;
}

function flattenOpacity(tokens: IDesignTokens): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(tokens.opacity)) {
    result[cssVarName('opacity', toKebabCase(key))] = String(value);
  }
  return result;
}

/** Flattens a full `IDesignTokens` object into a map of CSS custom property name -> value, ready to apply to an element's inline style. */
export function tokensToCssVariables(tokens: IDesignTokens): Record<string, string> {
  return {
    ...flattenColors(tokens),
    ...flattenTypography(tokens),
    ...flattenSpacing(tokens),
    ...flattenRadius(tokens),
    ...flattenShadows(tokens),
    ...flattenMotion(tokens),
    ...flattenGrid(tokens),
    ...flattenZIndex(tokens),
    ...flattenOpacity(tokens)
  };
}

/** Applies a flattened variable map to a DOM element via `style.setProperty` — the only sanctioned way this design system ever touches an element's `style` directly (this is infrastructure, not a component using inline styles). */
export function applyCssVariables(element: HTMLElement, variables: Record<string, string>): void {
  for (const [name, value] of Object.entries(variables)) {
    element.style.setProperty(name, value);
  }
}
