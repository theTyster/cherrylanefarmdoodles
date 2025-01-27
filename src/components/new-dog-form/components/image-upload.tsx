import { GlobalNameSpaces as G } from "@/constants/data";
import { useState } from "react";
import Image from "next/image";
import FormInput from "@/components/new-dog-form/components/form-input";

export default function ImageUpload({
  variant,
}: {
  variant: "small" | "large" | "group";
}) {
  const [preview, setPreview] = useState<string | null>(null);

  return (
    <FormInput
      label={
        <>
          {variant === "small" && (
            <>
              Upload a <b>small</b> headshot (optional)
            </>
          )}
          {variant === "large" && (
            <>
              Upload a <b>large</b> headshot (optional)
            </>
          )}
          {variant === "group" && "Upload a group image (optional)"}
        </>
      }
    >
      <input
        name={
          variant === "small"
            ? G["Headshots_Sm"]
            : variant === "large"
            ? G["Headshots_Lg"]
            : G["Group_Photos"]
        }
        type="file"
        accept="image/*"
        onChange={(event) => {
          if (event.target.files && event.target.files.length > 0) {
            const objectUrl = URL.createObjectURL(event.target.files[0]);
            setPreview(objectUrl);
          }
        }}
      />

      {preview && variant === "small" ? (
        <Image
          src={preview}
          alt="Preview"
          height={292}
          width={292}
          style={{
            objectFit: "cover",
          }}
        />
      ) : preview && variant === "large" ? (
        <Image
          src={preview}
          alt="Preview"
          width={500}
          height={666}
          style={{
            objectFit: "cover",
          }}
        />
      ) : (
        preview && (
          <Image
            src={preview}
            alt="Preview"
            width={433}
            height={615}
            style={{
              objectFit: "cover",
            }}
          />
        )
      )}
    </FormInput>
  );
}
