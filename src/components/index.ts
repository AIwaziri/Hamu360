// Generic layout primitives only — see README.md for what does and doesn't
// belong in this folder. Each primitive is also individually importable
// (e.g. `@components/Stack`) for consumers that want to avoid pulling in
// the full barrel; both paths tree-shake identically under webpack since
// none of these have side effects.
export * from './Container';
export * from './Section';
export * from './Stack';
export * from './Grid';
export * from './Spacer';

// Added in Sprint 2 (see README.md's "Sprint 2 additions" note) — the first
// components with any visual "personality", needed once real chrome
// (Header/Navigation/Footer) had to render text, icons, and interactive
// controls on top of Sprint 1's layout-only primitives above.
export * from './Button';
export * from './Icon';
export * from './Typography';
