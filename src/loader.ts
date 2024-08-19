export default function cloudflareLoader ({ src }: { src: string }) {
  const srcURL = new URL(src)
  return `${srcURL}`
};
