import { Cherry_Swash } from "next/font/google";

export const font = Cherry_Swash({
  weight: ["400", "700"],
  style: "normal",
  display: "auto",
  subsets: ["latin"],
  fallback: ["system-ui", "arial"],
});
