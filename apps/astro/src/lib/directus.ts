// Minimal fetch layer placeholder for Directus (T-0094).
// Later tasks will replace with real REST/GraphQL calls.

const DIRECTUS_URL = process.env.DIRECTUS_URL || 'http://localhost:8055';

export async function fetchAnyContent(options: {
  lang: string;
  type: string;
  slug?: string;
}) {
  if (process.env.DIRECTUS_URL) {
    try {
      const query = new URLSearchParams({
        lang: options.lang,
        type: options.type,
        slug: options.slug ?? '',
        limit: '1',
      });
      const res = await fetch(`${DIRECTUS_URL}/items/any_content?${query.toString()}`);
      if (res.ok) {
        const json = await res.json();
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
      }
    } catch (err) {
      console.warn('[directus] fetch failed, fallback to placeholder:', err.message);
    }
  }

  // Placeholder data to keep Astro pages renderable without a backend.
  return {
    title: 'Sample AnyContent',
    published_at: '2025-01-01',
    cover_url: 'https://placehold.co/800x400',
    body_markdown: 'This is a placeholder body for Astro MVP.',
    images: [
      { url: 'https://placehold.co/600x400', alt: 'sample', caption: 'sample image' },
    ],
  };
}
