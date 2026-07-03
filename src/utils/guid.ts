/**
 * RFC4122-ish v4 GUID generator. `crypto.randomUUID` is not available on the
 * older WebViews some SharePoint-embedded surfaces (Teams desktop, Outlook
 * add-in panes) still ship, so we fall back to a manual implementation
 * instead of assuming a modern runtime.
 */
export function createGuid(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (character) => {
    const random = (Math.random() * 16) | 0;
    const value = character === 'x' ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
}
