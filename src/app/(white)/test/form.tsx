"use client";

export default function UploadForm() {
  const handleSubmit = async (formData: FormData) => {
    const file = formData.get("file") as File;
    const chunkSize = 5 * 1024 * 1024; // 5MB chunks

    // Create multipart upload via RPC
    const { key, uploadId }: { key: string; uploadId: number } = await fetch(
      "/api/rpc",
      {
        method: "POST",
        body: JSON.stringify({
          action: "createMultipartUpload",
          key: file.name,
        }),
      }
    ).then((res) => res.json());

    // Upload chunks via RPC
    const parts = [];
    for (let i = 0; i < Math.ceil(file.size / chunkSize); i++) {
      const chunk = file.slice(i * chunkSize, (i + 1) * chunkSize);
      const buffer = await chunk.arrayBuffer();

      const part = await fetch("/api/rpc", {
        method: "POST",
        body: JSON.stringify({
          action: "uploadPart",
          key,
          uploadId,
          partNumber: i + 1,
          body: Array.from(new Uint8Array(buffer)), // Serialize binary
        }),
      }).then((res) => res.json());

      parts.push(part);
    }

    // Complete via RPC
    await fetch("/api/rpc", {
      method: "POST",
      body: JSON.stringify({
        action: "completeMultipartUpload",
        key,
        uploadId,
        parts,
      }),
    });
  };

  return (
    <form action={handleSubmit}>
      <input type="file" name="file" />
      <button type="submit">Upload</button>
    </form>
  );
}
