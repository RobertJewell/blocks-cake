# BetterAuth CLI Config

This file exists **only for the BetterAuth CLI**.

- • The CLI runs in **Node**, not Cloudflare
- • Node **cannot** load cloudflare:workers or D1
- • So production auth cannot be used by the CLI
- • This file gives the CLI a **safe fake DB** just to read the config

Runtime auth is separate and used only in Cloudflare Workers.

## Usage

```typescript
npx @better-auth/cli generate --config ./src/core/auth/auth.ts
```

This file is **never bundled** and **not used in production**.

Our actual auth file exists only in middleware:
`/src/core/middleware/auth-middleware.ts`
