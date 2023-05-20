"use client";

import React, { useState } from "react";

export const ModalForm = async () => {
  const [image, setImage] = useState<File>();
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setImage(e.target.files[0]);
  };
  return (
    <div>
      <input
        type="file"
        id="image"
        accept="image/*"
        placeholder="画像"
        onInput={handleInput}
      />
    </div>
  );
};
