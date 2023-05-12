import { User } from "next-auth";
import { JWT } from "next-auth/jwt";

type UserId = string2;

declare module "next-auth/jwt" {
  interface JWT {
    id: UserId;
  }
}

declare module "next-auth" {
  interface Session {
    user: User & {
      id: UserId;
    };
  }
}
