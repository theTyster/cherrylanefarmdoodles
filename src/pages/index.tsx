import { WhiteLayout, WoodLayout, TanLayout } from "./sections";
import { type Sections } from "@/types";

export default function Home({ section }: { section: Sections }) {
  if (section === "white") {
    return <WhiteLayout />;
  }
  if (section === "wood") {
    return <WoodLayout />;
  }
  if (section === "tan") {
    return <TanLayout />;
  }
}
