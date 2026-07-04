# models

TypeScript interfaces for domain/business entities (as opposed to `src/types`, which holds generic utility types with no business meaning).

`ICurrentUser` is seeded here because it's genuinely cross-cutting infrastructure (every feature needs "who is logged in"). Feature-specific domain models (a Case, a Document, a Matter, ...) get added here once that feature is built.

## Sprint 3 additions

`IPartnerMessage`, `IAnnouncement`, `IQuickLink` — the Home page hero's three data shapes. `IAnnouncement`/`IQuickLink` deliberately mirror their real SharePoint List columns field-for-field (see each file's own docblock for why); `IPartnerMessage` deliberately does not mirror any specific API shape, since its real Sprint 6 source (SharePoint News) isn't a custom List with a fixed column set the way the other two are.
