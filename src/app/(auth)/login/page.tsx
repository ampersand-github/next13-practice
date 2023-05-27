import { GithubButton } from "@/app/_components/clients";
import { getCurrentUser } from "@/lib/get-current-user";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
};

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect("/");

  return (
    <main className="flex flex-col items-center justify-between space-y-8 p-24">
      <GithubButton />
    </main>
  );
}
