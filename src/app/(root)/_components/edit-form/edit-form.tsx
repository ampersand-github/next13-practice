"use client";

import { CropperDialog } from "@/app/(root)/_components/edit-form/cropper-dialog";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { Textarea } from "@/app/_components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import imageCompression from "browser-image-compression";
import { atom, useAtom } from "jotai";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

  useEffect(() => {
    if (cropperImage) setValue("image", cropperImage);
  }, [cropperImage]);

  const onSubmit = async (data: Schema) => {
    console.log("1");
    if (!data.image) return;

    console.log("2");
    const imageName = ulid().toString();

    // GCSに画像をアップロード
    console.log("3");
    console.log(data.image.size);

    const resultGCP = await uploadToGCS(data.image, "thumbnail", imageName);
    if (!resultGCP.ok) throw new Error("Failed to upload image.");

    console.log("4");
    // ブログを投稿
    const result = await fetch("/api/blog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, image: imageName }),
    });
    console.log("5");
    if (!result.ok) throw new Error("Failed to post blog.");
    router.push("/");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={"min-w-full space-y-8"}>
      {/* 画像 */}
      <CropperDialog />
      {cropperImage && (
        <img src={URL.createObjectURL(cropperImage) ?? ""} alt="preview" />
      )}
      {errors.image?.message && <p>{errors.image?.message}</p>}

      {/* タイトル */}
      <div className="space-y-4">
        <label>記事のタイトル</label>
        <Input {...register("title")} />
        {errors.title && <span>{errors.title.message}</span>}
      </div>

      {/* コンテキスト */}
      <div className="space-y-4">
        <label>記事の内容</label>
        <Textarea {...register("content")} />
        {errors.content && <span>{errors.content.message}</span>}
      </div>

      {/* ボタン */}
      <Button type="submit" className={"w-full"}>
        投稿する
      </Button>
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
    .max(2000, { message: "2000文字以内で入力してください" }),
});

type Schema = z.infer<typeof schema>;

export const cropperImageAtom = atom<File | undefined>(undefined);

const uploadToGCS = async (
  image: File,
  pathName: string,
  fileName: string
): Promise<Response> => {
  const resizedImage = await imageCompression(image, {
    maxSizeMB: 1,
    maxWidthOrHeight: 2028,
  });

  // メモ；バケットを作成するごとに、CORS設定をしないといけない。
  const res = await fetch(
    `${window.location.origin}/api/storage/public/upload?path=${pathName}&file=${fileName}`,
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
