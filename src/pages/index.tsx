export default function Home({ section }: { section: "white" | "wood" | "tan" }) {
    if (section === "white")
    return (
      <>
        <h2>White Layout</h2>
        <p>This is the white layout.</p>
      </>
    );
      if (section === "wood")
    return (
      <>
        <h2>Wood Layout</h2>
        <p>This is the wood layout.</p>
      </>
    );
  if (section === "tan")
    return (
      <>
        <h2>Tan Layout</h2>
        <p>This is the tan layout.</p>
      </>
    );
}
