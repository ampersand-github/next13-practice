import { authOptions } from "@/lib/auth-option";
import NextAuth from "next-auth";

// @see ./lib/auth
export default NextAuth(authOptions);
