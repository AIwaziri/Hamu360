import type { WebPartContext } from '@microsoft/sp-webpart-base';
import { SPFI, spfi, SPFx } from '@pnp/sp';
import '@pnp/sp/webs';
import '@pnp/sp/lists';
import '@pnp/sp/items';
import '@pnp/sp/views';

/**
 * One PnPjs `SPFI` instance per web part instance, memoized on the
 * `WebPartContext` object identity — every `SharePoint*Service` needs the
 * same `spfi().using(SPFx(context))` setup, and `spfi()` is not free
 * (it does its own internal caching/behavior wiring), so this avoids eight
 * near-identical constructions of it, one per service file, every time
 * `ServiceFactory` builds a fresh set of services.
 *
 * Deliberately not exported from `src/services/index.ts` — this is an
 * implementation detail of the `SharePoint/*` folder, not part of the
 * public service surface any component or web part should import directly.
 */
const spClientCache = new WeakMap<WebPartContext, SPFI>();

export function getSp(context: WebPartContext): SPFI {
  const cached = spClientCache.get(context);
  if (cached) {
    return cached;
  }

  const sp = spfi().using(SPFx(context));
  spClientCache.set(context, sp);
  return sp;
}
