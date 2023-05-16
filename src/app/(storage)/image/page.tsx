"use client";

import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { ulid } from "ulid";

export default function ImagePage() {
  const { handleSubmit } = useForm();
  const [file, setFile] = useState<File>();

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setFile(e.target.files[0]);
  };

  const handleClick = handleSubmit(async () => {
    if (!file) return;
    await uploadImage(file);
  });

  const uploadImage = useCallback(async (file: File) => {
    // 署名付きURLを取得
    const fileName = ulid().toString();
    const origin = window.location.origin;
    const signUrl = `${origin}/api/storage?file=${fileName}`;
    const res = await fetch(signUrl, { method: "GET" });
    const { url, fields } = await res.json();
    const body = new FormData();
    Object.entries({ ...fields, file }).forEach(([key, value]) => {
      body.append(key, value as string | Blob);
    });

    // 署名付きURLにファイルをアップロード
    const upload = await fetch(url, { method: "POST", body });

    // アップロード結果を確認
    if (upload.ok) {
      console.log("Uploaded successfully!");
    } else {
      console.error("Upload failed.");
    }
  }, []);

  return (
    <>
      <div>
        写真
        <input
          type="file"
          accept="image/*"
          onChange={handleChangeFile}
          id="image"
        />
        <input type="submit" onClick={handleClick} />
      </div>
    </>
  );
}
