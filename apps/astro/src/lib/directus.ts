// Directus fetch helpers (T-0095)

const DIRECTUS_URL = process.env.DIRECTUS_URL || "http://localhost:8055";
const DIRECTUS_TOKEN_READONLY = process.env.DIRECTUS_TOKEN_READONLY;

async function fetchJson(url: string) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (DIRECTUS_TOKEN_READONLY) {
    headers.Authorization = `Bearer ${DIRECTUS_TOKEN_READONLY}`;
  }
  const res = await fetch(url, { headers });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${res.statusText} :: ${text}`);
  }
  return res.json();
}

export async function fetchAnyContent(options: {
  lang: string;
  type: string;
  slug?: string;
}) {
  if (process.env.DIRECTUS_URL) {
    try {
      const query = new URLSearchParams({
        "filter[lang][_eq]": options.lang,
        "filter[type][_eq]": options.type,
        ...(options.slug ? { "filter[slug][_eq]": options.slug } : {}),
        limit: "1",
        fields: "*.*",
      });
      const json = await fetchJson(`${DIRECTUS_URL}/items/any_content?${query.toString()}`);
      const item = json?.data?.[0];
      if (item) {
        return {
          title: item.title,
          published_at: item.published_at,
          cover_url: item.meta?.cover_url ?? item.cover_url,
          body_markdown: item.body_markdown,
          images: item.images ?? [],
        };
      }
    } catch (err) {
      console.warn("[directus] fetch failed, fallback to placeholder:", (err as Error).message);
    }
  }

  // Placeholder data to keep Astro pages renderable without a backend.
  return {
    title: "Sample AnyContent",
    published_at: "2025-01-01",
    cover_url: "https://placehold.co/800x400",
    body_markdown: "This is a placeholder body for Astro MVP.",
    images: [
      { url: "https://placehold.co/600x400", alt: "sample", caption: "sample image" },
    ],
  };
}

export async function fetchAnyContentList(options: { lang: string; type: string; limit?: number }) {
  if (process.env.DIRECTUS_URL) {
    try {
      const query = new URLSearchParams({
        "filter[lang][_eq]": options.lang,
        "filter[type][_eq]": options.type,
        sort: "-published_at",
        limit: String(options.limit ?? 20),
        fields: "id,slug,title,published_at,type,lang,meta.cover_url,cover_url",
      });
      const json = await fetchJson(`${DIRECTUS_URL}/items/any_content?${query.toString()}`);
      return json?.data ?? [];
    } catch (err) {
      console.warn("[directus] list fetch failed, fallback to empty:", (err as Error).message);
    }
  }
  return [];
}
