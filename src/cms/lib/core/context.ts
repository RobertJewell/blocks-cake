import "@tanstack/react-start/server-only";

export interface CMSStorageResources {
  bucket: R2Bucket;
  baseUrl: string;
  accessKeyId: string;
  secretAccessKey: string;
}

export interface CMSQueueResources {
  imageOptimizationQueue: Queue;
  screenshotQueue: Queue;
}

export interface CMSProcessingResources {
  ai: Ai;
  images: ImagesBinding;
  cloudflareAccountId: string;
  browserRenderingToken: string;
}

export interface CMSAuthConfig {
  baseURL: string;
  secret: string;
  googleClientId: string;
  googleClientSecret: string;
}

export interface CMSConfig {
  siteUrl: string;
}

export interface CMSContext {
  database: D1Database;
  storage: CMSStorageResources;
  queues: CMSQueueResources;
  processing: CMSProcessingResources;
  auth: CMSAuthConfig;
  config: CMSConfig;
}

export function createCMSContextFromEnv(env: Env): CMSContext {
  return {
    database: env.database,
    storage: {
      bucket: env.blocks_cakes_assets,
      baseUrl: env.CLOUDFLARE_R2_BASE_URL,
      accessKeyId: env.CLOUDFLARE_R2_ACCESS_KEY_ID,
      secretAccessKey: env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
    },
    queues: {
      imageOptimizationQueue: env.blocks_optimise_image,
      screenshotQueue: env.blocks_capture_screenshot,
    },
    processing: {
      ai: env.AI,
      images: env.IMAGES,
      cloudflareAccountId: env.CLOUDFLARE_ACCOUNT_ID,
      browserRenderingToken: env.CLOUDFLARE_BROWSER_RENDERING_TOKEN,
    },
    auth: {
      baseURL: env.BETTER_AUTH_URL,
      secret: env.BETTER_AUTH_SECRET,
      googleClientId: env.GOOGLE_CLIENT_ID,
      googleClientSecret: env.GOOGLE_CLIENT_SECRET,
    },
    config: {
      siteUrl: env.SITE_URL,
    },
  };
}
