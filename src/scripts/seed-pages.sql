-- Clear tables in dependency order
DELETE FROM page_blocks;
DELETE FROM blocks;
DELETE FROM pages;

-- Insert page
INSERT INTO pages (
  id,
  slug,
  title,
  status,
  updated_at
) VALUES (
  'home-1',
  'home',
  'Home',
  'published',
  strftime('%s', 'now')
);

-- Insert block 1 (Hero)
INSERT INTO blocks (
  id,
  type,
  data,
  updated_at
) VALUES (
  'b1',
  'hero',
  json('{
    "props": {
      "heading": "Lets Eat Some Sweets!",
      "subheading": "Pracownia cukiernicza",
      "ctaText": "Learn More",
      "ctaHref": "https://cakes.rjewellaudio.workers.dev/"
    }
  }'),
  strftime('%s', 'now')
);

-- Insert block 2 (Rich Text)
INSERT INTO blocks (
  id,
  type,
  data,
  updated_at
) VALUES (
  'b2',
  'richText',
  json('{
    "props": {
      "content": "<h1 class=\"heading-node\">We make great stuff with the best ingredients</h1><p class=\"text-node\">Quis tellus eget adipiscing convallis sit sit eget aliquet quis. Suspendisse eget egestas a elementum pulvinar et feugiat blandit at.</p><p class=\"text-node\">Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p><p class=\"text-node\">Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?</p>"
    }
  }'),
  strftime('%s', 'now')
);

-- Link blocks to page with ordered positions
INSERT INTO page_blocks (page_id, block_id, "order") VALUES
  ('home-1', 'b1', 0),
  ('home-1', 'b2', 1);
