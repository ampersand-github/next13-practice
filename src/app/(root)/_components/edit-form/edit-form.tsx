"use client";

import { CropperDialog } from "@/app/(root)/_components/edit-form/cropper-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import imageCompression from "browser-image-compression";
import { atom } from "jotai";
import { useAtom } from "jotai/index";
import Image from "next/image";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { ulid } from "ulid";
import { z } from "zod";

export const EditForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<Schema>({ resolver: zodResolver(schema) });
  const [cropperImage] = useAtom(cropperImageAtom);

  useEffect(() => {
    if (cropperImage) setValue("image", cropperImage);
  }, [cropperImage]);

  const onSubmit = async (data: Schema) => {
    if (!data.image) return;
    console.log("data", data);
    // todo 名前考える
    const result = await uploadImageToGCS(data.image);
    console.log("result", result);
    if (!result.ok) throw new Error("Failed to upload image.");
    await fetch("/api/blog", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...data, image: data.image.name }),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* 画像 */}
      <CropperDialog />
      {cropperImage && (
        <Image src={URL.createObjectURL(cropperImage)} alt="preview" />
      )}
      {errors.image?.message && <p>{errors.image?.message}</p>}

      {/* タイトル */}
      <Input {...register("title")} />
      {errors.title && <span>{errors.title.message}</span>}

      {/* コンテキスト */}
      <Textarea {...register("content")} />
      {errors.content && <span>{errors.content.message}</span>}

      {/* ボタン */}
      <Button type="submit">Submit</Button>
    </form>
  );
};

const schema = z.object({
  image: z.custom<File>().refine((file) => file !== undefined, {
    message: "画像を選択してください",
  }),
  title: z
    .string()
    .min(1, { message: "入力必須です" })
    .max(40, { message: "40文字以内で入力してください" }),
  content: z
    .string()
    .min(1, { message: "入力必須です" })
    .max(800, { message: "200文字以内で入力してください" }),
});

type Schema = z.infer<typeof schema>;

export const cropperImageAtom = atom<File | undefined>(undefined);

const uploadImageToGCS = async (image: File): Promise<Response> => {
  const resizedImage = await imageCompression(image, { maxSizeMB: 1 });

  // todo URLとパラメータをどうもたせる？
  const res = await fetch(
    `${window.location.origin}/api/storage?file=${ulid().toString()}`,
    { method: "GET" }
  );

  if (!res.ok) throw new Error("Failed to get signed url.");
  const { url, fields } = await res.json();

  const body = new FormData();
  Object.entries({ ...fields }).forEach(([key, value]) => {
    body.append(key, value as string);
  });
  body.append("file", resizedImage);

  return await fetch(url, { method: "POST", body });
};
