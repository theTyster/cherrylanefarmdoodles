export const runtime = "edge";
import Puppifications from "@/components/subscribe-buttons/puppifications";
import AdoptionBanner from "@/components/adoption-banner/adoption-banner";

export default async function TanLayout() {

  return (
    <>
      <AdoptionBanner />
      <div style={{height: '100px'}}></div>
      <Puppifications />
    </>
  );
}
