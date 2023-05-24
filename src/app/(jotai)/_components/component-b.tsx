"use client";

import {
  globalFileAtom,
  globalNumAtom,
} from "@/app/(jotai)/_components/component-a";
import { useAtom } from "jotai";
import Link from "next/link";
import React from "react";

export const AppTrialBClientComponent = () => {
  const [globalNum, setGlobalNum] = useAtom(globalNumAtom);
  const [globalFile, setGlobalFile] = useAtom(globalFileAtom);
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

      <Link href="/page-a">/app-trial-aへ遷移</Link>
      <img src={globalFile ? URL.createObjectURL(globalFile) : ""} />
    </div>
  );
};
