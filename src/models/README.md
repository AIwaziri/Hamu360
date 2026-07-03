# models

TypeScript interfaces for domain/business entities (as opposed to `src/types`, which holds generic utility types with no business meaning).

`ICurrentUser` is seeded here because it's genuinely cross-cutting infrastructure (every feature needs "who is logged in"). Feature-specific domain models (a Case, a Document, a Matter, ...) get added here once that feature is built — none exist yet, per the Sprint 0 scope.
