export const runtime = "edge";
import MyForm from "./form";

export default async function Page() {
  return (
    <div>
      <h1>Test Page</h1>
      <MyForm />
    </div>
  );
}
