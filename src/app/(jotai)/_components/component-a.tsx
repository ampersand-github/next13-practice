"use client";

import { DialogJotai } from "@/app/(modal)/modal/_components/modal-jotai";
import { useAtom } from "jotai";
import { atom } from "jotai";
import Link from "next/link";
import React from "react";

export const globalNumAtom = atom<number>(0);
export const globalFileAtom = atom<File | null>(null);
export const AppTrialAServerComponent = () => {
  const [globalNum, setGlobalNum] = useAtom(globalNumAtom);
  const [globalFile] = useAtom(globalFileAtom);

  const handlePlus = (): void => {
    setGlobalNum((value: number) => value + 1);
  };

  const handleMinus = (): void => {
    setGlobalNum((value: number) => value - 1);
  };

  return (
    <div className="pl-4">
      <h2>以下はクライアントコンポーネント</h2>
      <div>globalNum: {globalNum}</div>
      <div>
        <button onClick={handlePlus}>インクリメント</button>
      </div>
      <div>
        <button onClick={handleMinus}>デクリメント</button>
      </div>
      <Link href="/page-b">/app-trial-bへ遷移</Link>

      <DialogJotai />
      <img src={globalFile ? URL.createObjectURL(globalFile) : ""} />
    </div>
  );
};
