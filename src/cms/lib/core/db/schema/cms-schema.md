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

order → determines the block's position on the page

A unique index on (pageId, blockId) ensures a block cannot be added twice to the same page.
Foreign keys with ON DELETE CASCADE maintain referential integrity — when a page or block is removed, the associated join rows are cleaned up automatically.

## scopes

Defines scope contexts (e.g., "global"... whatever else we add later, there's just global for now, but you get the idea)
Scopes are identified by a unique id and name, allowing multiple scope-specific configurations.

## globals

Stores application-wide configuration values scoped to specific contexts.
Each global has a user-defined key, a scope reference, a type (string, number, json, system-navigation, system-theme), and a value stored as JSON.
A composite index on (key, scopeId) allows duplicate keys across different scopes while maintaining efficient lookups.
