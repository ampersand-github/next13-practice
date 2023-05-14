"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AvatarProps } from "@radix-ui/react-avatar";
import { User2Icon } from "lucide-react";
import { signOut } from "next-auth/react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import React, { useState } from "react";

interface UserAccountNavProps {
  name?: string | null;
  image?: string | null;
  email?: string | null;
}

export const UserAccountNav = ({ name, image, email }: UserAccountNavProps) => {
  const items = [
    { href: "/dashboard", text: "Dashboard" },
    { href: "/dashboard/billing", text: "Billing" },
    { href: "/dashboard/settings", text: "Settings" },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar name={name} image={image} className="h-8 w-8" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-2 leading-none">
            {name && <p className="font-medium">{name}</p>}
            {email && (
              <p className="w-[200px] truncate text-sm text-muted-foreground">
                {email}
              </p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        {items.map((item) => (
          <DropdownMenuItem asChild key={item.text}>
            <Link href={item.href}>{item.text}</Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={(event) => {
            event.preventDefault();
            signOut({
              callbackUrl: `${window.location.origin}`,
            });
          }}
        >
          <p className="text-red-500">Sign out</p>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

interface UserAvatarProps extends AvatarProps {
  name?: string | null;
  image?: string | null;
}

export const UserAvatar = ({ name, image, ...props }: UserAvatarProps) => (
  <Avatar {...props}>
    {image ? (
      <AvatarImage alt="Picture" src={image} />
    ) : (
      <AvatarFallback>
        <span className="sr-only">{name}</span>
        <User2Icon />
      </AvatarFallback>
    )}
  </Avatar>
);

export const GithubButton = () => {
  const [isGitHubLoading, setIsGitHubLoading] = useState(false);

  const handleClick = async () => {
    setIsGitHubLoading(true);
    await signIn("github", { callbackUrl: "/" });
  };

  return (
    <>
      {isGitHubLoading ? (
        <div className="flex justify-center">
          <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      ) : (
        <button
          type="button"
          className="text-white bg-[#24292F] hover:bg-[#24292F]/90 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-500 dark:hover:bg-[#050708]/30 mr-2 mb-2"
          disabled={isGitHubLoading}
          onClick={handleClick}
        >
          <GithubIcon />
          Sign in with GitHub
        </button>
      )}
    </>
  );
};
const GithubIcon = () => (
  <svg
    className="w-4 h-4 mr-2 -ml-1"
    aria-hidden="true"
    focusable="false"
    data-prefix="fab"
    data-icon="github"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 496 512"
  >
    <path
      fill="currentColor"
      d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"
    ></path>
  </svg>
);
