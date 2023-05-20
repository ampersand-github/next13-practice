import { DemoPage } from "@/app/(modal)/modal/_components/demo-page";
import { DialogDemo } from "@/app/(modal)/modal/_components/modal";
import React from "react";

export default async function ModalPage() {
  return (
    <main className="flex flex-col items-center justify-between p-24 space-y-8">
      <h1>Modal Page</h1>
      <div>
        <DemoPage />
      </div>
    </main>
  );
}
