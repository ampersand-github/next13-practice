import { UserAccountNav } from "@/components/clients";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/get-current-user";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default async function Home() {
  const user = await getCurrentUser();
  return (
    <main className="flex flex-col items-center justify-between p-24 space-y-8">
      <Image
        className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
        src="/next.svg"
        alt="Next.js Logo"
        width={160}
        height={40}
        priority
      />
      {user ? (
        <UserAccountNav
          name={user.name}
          image={user.image}
          email={user.email}
        />
      ) : (
        <Button type={"button"}>
          <Link href={"/login"}>login</Link>
        </Button>
      )}
      <Button type={"button"}>
        <Link href={"/tutorial"}>tutorial</Link>
      </Button>
    </main>
  );
}
