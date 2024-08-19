export default function cloudflareLoader ({ src, dpr }: { src: string, dpr?: number }) {
  const srcURL = new URL(src)
  if (dpr) {
    srcURL.pathname = `${dpr}/${srcURL.pathname}`
  }
  return `${srcURL}`
};
