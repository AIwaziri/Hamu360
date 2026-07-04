const TABLER_ICON_FONT_URL = 'https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@2.44.0/tabler-icons.min.css';
const LINK_ELEMENT_ID = 'h360-tabler-icon-font';

/**
 * FLAGGED RISK — read before touching this file.
 *
 * The approved wireframe loads Tabler Icons as a webfont from a public CDN
 * (`HOS_All_Departments_Wireframe_v1.html`'s `<head>`). That is a reasonable
 * choice for a static mockup; it is a materially different decision for a
 * production SPFx web part running inside a client's SharePoint tenant,
 * because it adds an unreviewed third-party runtime dependency (CDN
 * availability, supply-chain trust, tenant CSP) that Sprint 2 is not the
 * right place to sign off on.
 *
 * This function exists so that dependency is isolated to exactly one file,
 * called from exactly one place (`Icon.tsx`), idempotent, and easy to rip
 * out. Before Sprint 6 sign-off, this must be either (a) formally reviewed
 * and allow-listed against the tenant's Content Security Policy, or (b)
 * replaced with locally bundled SVG icon components. Treat this as a Sprint
 * 2 stopgap chosen to match the wireframe pixel-for-pixel — not a security
 * decision anyone has actually approved.
 */
export function ensureTablerIconFont(): void {
  if (typeof document === 'undefined') {
    return;
  }
  if (document.getElementById(LINK_ELEMENT_ID)) {
    return;
  }

  const link = document.createElement('link');
  link.id = LINK_ELEMENT_ID;
  link.rel = 'stylesheet';
  link.href = TABLER_ICON_FONT_URL;
  document.head.appendChild(link);
}
