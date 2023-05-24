"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
// 必須 ないとレイアウトが崩れる
import "cropperjs/dist/cropper.css";
import React, { createRef, useState } from "react";
import Cropper, { ReactCropperElement } from "react-cropper";
import { ulid } from "ulid";

export const DialogDemo = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [image, setImage] = React.useState<File>();
  const [trimmedImage, setTrimmedImage] = useState<File>();
  const cropperRef = createRef<ReactCropperElement>();
  const [_image, _setImage] = React.useState<File>();

  const handleClose = () => {
    setIsOpen(false);
    setImage(undefined);
  };

  const handleOpenChang = (bool: Boolean) => {
    if (!bool) {
      handleClose();
      return;
    }
    if (bool && !image) {
      setIsOpen(false);
      return;
    }
    setIsOpen(true);
  };

  const handleInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (!e.target.files) return;
    setImage(e.target.files[0]);
    setIsOpen(true);
    _setImage(e.target.files[0]);
  };

  const convertDataUrlToFile = async (
    dataURL: string,
    filename: string,
    type: "image/png" | "image/jpeg"
  ): Promise<File> => {
    const blob = await (await fetch(dataURL)).blob();
    return new File([blob], filename, { type: type });
  };

  const getTrimmedImage = async () => {
    if (!cropperRef.current) return;
    const canvas = cropperRef.current.cropper.getCroppedCanvas();
    const dataURL = canvas.toDataURL();
    const file = await convertDataUrlToFile(dataURL, "image.png", "image/png");
    setTrimmedImage(file);
  };

  const uploadOneImage = async (
    // filePath: string,
    // fileName: string,
    image: File
  ): Promise<Response> => {
    const fileName = ulid().toString();
    const origin = window.location.origin;
    const signUrl = `${origin}/api/storage?file=${fileName}`; // APIのほうに回してもいいかも
    const res = await fetch(signUrl, { method: "GET" });
    if (!res.ok) throw new Error("Failed to get signed url.");

    const { url, fields } = await res.json();
    const body = new FormData();
    Object.entries({ ...fields }).forEach(([key, value]) => {
      body.append(key, value as string);
    });
    body.append("file", image);
    return await fetch(url, { method: "POST", body });
  };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={handleOpenChang}>
        {/* ダイアログ用のボタン */}
        <DialogTrigger asChild>
          <label className="block">
            <span className="sr-only">Choose profile photo</span>
            <input
              type="file"
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4  file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
              id="image"
              accept="image/*"
              placeholder="画像"
              onInput={handleInput}
            />
          </label>
        </DialogTrigger>

        {/* ダイアログ本体 */}
        <DialogContent className="sm:max-w-[425px]">
          {/* ダイアログのヘッダー */}
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you are done.
            </DialogDescription>
          </DialogHeader>
          {/* ダイアログのコンテンツ */}
          <div className="">
            {image && (
              <Cropper
                src={image && URL.createObjectURL(image)}
                ref={cropperRef}
                // style={{ height: 1, width: "100%" }}
                aspectRatio={16 / 9}
                guides={true}
                viewMode={1}
                minCropBoxHeight={10}
                minCropBoxWidth={10}
                background={false}
                responsive={true}
                checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
                autoCropArea={1}
              ></Cropper>
            )}
          </div>
          {/* ダイアログのフッター */}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={async () => handleClose()}
            >
              キャンセル
            </Button>
            <Button
              type="button"
              onClick={async () => {
                await getTrimmedImage();
                handleClose();
              }}
            >
              保存する
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {trimmedImage && (
        <>
          <img src={URL.createObjectURL(trimmedImage)} alt="" />
          <button
            type={"button"}
            onClick={async () => {
              await uploadOneImage(trimmedImage);
            }}
          >
            GCSに送信
          </button>
        </>
      )}
      {_image && (
        <>
          <img src={URL.createObjectURL(_image)} alt="" />
          <button
            type={"button"}
            onClick={async () => {
              await uploadOneImage(_image);
            }}
          >
            GCSに元画像を送信
          </button>
        </>
      )}
    </div>
  );
};
