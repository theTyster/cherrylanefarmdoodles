export const runtime = "edge";

export default async function WhiteLayout({
  children,
}: {
  children: React.ReactNode;
}): Promise<JSX.Element | null> {
  return (
    <>
      { children }
    </>
  )
}
