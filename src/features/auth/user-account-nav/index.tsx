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
import Link from "next/link";

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
