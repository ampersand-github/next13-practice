import { Button } from "@/app/_components/ui/button";
import { UserAccountNav } from "@/features/auth";
import { getCurrentUser } from "@/lib/get-current-user";
import Link from "next/link";
import React from "react";

interface IndexLayoutProps {
  children: React.ReactNode;
}

export default async function BlogLayout({ children }: IndexLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* @ts-expect-error Async Server Component */}
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

const Header = async () => {
  const user = await getCurrentUser();
  return (
    <header className="z-40 border-b border-gray-200 bg-background px-8 md:px-16">
      <div className="flex h-20 items-center justify-between py-6">
        <SiteTile />
        <nav>
          {user ? (
            <div className="flex flex-auto space-x-8">
              <Button type={"button"}>
                <Link href={"/edit"}>投稿する</Link>
              </Button>
              <UserAccountNav
                name={user.name}
                image={user.image}
                email={user.email}
              />
            </div>
          ) : (
            <>
              <Button type={"button"}>
                <Link href={"/login"}>login</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};
const SiteTile = () => {
  return (
    <Link href="/">
      <h1 className="font-mono text-2xl font-black">tutorial</h1>
    </Link>
  );
};

const Footer = () => {
  return (
    <footer className="flex h-24 items-center justify-center  bg-gray-900 text-white">
      <p className="font-bold">@2023 Tutorial. All rights reserved.</p>
    </footer>
  );
};
