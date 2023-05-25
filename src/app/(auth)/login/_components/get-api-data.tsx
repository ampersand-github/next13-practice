"use client";

import { getData } from "@/app/(auth)/login/_components/get-data";
import { Button } from "@/components/ui/button";

type Props = { data: any };
export const Data = async (props: Props) => {
  const data = await getData();
  const handleClick = async () => {
    await fetch("http://localhost:3000/api/tutorial", {
      method: "POST",
      body: JSON.stringify({ data: "hello" }),
    });
    window.location.reload();
  };
  return (
    <>
      <>{JSON.stringify(props)}</>
      <>{JSON.stringify(data)}</>
      <Button onClick={handleClick}>get data</Button>
    </>
  );
};
