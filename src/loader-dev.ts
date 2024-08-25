export default function cloudflareLoader ({ src }: { src: string }) {
  const srcURL = new URL(src)
  srcURL.pathname.replace('/', '/preview');
  return `${srcURL}`
};
