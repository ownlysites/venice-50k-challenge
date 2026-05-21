/**
 * Base44 entity client — minimal wrapper for the Ownly Command app.
 *
 * Env:
 *   BASE44_API_KEY — generated in Base44 platform Settings → API Access
 *   BASE44_APP_ID  — defaults to 6a0d2a76e5127bc3295500dd (Ownly Command)
 *
 * Endpoint pattern (per Base44 REST docs):
 *   POST https://app.base44.com/api/apps/{appId}/entities/{entityName}/
 *
 * Used by /api/webhooks/* receivers to materialize entities (Interaction,
 * Contact, SitDown, Scan) from upstream sources.
 */

const BASE_URL = "https://app.base44.com/api";
const APP_ID = process.env.BASE44_APP_ID || "6a0d2a76e5127bc3295500dd";

function ready(): boolean {
  return Boolean(process.env.BASE44_API_KEY);
}

async function call<T = unknown>(
  method: "GET" | "POST" | "PATCH" | "DELETE",
  path: string,
  body?: unknown
): Promise<{ ok: boolean; status: number; data: T | null; error?: string }> {
  if (!ready()) {
    return { ok: false, status: 0, data: null, error: "BASE44_API_KEY missing — webhook ignored" };
  }
  const url = `${BASE_URL}${path}`;
  try {
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        api_key: process.env.BASE44_API_KEY as string,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    let data: unknown = null;
    try {
      data = await res.json();
    } catch {
      // ignore parse error — non-JSON response
    }
    return { ok: res.ok, status: res.status, data: data as T, error: res.ok ? undefined : `HTTP ${res.status}` };
  } catch (e) {
    return { ok: false, status: 0, data: null, error: e instanceof Error ? e.message : "fetch failed" };
  }
}

export async function createEntity<T = unknown>(entity: string, payload: Record<string, unknown>) {
  return call<T>("POST", `/apps/${APP_ID}/entities/${entity}/`, payload);
}

export async function queryEntity<T = unknown>(
  entity: string,
  filter: Record<string, unknown>,
  limit = 5
) {
  // Base44 query — pass filter as JSON in body. Endpoint pattern best-effort;
  // adjust once Base44 API behavior is verified in staging.
  const qs = new URLSearchParams({
    q: JSON.stringify(filter),
    limit: String(limit),
  });
  return call<{ entities: T[] }>("GET", `/apps/${APP_ID}/entities/${entity}/?${qs.toString()}`);
}

export async function findOrCreateContact(input: {
  name?: string;
  business?: string;
  email?: string;
  phone?: string;
  linkedin_url?: string;
  tags?: string[];
}): Promise<{ contactId: string | null; created: boolean; error?: string }> {
  // Try to find by email first, then phone, then linkedin
  const candidates: Record<string, unknown>[] = [];
  if (input.email) candidates.push({ emails: input.email });
  if (input.phone) candidates.push({ phones: input.phone });
  if (input.linkedin_url) candidates.push({ linkedin_url: input.linkedin_url });

  for (const filter of candidates) {
    const r = await queryEntity<{ id: string }>("Contact", filter, 1);
    if (r.ok && r.data?.entities?.[0]?.id) {
      return { contactId: r.data.entities[0].id, created: false };
    }
  }

  // Not found — create
  const c = await createEntity<{ id: string }>("Contact", {
    name: input.name ?? input.business ?? input.email ?? "Unknown",
    business: input.business,
    emails: input.email ? [input.email] : [],
    phones: input.phone ? [input.phone] : [],
    linkedin_url: input.linkedin_url,
    tags: input.tags ?? [],
    pipeline_stage: "prospect",
    dbc_synced: false,
  });
  return {
    contactId: c.data && typeof c.data === "object" && "id" in c.data ? (c.data as { id: string }).id : null,
    created: c.ok,
    error: c.error,
  };
}

export const base44 = {
  ready,
  createEntity,
  queryEntity,
  findOrCreateContact,
};
