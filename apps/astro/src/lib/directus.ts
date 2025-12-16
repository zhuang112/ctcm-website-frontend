// Minimal fetch layer placeholder for Directus (T-0094).
// Later tasks will replace with real REST/GraphQL calls.

export async function fetchAnyContent(options: {
  lang: string;
  type: string;
  slug?: string;
}) {
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
