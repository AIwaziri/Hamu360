/** `'md'` -> `'Md'`. Used to build camelCase CSS Module class names from lowercase token keys (e.g. `gap` + capitalize('md') = `gapMd`) — SPFx's sass task warns on non-camelCase class names, so every generated utility class must be assembled this way. */
export function capitalize(value: string): string {
  if (value.length === 0) {
    return value;
  }
  return value.charAt(0).toUpperCase() + value.slice(1);
}
