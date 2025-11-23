-- Clear tables in dependency order
DELETE FROM page_blocks;
DELETE FROM blocks;
DELETE FROM pages;

-- ==========================================
-- 1. INSERT PAGES
-- ==========================================

-- Page 1: Root/Index (Matches slug "index" for path "/")
INSERT INTO pages (id, slug, title, status, updated_at)
VALUES (
  'p_index',
  'index',
  'Home Page',
  'published',
  strftime('%s', 'now')
);

-- Page 2: Nested Route (Matches path "/blog/post-1")
INSERT INTO pages (id, slug, title, status, updated_at)
VALUES (
  'p_blog_1',
  'blog/post-1',
  'Delicious Cupcake Recipes',
  'published',
  strftime('%s', 'now')
);

-- ==========================================
-- 2. INSERT BLOCKS
-- ==========================================

-- B1: Hero for Index
INSERT INTO blocks (id, type, data, updated_at)
VALUES (
  'b_hero_1',
  'hero',
  json('{
      "heading": "Lets Eat Some Sweets!",
      "subheading": "Pracownia cukiernicza",
      "ctaText": "Learn More",
      "ctaHref": "/blog/post-1"
  }'),
  strftime('%s', 'now')
);

-- B2: Rich Text for Index
INSERT INTO blocks (id, type, data, updated_at)
VALUES (
  'b_text_1',
  'richtext',
  json('{
      "content": "<h1 class=\"heading-node\">We make great stuff</h1><p class=\"text-node\">Welcome to the index page. This proves the root route works.</p>"
  }'),
  strftime('%s', 'now')
);

-- B3: Hero for Blog Post
INSERT INTO blocks (id, type, data, updated_at)
VALUES (
  'b_hero_2',
  'hero',
  json('{
      "heading": "The Art of Cupcakes",
      "subheading": "November 2024",
      "ctaText": "Back Home",
      "ctaHref": "/"
  }'),
  strftime('%s', 'now')
);

-- B4: Rich Text for Blog Post
INSERT INTO blocks (id, type, data, updated_at)
VALUES (
  'b_text_2',
  'richtext',
  json('{
      "content": "<p class=\"text-node\">This is a <strong>nested route</strong> test.</p><p>If you can see this, the catch-all route properly handled the slash in the slug (blog/post-1).</p>"
  }'),
  strftime('%s', 'now')
);

-- ==========================================
-- 3. LINK BLOCKS TO PAGES
-- ==========================================

-- Link Index Page (Hero -> Text)
INSERT INTO page_blocks (page_id, block_id, "order") VALUES
  ('p_index', 'b_hero_1', 0),
  ('p_index', 'b_text_1', 1);

-- Link Blog Page (Hero -> Text)
INSERT INTO page_blocks (page_id, block_id, "order") VALUES
  ('p_blog_1', 'b_hero_2', 0),
  ('p_blog_1', 'b_text_2', 1);
