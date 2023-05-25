"use client";

import { ImageCrops } from "@/app/(root)/_components/image-crops";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import React, { createRef, useEffect, useState } from "react";
import Cropper, { ReactCropperElement } from "react-cropper";
import { SubmitHandler, useForm } from "react-hook-form";
import { ulid } from "ulid";

import CropEndEvent = Cropper.CropEndEvent;

type EditFormProps = {
  image: File;
  title: string;
  content: string;
};

export const ContentEditForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditFormProps>();
  const [file, setFile] = useState<File>();
  const cropperRef = createRef<ReactCropperElement>();
  const [cropedFile, setCropedFile] = useState<File>();
  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setFile(e.target.files[0]);
  };

  useEffect(() => {
    console.log("file", file);
  }, [file]);

  useEffect(() => {
    console.log("cropperRef", cropperRef);
  }, [cropperRef]);

  const convertDataUrlToFile = async (
    dataURL: string,
    filename: string,
    imageType: "image/jpeg" | "image/png"
  ): Promise<File> => {
    const blob = await (await fetch(dataURL)).blob();
    return new File([blob], filename, { type: `${imageType}` });
  };

  const onSubmit: SubmitHandler<EditFormProps> = async (
    data: EditFormProps
  ) => {
    const fileName = ulid().toString();

    // cropされた画像を生成する、返り値はFile型である
    // cropperRefを取得
    // cropperRefからキャンバス型に変える
    // キャンバス型からblob型に変える
    // blob型からFile型に変える
    if (!cropperRef.current?.cropper) throw new Error("cropperRef is null");
    console.log(cropperRef.current?.cropper);

    const dataUrl = cropperRef.current.cropper.getCroppedCanvas().toDataURL();
    const _f = await convertDataUrlToFile(
      dataUrl,
      `${fileName}.png`,
      "image/png"
    );

    // ★ ここっぽい 一回目はうまくいかないが、二回目がうまく言っている
    // useStateはレンダリング後に更新されるらしい
    // でもcropperRefからfile型をつくってやれば解決する気はする？
    // なぜsetFileが必要か？
    // await setFile((old) => _f);
    // わかったこと
    // -- ボタン押すまでuseStateのsetで更新されるとfileが初期化されてしまうか、新しいfileでcropが上書きされてしまう
    // -- なので、ボタン押すまでuseStateのsetで更新されないようにする必要がある。
    // -- よってモーダルを使って試してみる
    // -- これ、https://zenn.dev/nino_cast/books/43c539eb47caab/viewer/c82a3f

    // 署名付きURLを取得
    const origin = window.location.origin;
    const signUrl = `${origin}/api/storage?file=${fileName}`;
    const res = await fetch(signUrl, { method: "GET" });
    const { url, fields } = await res.json();
    const body = new FormData();

    Object.entries({ ...fields, cropedFile }).forEach(([key, value]) => {
      body.append(key, value as string | Blob);
    });

    // 署名付きURLにファイルをアップロード
    for (let data of body.entries()) {
      console.log(data[1]);
    }

    const upload = await fetch(url, { method: "POST", body });
    console.log("upload", upload);

    // アップロード結果を確認
    if (upload.ok) {
      console.log("Uploaded successfully!");
      await fetch(`${location.origin}/api/blog`, {
        method: "POST",
        body: JSON.stringify({ ...data, image: fileName }),
      });
      // window.location.href = "/";
    } else {
      console.error("Upload failed.");
    }
  };

  // あいうえおカキクケコさし
  // あいうえおカキクケコさしあいうえおカキクケコさしあいうえおカキクケコさしあいうえおカキクケコさしあいうえおカキクケコさしあいうえおカキクケコさしあいうえおカキクケコさしあいうえおカキクケコさしあいうえおカキクケコさしあいうえおカキクケコさし

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full  space-y-8">
      <ImageCrops />
      <div className="grid w-full gap-1.5">
        <Label htmlFor="title">画像</Label>
        <Input
          type="file"
          id="image"
          accept="image/*"
          placeholder="画像"
          onInput={handleChangeFile}
          {...register("image", { required: true })}
        />
        {errors.title?.type === "required" && <ErrorText text={"必須です"} />}
      </div>
      {file && (
        <Cropper
          ref={cropperRef}
          style={{ height: 400, width: "100%" }}
          zoomTo={0.5}
          initialAspectRatio={1}
          preview=".img-preview"
          src={file && URL.createObjectURL(file)}
          viewMode={1}
          minCropBoxHeight={10}
          minCropBoxWidth={10}
          background={false}
          responsive={true}
          autoCropArea={1}
          cropend={async (event: CropEndEvent<any>) => {
            console.log("event2", event.detail);
            if (!cropperRef.current?.cropper)
              throw new Error("cropperRef is null");
            const dataUrl = cropperRef.current.cropper
              .getCroppedCanvas()
              .toDataURL();
            const _f = await convertDataUrlToFile(
              dataUrl,
              `${"fileName"}.png`,
              "image/png"
            );
            console.log("_f", _f);
            setCropedFile(_f);
          }}
          checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
          guides={true}
        />
      )}
      <div className="grid w-full gap-1.5">
        <Label htmlFor="title">タイトル</Label>
        <Input
          type="text"
          id="title"
          placeholder="ここにタイトルをつけてください"
          {...register("title", { required: true, maxLength: 24 })}
        />
        {errors.title?.type === "required" && <ErrorText text={"必須です"} />}
        {errors.title?.type === "maxLength" && (
          <ErrorText text={"24字までです"} />
        )}
      </div>
      <div className="grid w-full gap-1.5">
        <Label htmlFor="content">本文</Label>
        <Textarea
          className="h-40"
          placeholder="ここに本文を書いてください"
          id="content"
          {...register("content", {
            required: true,
            minLength: 119,
            maxLength: 960,
          })}
        />
        {errors.content?.type === "required" && <ErrorText text={"必須です"} />}
        {errors.content?.type === "minLength" && (
          <ErrorText text={"本文は120字以上で記述してください"} />
        )}
        {errors.content?.type === "maxLength" && (
          <ErrorText text={"本文は960字以内で記述してください"} />
        )}
      </div>
      <div className="flex justify-end">
        <Button type="submit">投稿する</Button>
      </div>
    </form>
  );
};

type ErrorTextProps = {
  text: string;
};

const ErrorText = ({ text }: ErrorTextProps) => {
  return <p className="text-sm text-muted-foreground text-red-500">{text}</p>;
};
