"use client";
import {  D1Tables as D1T } from "@/constants/data";
import { useState } from "react";
import FormInput from "@/components/new-dog-form/components/form-input";
import Headshot from "@/components/Headshots/Headshots";
import GroupPhoto from "@/components/GroupPhoto/GroupPhoto";

const VariantKeys = ["small", "large", "group"] as const;
const VARIANTS = {
  [VariantKeys[0]]: D1T["Headshots_Sm"],
  [VariantKeys[1]]: D1T["Headshots_Lg"],
  [VariantKeys[2]]: D1T["Group_Photos"],
} as const;

type VariantKeysType = (typeof VariantKeys)[number];

export default function ImageUpload({ variant }: { variant: VariantKeysType }) {
  const [preview, setPreview] = useState<string | null>(null);

  return (
    <>
      <FormInput
        label={
          <>
            Upload a <b>{variant}</b> image
          </>
        }
      >
        <input
          name={VARIANTS[variant]}
          type="file"
          accept="image/*"
          onChange={(event) => {
            if (event.target.files && event.target.files.length > 0) {
              const objectUrl = URL.createObjectURL(event.target.files[0]);
              setPreview(objectUrl);
            }
          }}
        />

        {preview &&
          (variant === VariantKeys[0] || variant === VariantKeys[1] ? (
            <>
              <Headshot
                src={preview}
                alt="Preview"
                variant={VARIANTS[variant]}
                style={{ marginTop: "1rem" }}
              />
            </>
          ) : (
            <GroupPhoto
              src={preview}
              alt="Preview"
              variant={VARIANTS[variant]}
            />
          ))}
      </FormInput>
    </>
  );
}
