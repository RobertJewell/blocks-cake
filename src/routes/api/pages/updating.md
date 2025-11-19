# Content Architecture

# Database Schema

A normalized, relational structure optimized for block-based editing.

- **Pages**: Metadata (slug, title, status).
- **Blocks**: Reusable content units (id, type, data).
- **Page_Blocks**: Join table managing layout and order.

The "Schema-Driven" Pattern
We use **Zod** as the single source of truth.

1. **Define**: Create a block using defineBlock() with Zod schemas for fields.
2. **Infer**: TypeScript types and React props are automatically generated.
3. **Validate**: The API uses the same Zod schema to validate data before saving.

Data Flow

1. **Load**: loadPageData fetches metadata and joins blocks. It sanitizes legacy data (unwrapping props → data).
2. **Edit**: The **Zustand Store** manages local state. Components read from block.data.
3. **Save**: useSavePage sends the full page state to the API.
4. **Persist**: The API uses db.batch() to atomically update metadata, upsert blocks, and sync layout order in a single network trip (Cloudflare D1 compatible).

Key Files

- src/core/db/schema.ts: Database definitions.
- src/lib/cms/block-builder.ts: Factory for type-safe block creation.
- src/routes/api/pages/$...slug.ts: Transactional save handler with Zod validation.
