declare module 'cloudflare:test' {
  // Controls the type of `import("cloudflare:test").env`
  interface ProvidedEnv extends CloudflareEnv {
    TEST_MIGRATIONS: D1Migration[]; // Defined in `vitest.config.ts`
    TEST_IMAGES: Record<string, string>;
  }
}
