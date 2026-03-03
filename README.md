# Blocks - A CMS experiment

## The Project

This is a work in progress with a few aims:

- A simple and intuative user experience with realtime feedback.
- A decent developer experience that allows for easy extension
- Solve problems with architecture (Cloudflare) - not code.

If you’re the kind of person who reads github READMEs (and you are), that last one might be the most interesting. I’m not saying this path is a _good_ idea, but it is fun.  
We can cover the tech stack, then I’ll rant about _why_ I’m trying this.

### The Tech Stack

- **Drizzle ORM** (schema + migrations)
- **Better Auth** (email/password login)
- **React Hook Form + Zod**
- **Motion (formerly Framer Motion)**
- **TanStack Start**
- **Cloudflare D1** (local + production)
- …Many other cloudflare services

## The Origin Story

Headless CMSs are great\*
They separate the content from the presentation and that’s wonderful.

The problem is this requires the user to have a mental model of the presention layer and how that will change the content.

…And it **_will_** change the content.

How the content is **_presented_** changes how the reader perceives it.

Just in those last two lines you read the words “will” and “presented” differently because they were emphasised. That was just bolding them. What about when they’re 3 sizes larger and a in different font?

For a casual user, a preview of the page where they can see the results of their edits is really useful. Not every part of a CMS needs to headless.
There are advantages to having your CMS live alongside your app - for example: Payload [The Next.js Headless CMS and App Framework](https://payloadcms.com/)

Payload is great, it makes minimal tradeoffs to allow easy live previews of edits and powerful features, while remaining fairly portable.

This repo is about taking that to an extreme, trading all portability for speed, simplicity and convenience. Where possible, it makes the **infrastructure** the solution.
Specifically - Cloudflare.

## Why Though?

Let’s look at an example:

### Optimising Images.

With payload we can setup a storage provider and supply details for which image sizes we want, then when the user uploads an image it uses the sharp library to transform it and upload the variants.
The issue is that takes time, the user has to wait for the optmisation of the images _and_ the upload of those variants.

This isn’t a criticism of Payload, it’s a very reasonable compromise that allows it to work across all kinds of setups.
… but what if we were **unreasonable?**

Instead of doing it on the client, we can move all of this and more to cloudflare services.

When an image is uploaded to R2 (cloudflare’s S3 equivalent), we send the key to a queue.
Our queue consumer…

- Loads that images from R2 from the key.
- Optimises it to our specifications using Cloudflare images.
- Generates alt text using Workers AI.
- Uses the array buffer holding our image to create a blurhash.
- Uploads the variants to R2
- Updates our database (Cloudflare D1)

This all happens:

- Without interupting the user.
- Without blocking saving.
- Without needing to keep the browser open.
- It also handles retries! 🎉

And all that happens in around 140 lines of code…

### Future plans and considerations

Bold move to assume this has a future, it's more of an experiment, but...
This will eventually be a monorepo (likely using and bun or pnpm workspaces, we don't need nx or turborepo for this), with the cms imported into multiple front-ends.
This is why we're leaning so heavily into server functions over api routes and isolating the cms components. That means less to set up on each new project.

Side note: I know I keep saying "we", it's just me, but it feels weird not to.

### Setting up a new project

When the monorepo happens, each new front-end will need to wire up its own Cloudflare resources and map them to `CMSContext`. The CMS itself won't touch `env` directly — it only knows about the context shape.

Concretely, for each new project you'll need to:

- Define the Cloudflare bindings in `wrangler.jsonc` (D1, R2, queues, etc.)
- Implement `createCMSContextFromEnv` in `src/server.ts`, mapping your binding names to the `CMSContext` shape
- That's it. The CMS doesn't change.
