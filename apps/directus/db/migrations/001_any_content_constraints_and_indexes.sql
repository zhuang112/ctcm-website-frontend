-- T-0103: add constraints and indexes for any_content and any_content_images

-- Enforce uniqueness on type+lang+slug
CREATE UNIQUE INDEX IF NOT EXISTS idx_any_content_type_lang_slug
  ON any_content (type, lang, slug);

-- Helpful indexes for common queries
CREATE INDEX IF NOT EXISTS idx_any_content_lang_type
  ON any_content (lang, type);

CREATE INDEX IF NOT EXISTS idx_any_content_published_at
  ON any_content (published_at);

-- Images relations
CREATE INDEX IF NOT EXISTS idx_any_content_images_parent
  ON any_content_images (parent);

CREATE INDEX IF NOT EXISTS idx_any_content_images_parent_sort
  ON any_content_images (parent, sort);
