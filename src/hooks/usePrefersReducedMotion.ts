import * as React from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

/**
 * The CSS-only reduced-motion handling in `src/styles/global.scss` covers
 * every CSS transition/animation automatically — most components never
 * need this hook. Reach for it only when an animation is driven from JS
 * (e.g. `requestAnimationFrame`, a third-party animation library) where no
 * CSS media query can intervene, and the animation should be skipped
 * entirely rather than just shortened.
 */
export function usePrefersReducedMotion(): boolean {
  const getSnapshot = (): boolean =>
    typeof window !== 'undefined' && typeof window.matchMedia === 'function' ? window.matchMedia(QUERY).matches : false;

  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState<boolean>(getSnapshot);

  React.useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return undefined;
    }

    const mediaQueryList = window.matchMedia(QUERY);
    const handleChange = (): void => setPrefersReducedMotion(mediaQueryList.matches);

    handleChange();
    mediaQueryList.addEventListener('change', handleChange);
    return () => mediaQueryList.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
}
