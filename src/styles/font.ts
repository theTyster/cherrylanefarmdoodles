import { Cherry_Swash } from "next/font/google";

export const font = Cherry_Swash({
  weight: ["400", "700"],
  preload: true,
  subsets: ["latin"],
  fallback: ["system-ui", "arial"]
});

