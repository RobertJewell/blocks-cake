## pages

Stores high-level page metadata such as slug, title, status, and timestamps.
Each page is identified by a stable id (e.g., a nanoid), and slug is unique so pages can be looked up by URL.

## blocks

Represents individual content blocks (e.g., text, hero, image, etc.).
Each block stores its own type and data payload in JSON.
Blocks are stored independently so they can be reused, updated selectively, and validated more easily.

## page_blocks

This join table creates an ordered list of blocks for each page using:

pageId → references pages.id

blockId → references blocks.id

order → determines the block’s position on the page

A unique index on (pageId, blockId) ensures a block cannot be added twice to the same page.
Foreign keys with ON DELETE CASCADE maintain referential integrity — when a page or block is removed, the associated join rows are cleaned up automatically.
